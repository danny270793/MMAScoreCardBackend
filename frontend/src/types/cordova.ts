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

declare global {
  interface Window {
    cordova: Cordova | undefined
    device: Device | undefined
  }
}
