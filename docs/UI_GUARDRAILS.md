# TrackFusionWeb UI Guardrails

Use this checklist when changing shared track, queue, navigation, or playback
components. A redesign is incomplete if it silently removes one of these
behaviors.

## Change discipline

1. Inspect the existing component and its callers before replacing markup.
2. List the existing interactions the component provides, including keyboard,
   drag/drop, scrolling, context menus, and responsive states.
3. Prefer a presentation variant around shared state and behavior instead of a
   second implementation. The Stage queue, for example, must use
   `TrackListQueue` and `TrackManagerContext` rather than private queue state.
4. Verify desktop, constrained desktop with the Stage open, tablet, and mobile
   behavior before considering the change complete.
5. Keep unrelated feature changes in separate commits so a visual experiment
   can be reverted without removing a bug fix.

## Track row contract

- Play, artwork/title, visible tags, creator, duration, favorite, and context
  controls must remain in one grid row.
- Responsive visibility is controlled by `.track-browser` container queries,
  not viewport guesses. Do not add display utilities such as `flex` or `hidden`
  to elements whose display is owned by those queries; utility-layer rules can
  override component-layer breakpoints.
- Narrow layouts hide lower-priority metadata and retain it in the compact
  subtitle. They must never push actions into an implicit second grid row.
- Rows, Tiles, and Spotlight must preserve playback, favorite, creator, menu,
  filter, and artwork-fallback behavior.

## Queue contract

- Queue and Next from playlist remain visibly distinct and use the central
  playback manager.
- Each item supports direct playback, removal, the complete track context menu,
  and drag/drop reordering within and between lists.
- While dragging, moving near any scrollable edge auto-scrolls that container.
  Top/bottom and left/right edges are supported, and speed increases as the
  pointer moves farther past an edge.
- Interactive child controls must stop pointer/mouse-down propagation so a menu,
  play, or remove click cannot accidentally begin a drag.
- Drop indicators and empty-list drop targets must remain visible.

## Playback contract

- Only one playback source of truth is allowed: `TrackManagerContext` plus the
  shared audio element.
- Previous/next, shuffle, repeat, progress, volume, favorites, track options,
  queue count, and mobile player access must survive layout changes.
- Persist user presentation preferences locally for guests as well as signed-in
  users, and respect reduced-motion settings.

## Required verification

```bash
npm run lint
npm test
npm run build -- --webpack
```

Also run `git diff --check` and inspect the final diff for removed event handlers
or controls. Tests for pure layout/interaction utilities should cover boundary
behavior such as queue insertion and edge-scroll acceleration.
