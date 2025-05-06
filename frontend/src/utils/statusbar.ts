import { Capacitor } from '@capacitor/core'
import { StatusBar as CapacitorStatusBar } from '@capacitor/status-bar';
import { Logger } from './logger';

const logger = new Logger('/src/utils/statusbar.ts')

export const StatusBar = {
    backgroundColorByHexString: (color: string) => {
        const isNativePlatform: boolean = Capacitor.isNativePlatform()
        logger.debug(`isNativePlatform: ${isNativePlatform}`)
        if(isNativePlatform) {
            CapacitorStatusBar.setBackgroundColor({ color})
        }
        // if(window.StatusBar) {
        //     window.StatusBar.backgroundColorByHexString(color)
        // }
    }
}