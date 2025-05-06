export const StatusBar = {
    backgroundColorByHexString: (color: string) => {
        if(window.StatusBar) {
            window.StatusBar.backgroundColorByHexString(color)
        }
    }
}