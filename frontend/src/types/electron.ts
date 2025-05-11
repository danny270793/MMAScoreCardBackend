interface Version {
    app: () => string
}

interface Electron {
    version: Version
}

declare global {
  interface Window {
    electron: Electron | undefined
  }
}
