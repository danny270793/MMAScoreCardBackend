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

    const files = fs.readdirSync(reactBuildPath)
    files.map(file => {
        const fileFullPath = path.join(reactBuildPath, file)
        const stats = fs.statSync(fileFullPath)
        if(stats.isFile()) {
            const destPath = path.join(cordovaWWWPath, file)
            fs.copyFileSync(fileFullPath, destPath)
        } else if (stats.isDirectory()) {

        }
        console.log(fileFullPath)
    })

    copy(reactBuildPath, cordovaWWWPath)

    let VITE_BACKEND_URL = 'http://localhost:8000'
    const embeddedFile = path.join(context.opts.projectRoot, '..', 'frontend', '.env.embeded')
    const file = fs.readFileSync(embeddedFile)
    const lines = file.toString()
    lines.split('\n').forEach(line => {
        line = line.trim()
        const [key, value] = line.split('=')
        if(key.trim().startsWith('VITE_BACKEND_URL')) {
            VITE_BACKEND_URL = value.trim()
        }
    })


    const indexFile = path.join(cordovaWWWPath, 'index.html')
    const content = fs.readFileSync(indexFile, 'utf8')
    const newContent = content
        .replace('</title>', '</title>\n    <script src="cordova.js"></script>')
        .replace('type="module" crossorigin', '')
        .replace('rel="stylesheet" crossorigin', 'rel="stylesheet"')
        .replace(/(<meta[^>]+Content-Security-Policy"[^>]+content="[^"]*?)connect-src\s[^;]+;/, '$1connect-src ' + VITE_BACKEND_URL + ';')
    fs.writeFileSync(indexFile, newContent, 'utf8')

    console.log('React dist deployed into cordova')
}
