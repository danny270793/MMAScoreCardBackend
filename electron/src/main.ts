import { app, BrowserWindow, ipcMain } from 'electron'
import * as Path from 'path'

const isDebug: boolean = process.env.NODE_ENV === 'development'
const htmlPath: string = Path.join(__dirname, '..', 'www', 'index.html')

async function createWindow(): Promise<void> {
  const mainWindow: BrowserWindow = new BrowserWindow({
    width: 600 + (isDebug ? 400 : 0),
    height: 800,
    webPreferences: {
      preload: Path.join(__dirname, 'preload.js'),
    },
  })

  await mainWindow.loadFile(htmlPath)
  if (isDebug) {
    mainWindow.webContents.openDevTools()
  }
}

app.on('activate', async (): Promise<void> => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(() => {
  createWindow()
})
