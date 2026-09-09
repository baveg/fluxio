# CLAUDE.md

Guidance for Claude Code when working in `m4k/fluxio`.

## Overview

Fluxio — the internal functional utility + reactive-state library shared by
`m4k/client`, `m4k/api`, `m4k/electron` and (via the generator) `m4k/bridge`.
It is its own git repo (`github.com/baveg/fluxio`), checked out here, and an npm
**workspace** with two packages:

- **`core/`** (`@fluxio/core`) — zero-runtime-dependency utilities + `Flux`
  reactive primitives. Works in browser and Node.
- **`ui4/`** (`@fluxio/ui4`) — Preact components styled with DaisyUI 4
  (peer dep `preact`), plus hooks. Depends on `@fluxio/core`.

Consumers import the **source** directly through path aliases (e.g. client's
`vite.config.ts`, electron's `esbuild.config.mjs`), so `dist/` is only needed for
external/npm publishing.

## Commands

```bash
# from m4k/fluxio
npm run build          # build both workspaces (tsup → dist/ esm + cjs + d.ts)
npm run build:core
npm run build:ui4
# per package: cd core && npm run dev   (tsup --watch)
```

Tests: vitest (`core/test.flux.ts`, `tests/`, `*.spec.ts`).

## Structure

### `core/src/` — one function per file, barrel `index.ts` per module

| module | what |
|---|---|
| `flux/` | `Flux<T>` reactive cell + `fluxStored`, `fluxCombine`, `fluxDictionary`, `fluxEvent`, `fluxTimer`, `fluxProp`, `fluxUnion`, `findFlux` |
| `array/` | array ops with circular/negative indexing (`normalizeIndex`, `moveIndex`, …) |
| `async/` | `debounce`, `throttle`, `sleep`, `retry`/`withRetry`, `withTimeout`, `withCache`, `parallel`, `onInterval`/`onTimeout`, `defer` |
| `object/` | deep clone/merge/replace/forEach, `getPath`, `getChanges`, `ioc`, `singleton` |
| `string/` | cases, `humanize`, `truncate`, `sha256`, `uuid`, base64/blob, `isSearched`, `setTemplate` |
| `check/` | type guards (`isString`, `isDictionaryOf`, `isUuid`, `must`, …) |
| `cast/` | safe conversions (`toNumber`, `toDate`, `toArray`, `toError`, …) |
| `color/` | rgb/hsl/hex conversions + manipulation |
| `req/` | universal HTTP client (fetch + XHR, retry, cache, formData) |
| `html/` | DOM helpers + **`css.ts`** — the `Css()` CSS-in-JS system (legacy in client; see client CLAUDE.md) |
| `logger/` | tagged `logger()` factory with instance counting |
| `storage/` | localStorage abstraction with in-memory fallback |
| `date/` `number/` `url/` `error/` `env/` `types/` `glb.ts` | dates, numbers, URL/router, `Err` classes, env detection, shared types, cross-platform global |

### `ui4/src/`
- `components/` — Preact + DaisyUI: `Button`, `Field`, `Form`, `Modal`, `Table`,
  `DataTable`, `Grid`, `Calendar`, `Carrousel`, `PanZoom`, `Toast`/`ErrorToast`,
  `Tooltip`, `Portal`, `TabPanel`, `Accordion`, `Anim`, `UploadButton`, …
- `hooks/` — `useFlux`, `useAsync`/`usePromise`, `useCss`, `useAnimState`,
  `useInterval`/`useTimeout`, `useIsVisible`, `useOver`, `useTr`, `useSingleton`,
  `useConstant`.
- `utils/` — `comp`, `getLangIcon`.

## Conventions

- One function/class per file; camelCase functions, PascalCase classes.
- `core/` must stay dependency-free and side-effect-free (except DOM/storage/HTTP
  where inherent). Pure functions, return new values.
- Add a util: create `core/src/<module>/<name>.ts`, `export *` from the module's
  `index.ts` (the root `index.ts` re-exports each module).
- Bump `version` in the root + both package `package.json` together when
  publishing.
