# Avatar and Track Experience

This document records the frontend behavior introduced by the blob-avatar,
track-browser, and Stage player work.

## Blob avatars

- `BlobAvatarDisplay` is the shared renderer for authenticated users, guests,
  creator links, menus, profile headers, and track artwork fallbacks.
- Avatar choices are stored as structured avatar data through the existing user
  service. Legacy or missing avatar values fall back deterministically, so the
  same user keeps the same generated appearance.
- The signed-in user avatar stays animated in the account menu. Creator avatars
  animate when their card or menu is being interacted with, and the profile
  owner avatar animates in the profile header.
- Guests use the `Guest` label and a deliberately animated default avatar.

## Track artwork and layouts

- `TrackArtwork` centralizes image loading, error handling, and fallback rules.
  A submitted track thumbnail is preferred; otherwise the creator's blob avatar
  is rendered on a stable, track-specific color palette.
- Track browsing supports Rows, Tiles, and Spotlight presentations without
  changing filtering, favorites, menus, playback, or pagination behavior.
- Rows use independently rounded items. Empty row results are separated from
  the column header so the header rule and dashed empty-state border do not
  visually collide.
- Spotlight uses a compact horizontal feature card so it remains visible in the
  reduced content width created by the desktop player.

## Responsive application shell

- The desktop shell uses a collapsible left sidebar and an inset right-side
  Stage player. The player aligns with the main content's top edge and exposes
  all four corners as a distinct window.
- Mobile keeps the existing responsive navigation model, using a bottom tab bar
  and compact player bar. The header create button opens links for Upload and
  Analyze instead of duplicating the desktop navigation.
- The player is only mounted when a track is active.

## Playback and queue

- `PlayButton` is shared by track rows, tiles, Spotlight, the Stage, and queue
  items. Its playing state uses a subtle animated rough-edge ring and respects
  reduced-motion preferences.
- The Stage shows track artwork, creator information, progress, transport,
  volume, favorite, options, and queue controls in one right-side panel.
- Queue and upcoming-playlist sections share the existing playback manager and
  drag/drop ordering logic. Items can move within or between sections, be
  removed, or be selected directly with their play button.
- Selecting an upcoming item calls the playback manager's `skipToTrack` path,
  so the Stage's previous and next controls continue using the central playlist
  state rather than maintaining a second player-specific queue.

## Verification

Run the following before merging changes to this experience:

```bash
npm run lint
npm test
npm run build -- --webpack
```

The queue utility tests cover same-list reordering and cross-list moves without
duplicating a track.
