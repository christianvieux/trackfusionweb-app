export function supportsBrowserVolumeControl(navigatorValue) {
    if (!navigatorValue) return true

    const userAgent = navigatorValue.userAgent || ''
    const platform = navigatorValue.platform || ''
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent)
    const isIPadDesktopMode =
        platform === 'MacIntel' && navigatorValue.maxTouchPoints > 1

    return !isIOSDevice && !isIPadDesktopMode
}
