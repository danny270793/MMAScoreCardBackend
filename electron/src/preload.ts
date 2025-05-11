import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  version: {
    app: () => '0.0.1',
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
  }
})
