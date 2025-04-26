interface Cordova {
  platformId: 'android' | 'ios' | 'electron'
}
interface Device {
  cordova: string
  available: boolean

  platform: string
  model: string
  version: string

  manufacturer: string
  uuid: string
  isVirtual: boolean
  serial: string
  sdkVersion?: string
}

interface StatusBar {
  backgroundColorByHexString: (color: string) => void
}

declare global {
  interface Window {
    cordova: Cordova | undefined
    StatusBar: StatusBar | undefined
    device: Device | undefined
  }
}
