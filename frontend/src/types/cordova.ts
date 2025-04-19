interface Cordova {
  platformId: 'android'|'ios'
}

declare global {
  interface Window {
    cordova: Cordova | undefined
  }
}
