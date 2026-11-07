export const RELEASE_VIEW_STORAGE_KEY = 'trackfusionweb:last-viewed-release'
export const RELEASE_VIEW_EVENT = 'trackfusionweb:release-viewed'
export const NEW_RELEASE_WINDOW_DAYS = 7

export function isRecentlyPublished(
    release,
    now = new Date(),
    windowDays = NEW_RELEASE_WINDOW_DAYS
) {
    if (!release?.highlight || !release?.date) return false

    const publishedAt = new Date(`${release.date}T00:00:00Z`)
    const age = now.getTime() - publishedAt.getTime()
    const windowMilliseconds = windowDays * 24 * 60 * 60 * 1000

    return age >= 0 && age <= windowMilliseconds
}

export function initializeReleaseStatus(storage, release, now = new Date()) {
    if (!storage || !release?.version) return false

    try {
        const viewedVersion = storage.getItem(RELEASE_VIEW_STORAGE_KEY)

        if (!viewedVersion) {
            storage.setItem(RELEASE_VIEW_STORAGE_KEY, release.version)
            return false
        }

        return (
            viewedVersion !== release.version &&
            isRecentlyPublished(release, now)
        )
    } catch {
        return false
    }
}

export function markReleaseViewed(storage, version) {
    if (!storage || !version) return false

    try {
        storage.setItem(RELEASE_VIEW_STORAGE_KEY, version)
        return true
    } catch {
        return false
    }
}
