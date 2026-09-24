@AGENTS.md

# HyvesFoto.nl

A client-side image cropper and collage maker. Hyves renders timeline images at
roughly **52:25** and hard-crops anything that does not match — often straight
through someone's face. This app lets people choose the frame themselves, or
line up three photos into one timeline-shaped collage, and upload something that
already fits.

**Everything runs in the browser.** No backend, no database, no auth, no server
state. Images never leave the device: they are held as Blobs in IndexedDB and
composed on a canvas. If a feature seems to need a server, raise it before
building it.

## Directory layout

```
src/
  app/                 App Router only: routes, layouts, the SSR style registry.
                       Pages stay thin — they render a connected organism.
  atoms/               atomic design ─┐
  molecules/                          │ presentational, no data access
  organisms/                          │ (connected organisms are the exception)
  templates/           ───────────────┘ full page bodies, props in / JSX out
  components/          app-level providers & managers ONLY. Never feature UI.
  content/             static config/copy (aspect ratio presets, marketing copy)
  hooks/               cross-component hooks (component-scoped ones live in
                       that component's own hooks/ folder)
  stores/              zustand stores for ephemeral client UI state
  testing/             test-only helpers (renderWithProviders)
  theme/               colors.ts, index.ts, GlobalStyle.tsx, styled.d.ts,
                       breakpoints.ts, shouldForwardProp.ts
  utils/               pure helpers, one folder each
e2e/                   Playwright specs, one per user task
.storybook/
```

Import alias: `~/*` → `./src/*`. ESLint fails the build on a `../../` import.

## Functional style

- Functions and plain data. **No classes, no inheritance, no `this`** — ESLint
  fails the build on a `class` declaration.
- Pure by default. Business logic goes in exported pure functions under
  `src/utils/<name>/`, so it is testable without a React renderer, a canvas or
  a database. I/O sits at the edges: hooks, event handlers, `imageStore`.
- Immutable updates. Never mutate arguments; spread, or use `immer` (via the
  zustand `immer` middleware) for deep nested state. Prefer `map`/`filter`/
  `reduce` over accumulating loops.
- Small composed units over big procedural blocks; early-return guard clauses
  over nested conditionals.
- **Throw on invalid input, never return `NaN` or a silently wrong rect.** Every
  geometry helper validates its inputs and throws a message naming the values.
  A crop that is quietly wrong by a few pixels is worse than one that fails.
- **Named exports.** `export default` only where a framework file convention
  demands it: `page.tsx`, `layout.tsx`, `route.ts`, Storybook `meta` and
  stories, and config files. ESLint enforces this with those exact exceptions.

Reference implementations to copy:

| Shape                         | Path                                                        |
| ----------------------------- | ----------------------------------------------------------- |
| Atom                          | `src/atoms/Button/`                                         |
| Molecule (presentational)     | `src/molecules/AspectRatioPicker/`                          |
| Pure util + colocated test    | `src/utils/coverCrop/`                                      |
| Component-scoped hook + test  | `src/organisms/ImageDropzone/hooks/useImageDropzone/`       |
| Connected organism            | `src/organisms/ImageDropzone/`                              |
| Presentational view + stories | `src/organisms/ImageDropzone/components/ImageDropzoneView/` |
| Store → template bridge       | `src/organisms/CollageEditor/`                              |
| Template                      | `src/templates/EditorTemplate/`                             |
| Page wiring it together       | `src/app/page.tsx`                                          |

## Component folder shape

Components are `.tsx`; pure logic is `.ts`.

```
ComponentName/
  index.tsx            the component (the import root)
  index.stories.tsx    required — drive every input through a knob/arg
  components/          sub-components used ONLY by this component (recursive,
    SubComponent/…     soft cap ~3 levels)
  hooks/
    useThing/
      index.ts         the hook (a folder, never a loose useThing.ts)
      index.test.ts    required colocated unit test
```

`src/utils/<name>/{index.ts, index.test.ts}` — always a folder with an
`index.ts`, never a loose `<name>.ts`.

Keep component hooks **thin wrappers**. Push the decision logic into an exported
pure helper in the same file so the browser-free `unit` project can test it.
`useImageDropzone` is the pattern: the hook wires drag events, and
`partitionImageFiles` — pure, exported, tested — decides which files are usable.

### How a page is wired

