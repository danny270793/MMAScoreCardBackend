import { iphones } from './iphones'
import { macs } from './macs'

export const isiOS = (): boolean => {
  return (window.cordova && window.cordova.platformId === 'ios') || false
}

export const isAndroid = (): boolean => {
  return (window.cordova && window.cordova.platformId === 'android') || false
}

export const isElectron = (): boolean => {
  return (window.cordova && window.cordova.platformId === 'electron') || false
}

export const isWeb = (): boolean => {
  return window.cordova ? false : true
}

export interface DeviceInfo {
  platformId: string
  platform: string
  model: string
  version: string
}

export function getDeviceInfo(): DeviceInfo {
  return {
    platformId: getPlatformId(),
    platform: getPlatform(),
    model: getModel(),
    version: getVersion(),
  }
}

export function getPlatformId(): string {
  return (
    (window.cordova && window.cordova.platformId) ||
    getBrowserInfo(true).toLowerCase()
  )
}

export function getPlatform() {
  return isElectron()
    ? 'Electron'
    : (window.device && window.device.platform) || 'Browser'
}

export function getModel() {
  return (window.device && window.device.model) || getBrowserInfo(true)
}

export function getModelReadable(model: string) {
  return iphones[model] || macs[model] || model
}

export function getVersion() {
  return (window.device && window.device.version) || getBrowserInfo(false)
}

export function getManufacturer() {
  return (window.device && window.device.manufacturer) || navigator.platform
}

function getBrowserInfo(getModel: boolean): string {
  const userAgent: string = navigator.userAgent
  let returnVal: string = ''
  let offset

  if ((offset = userAgent.indexOf('Edge')) !== -1) {
    returnVal = getModel ? 'Edge' : userAgent.substring(offset + 5)
  } else if ((offset = userAgent.indexOf('Chrome')) !== -1) {
    returnVal = getModel ? 'Chrome' : userAgent.substring(offset + 7)
  } else if ((offset = userAgent.indexOf('Safari')) !== -1) {
    if (getModel) {
      returnVal = 'Safari'
    } else {
      returnVal = userAgent.substring(offset + 7)

      if ((offset = userAgent.indexOf('Version')) !== -1) {
        returnVal = userAgent.substring(offset + 8)
      }
    }
  } else if ((offset = userAgent.indexOf('Firefox')) !== -1) {
    returnVal = getModel ? 'Firefox' : userAgent.substring(offset + 8)
  } else if ((offset = userAgent.indexOf('MSIE')) !== -1) {
    returnVal = getModel ? 'MSIE' : userAgent.substring(offset + 5)
  } else if ((offset = userAgent.indexOf('Trident')) !== -1) {
    returnVal = getModel ? 'MSIE' : '11'
  }

  if (
    (offset = returnVal.indexOf(';')) !== -1 ||
    (offset = returnVal.indexOf(' ')) !== -1
  ) {
    returnVal = returnVal.substring(0, offset)
  }

  return returnVal
}
