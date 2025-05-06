#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function copy(source, destination) {
    const files = fs.readdirSync(source)
    files.map(file => {
        const fileFullPath = path.join(source, file)
        const destPath = path.join(destination, file)
        const stats = fs.statSync(fileFullPath)
        if(stats.isFile()) {
            fs.copyFileSync(fileFullPath, destPath)
        } else if (stats.isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true })
            copy(fileFullPath, destPath)
        }
    })
}

module.exports = function (context) {
    console.log('Running deploy_react.js hook')

    const reactBuildPath = path.join(context.opts.projectRoot, '..', 'frontend', 'dist')
    if (!fs.existsSync(reactBuildPath)) {
        console.error(`React dist folder not found at ${reactBuildPath}. Please build your React app first.`)
        process.exit(1)
    }

    const cordovaWWWPath = path.join(context.opts.projectRoot, 'www')
    if (fs.existsSync(cordovaWWWPath)) {
        console.log(`Removing existing files in ${cordovaWWWPath}`)
        fs.rmSync(cordovaWWWPath, { recursive: true, force: true })
    }
    fs.mkdirSync(cordovaWWWPath, { recursive: true })
    const gitkeepPath = path.join(reactBuildPath, '.gitkeep')
    fs.writeFileSync(gitkeepPath, '')

    copy(reactBuildPath, cordovaWWWPath)

    const indexFile = path.join(cordovaWWWPath, 'index.html')
    const content = fs.readFileSync(indexFile, 'utf8')
    const newContent = content
        .replace('</title>', '</title>\n    <script src="cordova.js"></script>')
        .replace('type="module" crossorigin', '')
        .replace('rel="stylesheet" crossorigin', 'rel="stylesheet"')
        .replace('ws://localhost:8001;', '')
    fs.writeFileSync(indexFile, newContent, 'utf8')

    const assetsPath = path.join(cordovaWWWPath, 'assets')
    fs.readdirSync(assetsPath).map((file) => {
        const fileFullPath = path.join(assetsPath, file)
        if(fileFullPath.endsWith('.js')) {
            const content = fs.readFileSync(fileFullPath, 'utf8')

            const newContent = content
                .replace(/import.meta.url/g, 'window.location.href')
                .replace(/new URL\("/g, 'new URL("assets/')
                
            fs.writeFileSync(fileFullPath, newContent, 'utf8')
        }
    })

    console.log('React dist deployed into cordova')
}
