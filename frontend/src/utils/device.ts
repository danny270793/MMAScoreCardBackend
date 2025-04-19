export const isiOS = (): boolean => {
    return (window.cordova && window.cordova.platformId === 'ios') || false
}

export const isAndroid = (): boolean => {
    return (window.cordova && window.cordova.platformId === 'android') || false
}