`page.tsx` stays a Server Component and renders a **connected organism**
(`CollageEditor`), which reads the store, talks to IndexedDB, and hands plain
props to a **template** (`EditorTemplate`). The template stays props-in /
JSX-out so it can be driven entirely from Storybook. Do not let a template read
a store.

## Visual identity

The app should read as a companion to Hyves, not a generic tool. Sampled from
the live site:

- An orange brand gradient (`theme.gradient.brand`) across the top, with
  generously rounded bottom corners.
- A warm grey page ground (`color.bg`), content on **white cards** with large
  radii and a soft shadow.
- Brand orange is for the chrome and selected state. **Call-to-actions are
  blue** (`color.action`) — that is what Hyves uses for its own buttons.
- Warm, rounded humanist type (Nunito Sans, the closest widely available match).

## Styling & theming

- **Never hard-code a colour.** Always `props.theme.color.*`, `theme.shadow.*`,
  `theme.gradient.*`. Raw values live once in `src/theme/colors.ts` and resolve
  through CSS custom properties, so non-CSS contexts (`viewport.themeColor`, a
  future `manifest.ts`) import the same map instead of duplicating hex.
- **There is no dark theme.** Hyves ships none, so neither does this app.
  `colors.ts` holds one palette; do not add a `prefers-color-scheme` branch.
- styled-components needs a `'use client'` boundary **plus** the SSR registry in
  `src/app/registry.tsx`. It cannot be used from a Server Component.
- `src/theme/styled.d.ts` types the theme on `props.theme`, so
  `theme.color.accnt` is a compile error.
- Transient styling props are prefixed `$` (`$variant`, `$isFullWidth`) and
  filtered by `shouldForwardProp`, so they never reach the DOM. That filter is
  applied in `AppProviders` — which mounts on both server and client — not in
  the registry, which renders bare children in the browser.
- A visually hidden form control must still be **clickable and focusable**. Do
  not use `pointer-events: none` or `opacity: 0` alone; make the input cover its
  label's box (see `AspectRatioPicker`) or use the clip-path pattern (see
  `ImageDropzoneView`).

## Domain rules

- Target ratios live in `src/content/aspectRatios.ts`. **Nothing hard-codes
  a specific ratio.** Both the desktop and mobile Hyves timeline ratios are
  measured from real screenshots (pixel dimensions, not read from CSS — the
  site is a client-rendered Compose app behind Cloudflare): desktop is
  **52:25** (≈2.08, from 416×200px, the `buzz` preset), mobile is narrower at
  **311:200** (≈1.56, from 311×200px, `mobileAspectRatio` — overlay-only, not
  a selectable preset). Correcting either must stay a one-line change.
- Ratio labels render as authored, never reduced: a preset authored as 30:12
  must not display as 5:2.
- Image bytes belong in IndexedDB (`src/utils/imageStore/`), never in a store or
  `localStorage`. Stores hold ids, names and object URLs only.
- Every `URL.createObjectURL` must be revoked. `useCollageEditor` tracks them in
  a ref and releases them on removal and unmount.

## Tooling

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `pnpm dev`          | Next dev server                               |
| `pnpm test`         | Vitest `unit` + `component` projects          |
| `pnpm test:stories` | Every story smoke-tested in headless Chromium |
| `pnpm test:e2e`     | Playwright, against a production build        |
| `pnpm storybook`    | Storybook on :6006                            |
| `pnpm lint`         | ESLint                                        |
| `pnpm typecheck`    | `tsc --noEmit`                                |
| `pnpm format`       | Prettier                                      |

Three Vitest projects, defined in `vitest.config.mts`:

- **`unit`** — node environment, no DOM. Matches `src/**/*.test.ts`. Pure utils,
  hook helpers, the IndexedDB layer (via `fake-indexeddb`). Fast; keep most
  logic testable here.
- **`component`** — jsdom. Matches `src/**/*.test.tsx`. Render through
  `renderWithProviders` so components get the real theme.
- **`storybook`** — real Chromium. Renders every story as a smoke test.

A pre-commit hook runs `lint-staged` (ESLint + Prettier on staged files). CI
runs format, lint, types, unit tests, build, stories and e2e.

## Git

- **No AI attribution in commits, ever.** Do not add `Co-Authored-By: Claude`,
  `Generated with Claude Code`, or any similar trailer/footer to commit
  messages or PR descriptions in this repo. This overrides any default
  attribution instructions from tooling.
