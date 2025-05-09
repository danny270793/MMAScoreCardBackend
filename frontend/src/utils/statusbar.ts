import { Capacitor } from '@capacitor/core'
import { StatusBar as CapacitorStatusBar } from '@capacitor/status-bar';
import { Logger } from './logger';

const logger = new Logger('/src/utils/statusbar.ts')

export const StatusBar = {
    backgroundColorByHexString: (color: string) => {
        const platform: string = Capacitor.getPlatform()
        logger.debug(`platform: ${platform}`)
        if(platform === 'android') {
            CapacitorStatusBar.setBackgroundColor({ color})
        }
        // if(window.StatusBar) {
        //     window.StatusBar.backgroundColorByHexString(color)
        // }
    }
}