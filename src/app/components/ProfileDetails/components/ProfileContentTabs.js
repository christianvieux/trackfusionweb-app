import { Card, Tabs } from '@heroui/react'

import TrackList from '../../TrackList'

export default function ProfileContentTabs({
    selectedTab,
    onSelectionChange,
    tracks,
    setTracks,
    favorites,
    setFavorites,
}) {
    return (
        <Card className="min-h-150 max-h-full w-full min-w-0 border-2 border-accent p-3 text-foreground shadow-card sm:p-4">
            <Tabs
                className="flex h-full min-h-0 w-full flex-col"
                selectedTab={selectedTab}
                onTabChange={onSelectionChange}
            >
                <Tabs.ListContainer>
                    <Tabs.List
                        aria-label="User content tabs"
                        className="bg-muted"
                    >
                        <Tabs.Tab id="tracks" className="text-foreground">
                            Tracks
                            <Tabs.Indicator className="bg-secondary" />
                        </Tabs.Tab>

                        <Tabs.Tab id="favorites" className="text-foreground">
                            Favorites
                            <Tabs.Indicator className="bg-secondary" />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>

                <Tabs.Panel id="tracks" className="max-h-full min-h-0">
                    <TrackList
                        trackList={tracks}
                        setTrackList={setTracks}
                        emptyMessage="No tracks uploaded yet"
                        className="rounded-lg bg-background p-2 sm:p-3"
                    />
                </Tabs.Panel>

                <Tabs.Panel id="favorites" className="max-h-full min-h-0">
                    <TrackList
                        trackList={favorites}
                        setTrackList={setFavorites}
                        emptyMessage="No favorite tracks yet"
                        className="rounded-lg bg-background p-2 sm:p-3"
                    />
                </Tabs.Panel>
            </Tabs>
        </Card>
    )
}
