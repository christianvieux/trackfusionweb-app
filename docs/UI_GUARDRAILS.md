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
- Track context menus keep common actions and navigation first, sharing and
  configuration next, and destructive queue or playlist removals last.

## App shell contract

- The global logo belongs in the top-left of the top bar, not in the sidebar.
  The top bar must not duplicate the active page title.
- Desktop creation actions remain in the top bar. Under `900px`, replace them
  with the accessible `+` menu and keep the avatar trigger visible.
- The desktop sidebar contains navigation only. Its collapse control stays at
  the bottom, the collapsed rail retains accessible names, and the preference
  persists in local storage for guests and signed-in users.
- Under `900px`, the sidebar becomes the four-item bottom tab bar. Desktop
  sidebar rules must not leak into this breakpoint.

## Search and empty-state contract

- The main track search keeps native input semantics while using the custom
  green focus treatment. Do not restore a browser or global purple focus ring
  on this field.
- The native search cancel decoration stays hidden. The visible clear control
  clears immediately, returns focus to the field, and Escape provides the same
  behavior.
- `/` focuses the main search only when the user is not already typing in an
  input, textarea, select, or editable element.
- Search and attribute filtering retain their existing matching behavior. A
  zero-result state must report the query, expose the relevant clear actions,
  and keep the header count at zero across Rows, Tiles, and Spotlight.

## Rendering and fallback contract

- A track without uploaded artwork uses a deterministic palette derived from
  its persisted track ID. Repeated instances of the same track must render the
  same palette; metadata is the fallback identity only when no ID exists.
- List rendering must not create one perpetual SVG animation per dormant play
  button. Expensive animated effects belong only to the active playback item.
- Shared creator lookups should be deduplicated across list views and concurrent
  mounts. A failed lookup must remain retryable.
- Memoization is a rendering optimization, not permission to omit interaction
  state or event handlers. Re-run the complete interaction checklist whenever a
  memo boundary is added.

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
- The desktop compact player must stay above the footer, keep each control group
  on one line, and progressively hide low-priority controls before allowing
  overlap or wrapping. Collapse and expand use the centered top-edge control.
- Mobile shell rules must explicitly override every desktop player-layout
  variant; adding a more specific desktop selector must not leave implicit grid
  columns or rows at the mobile breakpoint.
- The desktop Stage player should size to its content and cap itself to the main
  viewport; it must not stretch simply because the adjacent content column is
  taller.

## Required verification

```bash
npm run lint
npm test
npm run build -- --webpack
```

Also run `git diff --check` and inspect the final diff for removed event handlers
or controls. Tests for pure layout/interaction utilities should cover boundary
behavior such as queue insertion, edge-scroll acceleration, and deterministic
artwork palettes. Inspect the shell and track browser at exact `360px`, `768px`,
and desktop widths; headless Chromium may require device-metric emulation below
its `500px` minimum outer window.
