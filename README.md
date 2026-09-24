# HyvesFoto.nl

Crop and combine photos so they fit the Hyves timeline instead of being
hard-cropped through someone's face.

Hyves renders timeline images at roughly **15:6** and crops anything that
doesn't match to fit — no matter what's in the frame. HyvesFoto lets you
choose the crop yourself, or lay several photos out into one magazine-style
collage sized to the timeline ratio, and export an image that already fits.

**Everything runs in the browser.** There's no backend, no database, no
account. Your photos are never uploaded: they're held as Blobs in IndexedDB
on your own device and composed on a `<canvas>` locally.

> **Not affiliated with Hyves.** This is an independent, unofficial fan tool
> with no association with, endorsement from, or connection to Hyves or its
> operators. "Hyves" and any related names, logos, and brand assets are the
> property of their respective owners and are referenced here only to
> describe the timeline format this tool targets.

## Features

- **Single-photo crop** — pan and zoom a photo inside the target frame with
  live preview.
- **Collage grid** — drop in multiple photos, arrange them into one
  timeline-shaped collage, and drag to swap tiles.
- **Export** — render the result to an image sized for the Hyves timeline.
- **Nothing leaves the device** — no uploads, no tracking, no server state.

## Getting started

```bash
pnpm install
pnpm exec playwright install chromium   # needed for story + e2e tests
pnpm dev
```

Open http://localhost:3000.

## Scripts

| Command              | What it does                                    |
| -------------------- | ----------------------------------------------- |
| `pnpm dev`           | Dev server                                      |
| `pnpm build`         | Production build                                |
| `pnpm start`         | Serve the production build                      |
| `pnpm test`          | Unit + component tests (Vitest)                 |
| `pnpm test:watch`    | The same, in watch mode                         |
| `pnpm test:stories`  | Every Storybook story, smoke-tested in Chromium |
| `pnpm test:e2e`      | Playwright, against a production build          |
| `pnpm test:coverage` | Coverage report                                 |
| `pnpm storybook`     | Storybook on :6006                              |
| `pnpm lint`          | ESLint                                          |
| `pnpm typecheck`     | `tsc --noEmit`                                  |
| `pnpm format`        | Prettier                                        |

CI (`.github/workflows/ci.yml`) runs format, lint, types, unit tests, build,
story smoke tests, and Playwright e2e on every push and pull request to
`main`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · styled-components ·
zustand · IndexedDB (`idb`) · dnd-kit · Vitest · Playwright · Storybook 10

## A note on the timeline ratio

The 15:6 crop ratio is Hyves's current best-guess measurement, not a
confirmed constant — a feed screenshot once measured closer to 9:4. The value
lives in one place, [`src/content/aspectRatios.ts`](./src/content/aspectRatios.ts),
and nothing else hard-codes it, so correcting it is a one-line change.

## Conventions

Atomic design, functional style (no classes, immutable updates, pure
geometry helpers), colocated tests. See [CLAUDE.md](./CLAUDE.md) for the full
set of conventions this codebase is written against.

## Contributing

Issues and pull requests are welcome. Please run `pnpm lint`, `pnpm
typecheck`, and `pnpm test` before opening a PR — CI runs the same checks
plus stories and e2e.

## License

[MIT](./LICENSE) — for this project's own code only. It does not grant any
rights to the Hyves name, logos, or other Hyves brand assets, which remain
the copyright of their respective owners.
