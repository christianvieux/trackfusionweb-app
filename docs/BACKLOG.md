# TrackFusionWeb Backlog

## Recently completed

The blob-avatar, deterministic artwork, three-layout track browser, responsive
Stage player, queue interaction, and local upload/analyze portability work is
complete on `feat/blob-avatars-and-artwork-fix`. The final layout pass also
standardized interactive attribute pills across Rows, Tiles, and Spotlight.

Before merge, run the verification commands in
[`AVATAR_AND_TRACK_EXPERIENCE.md`](./AVATAR_AND_TRACK_EXPERIENCE.md) and review
the behavioral contracts in [`UI_GUARDRAILS.md`](./UI_GUARDRAILS.md).

## Draggable, dockable playback window

**Status:** Backlog — benched on purpose

Create a hybrid of the Stage right-side player and the Capsule floating bottom player. On desktop, a user can grab the playback window by a drag handle and dock it to the bottom, right, or left.

- Show translucent ghost drop zones while dragging so each dock position previews its resulting layout, then snap the player into place on release.
- The Capsule form is a floating glass bar using `rgba(10,10,28,.82)`, `blur(14px)`, a 1px `rgba(34,197,94,.4)` border, and a 24px radius. Its playback progress is a thin glowing line along the top, and its queue opens in a popover above it.
- Remember the chosen dock per user through local storage or a user setting.
- Provide a keyboard-accessible “Dock to: bottom / left / right” alternative.
- Keep mobile fixed to its bottom mini-bar with no dragging.
- Respect reduced-motion preferences.
- Keep the queue inline in side docks and use a popover in the bottom dock.

Acceptance sketch: the drag handle works with mouse and touch on desktop, ghost targets appear, the chosen dock survives reloads, and Discover Tracks container queries continue adapting as the main column changes width.
