import { Capacitor } from '@capacitor/core';
import { Device, DeviceInfo as CapacitorDeviceInfo } from '@capacitor/device';
import { iphones } from './iphones'
import { macs } from './macs'

export const isiOS = (): boolean => {
  return Capacitor.getPlatform() == 'ios'
}

export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() == 'android'
}

export const isElectron = (): boolean => {
  return false
}

export const isWeb = (): boolean => {
  return Capacitor.getPlatform() == 'web'
}

export interface DeviceInfo {
  platform: string
  model: string
  osModel: string
  version: string
  osVersion: string
  manufacturer: string
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  const info: CapacitorDeviceInfo  = await Device.getInfo()

  return {
    platform: info.platform,
    model: info.platform === 'web' ? getBrowserInfo(true) : info.model,
    osModel: info.model,
    version: info.platform === 'web' ? info.webViewVersion : info.osVersion,
    osVersion: info.osVersion,
    manufacturer: info.manufacturer
  }
}

export function getModelReadable(model: string) {
  return iphones[model] || macs[model] || model
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
