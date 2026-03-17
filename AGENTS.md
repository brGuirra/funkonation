# Funkonation Agent Guide

## Purpose

Funkonation is a simple e-commerce platform for Funko products.

The main goal of this repository is to demonstrate a clean micro-frontend architecture using Module Federation and the Zephyr platform. Feature work should support that goal. Prefer decisions that make federation boundaries, deployment flow, and local development clearer over decisions that only add UI complexity.

This is a demo application, not a production storefront.

Project constraints from the PRD:

- No backend or database
- No authentication
- No payments
- No admin area
- No order management
- No search or inventory synchronization
- Product data should come from static JSON
- Cart state should use React Context plus `localStorage`

## Project Snapshot

- Package manager: `pnpm`
- Workspace layout: `consumers/*`, `providers/*`, and `packages/*`
- Bundler: `Rsbuild`
- UI stack: `React 19` + `TypeScript`
- Federation plugin: `@module-federation/rsbuild-plugin`
- Zephyr integration: `zephyr-rsbuild-plugin` (always-on in all apps, always the last plugin)

Current apps:

- Consumer shell: `consumers/ecommerce`
- Provider remote: `providers/product-catalog`
- Provider remote: `providers/cart`

Shared workspace packages:

- UI package: `packages/ui`

Current repo status:

- The host shell owns storefront routing for `/`, `/products`, `/products/$slug`, and `/cart`.
- The catalog provider exposes product-domain surfaces.
- The cart provider exposes `CartView` and `CartBadge`, both props-driven with cart state injected by the host. Cart and checkout are combined: the user reviews items and confirms directly from the cart page.
- Cart state lives in `CartContext` inside the host (`consumers/ecommerce/src/context/CartContext.tsx`) and persists to `localStorage`.
- The three-app PRD architecture is now complete.

Current local ports:

- `consumers/ecommerce` runs on `3000`
- `providers/product-catalog` runs on `3001`
- `providers/cart` runs on `3002`

## Current Federation Topology

The current source of truth for Module Federation is the `rsbuild.config.ts` file inside each app.

Current runtime wiring:

- Consumer MF name: `ecommerce`
- Provider MF name: `product_catalog`
- Provider MF name: `cart`
- Consumer remotes:
  - `product_catalog@http://localhost:3001/remoteEntry.js`
  - `cart@http://localhost:3002/remoteEntry.js`
- `product_catalog` exposes:
  - `./ProductList -> ./src/components/ProductList.tsx`
  - `./ProductDetails -> ./src/components/ProductDetails.tsx`
  - `./ProductCard -> ./src/components/ProductCard.tsx`
  - `./SeriesFilter -> ./src/components/SeriesFilter.tsx`
- `cart` exposes:
  - `./CartView -> ./src/components/CartView.tsx`
  - `./CartBadge -> ./src/components/CartBadge.tsx`
- Current consumer import examples:
  - `product_catalog/ProductList`
  - `product_catalog/ProductDetails`
  - `cart/CartView`
  - `cart/CartBadge`

## Current Product Architecture

The PRD three-application setup is complete:

- Host shell: `consumers/ecommerce`
- Catalog remote: `providers/product-catalog`
- Cart remote: `providers/cart`

Responsibilities:

- Host: global layout, navigation, routing (`/`, `/products`, `/products/$slug`, `/cart`), cart state ownership via `CartContext`, remote composition
- Catalog remote: product listing, product details, product data loading from static JSON
- Cart remote: cart badge for navigation, combined cart and order confirmation view (items, quantities, totals, remove, confirm order)

Active exposed modules:

- `product_catalog/ProductList`
- `product_catalog/ProductDetails`
- `product_catalog/ProductCard`
- `product_catalog/SeriesFilter`
- `cart/CartView`
- `cart/CartBadge`

Cart integration pattern:

- The "Add to bag" button UI lives inside catalog components (`ProductCard`, `ProductDetails`).
- Behavior is injected by the host via `onAddToCart` callback prop — the catalog never imports from the cart remote.
- `CartView` receives cart state and actions as props injected by the host `CartPage`. The user confirms the order directly from this view; there is no separate checkout step or route.
- `CartBadge` renders the cart icon with item count in the navigation header, receiving `itemCount` as a prop from the host.
- The host is the only app with knowledge of both remotes.
- All remote components are lazy-loaded with `Suspense` and wrapped in `RemoteBoundary` error boundaries for resilience.

Important rule:

- Treat the current `product_catalog/*` surface as the active catalog-domain contract.
- Treat the current `cart/*` surface as the active cart-domain contract.
- Do not introduce cross-remote imports between `product_catalog` and `cart`.

## Architecture Direction

This repo should evolve toward the PRD architecture, which is intentionally small and understandable.

Preferred boundaries:

- `consumers/ecommerce`: shell, TanStack Router ownership, page composition, shared layout, cart state orchestration
- `providers/product-catalog`: product listing, product details, product data access
- `packages/ui`: shared reusable UI source (shadcn-based components and shared styling tokens)

Prefer domain-oriented remote boundaries over arbitrary UI-only splits.
Keep product details inside the catalog domain unless the PRD changes.

## Working Rules For Future Sessions

Before editing:

- Inspect the relevant `package.json`, `rsbuild.config.ts`, and affected source files.
- Confirm whether the change belongs in the consumer shell, a provider, or a shared package.
- Check whether the task affects Module Federation names, remotes, exposes, shared deps, manifest URLs, or Zephyr metadata.

When changing shared code:

- Prefer `packages/*` for code shared at build time by multiple apps.
- Keep provider remotes focused on runtime-federated domain capabilities.
- If touching `packages/ui`, also verify app-level style/build wiring in affected consumers/providers.
- Treat `packages/ui/components.json` as the single shadcn source of truth for the monorepo.
- Do not add app-level `components.json` files under `consumers/*` or `providers/*` unless those apps intentionally own separate shadcn component source.

When changing federation behavior:

- Keep remote keys, container names, expose keys, and import specifiers consistent.
- Prefer stable business-facing exposes over deep internal file exposes.
- Keep `react` and `react-dom` shared across apps unless there is a very explicit reason not to.
- If adding new remotes, use clear business names instead of generic names like `remote` or `app1`.
- Keep the host's local remote URL aligned with the provider's `filename` output (`remoteEntry.js`) unless the federation loading strategy changes intentionally.
- `withZephyr()` must always be the last plugin in every app's `rsbuild.config.ts` — never conditional on build vs dev. Zephyr hooks into the bundling process for both remote resolution and edge deployment.
- Keep shared dep config minimal: `{ singleton: true }` is enough. Do not add `requiredVersion` — MF infers versions from `package.json`.
- Do not manually set `publicPath: "auto"` — the MF Rsbuild plugin handles this.

When changing host routing:

- Keep browser routing inside `consumers/ecommerce`; the catalog remote must stay router agnostic.
- Store catalog list state in `/products` search params using `series` and `page`.
- Preserve prior list search params when navigating from the list to product details and back.

When changing product features:

- Keep the scope aligned with a simple Funko e-commerce demo.
- Use domain language that matches Funkonation: catalog, product, cart, checkout, storefront.
- Avoid adding backend assumptions unless the task explicitly calls for them.
- Prefer static JSON for product data.
- Keep cart state in the host via React Context and persist it with `localStorage`.
- Treat checkout as simulated flow only unless the PRD changes.

When changing UI:

- Preserve simplicity.
- Favor clear composition points that are easy to federate later.
- Do not tightly couple consumer and provider state unless the integration pattern is intentional and documented.

## Repo-Specific Skill Usage

Use the local skills under `.agents/skills` when they match the task.

Recommended triggers:

- `mf-context`: first pass to understand the current federation setup
- `mf-config-check`: when remotes/exposes/build wiring seem wrong
- `mf-shared-deps`: when shared libraries duplicate or fail at runtime
- `mf-type-check`: when remote typings or `@mf-types` break
- `mf-bridge-check`: when Bridge usage is involved
- `mf-perf`: when local dev or HMR becomes slow
- `mf-docs`: when the task is mostly conceptual or requires API guidance

For this repo, start with `mf-context` before making non-trivial federation changes.

## Useful Commands

From the repo root:

- Install deps: `pnpm install`
- Build everything: `pnpm build` (Zephyr is always enabled — every build deploys to Zephyr's edge)
- Build consumer: `pnpm --filter ecommerce build`
- Build catalog provider: `pnpm --filter product_catalog build`
- Build cart provider: `pnpm --filter cart build`
- Run consumer dev server: `pnpm --filter ecommerce dev`
- Run catalog provider dev server: `pnpm --filter product_catalog dev`
- Run cart provider dev server: `pnpm --filter cart dev`

Product data:

- Static JSON lives at `providers/product-catalog/data/products.json`, owned by the catalog provider.

## Files To Check First

Consumer shell:

- `consumers/ecommerce/rsbuild.config.ts`
- `consumers/ecommerce/package.json`
- `consumers/ecommerce/src/App.tsx`
- `consumers/ecommerce/src/bootstrap.tsx`
- `consumers/ecommerce/src/context/CartContext.tsx`
- `consumers/ecommerce/src/router.tsx`
- `consumers/ecommerce/src/remotes.d.ts`
- `consumers/ecommerce/tsconfig.json`

Catalog provider remote:

- `providers/product-catalog/rsbuild.config.ts`
- `providers/product-catalog/package.json`
- `providers/product-catalog/src/components/ProductList.tsx`
- `providers/product-catalog/src/components/ProductDetails.tsx`
- `providers/product-catalog/src/components/ProductCard.tsx`
- `providers/product-catalog/src/components/SeriesFilter.tsx`
- `providers/product-catalog/src/catalog/data.ts`
- `providers/product-catalog/src/App.tsx`

Cart provider remote:

- `providers/cart/rsbuild.config.ts`
- `providers/cart/package.json`
- `providers/cart/src/types.ts`
- `providers/cart/src/components/CartView.tsx`
- `providers/cart/src/components/CartBadge.tsx`
- `providers/cart/src/App.tsx`

Workspace:

- `PRD.md`
- `package.json`
- `pnpm-workspace.yaml`
- `packages/ui/package.json`
- `packages/ui/src/components/ui/button.tsx`
- `packages/ui/src/styles/globals.css`

## Definition Of Done

For changes in this repo, prefer closing a session only after:

- The touched app or apps build successfully (including apps affected by shared `packages/*` changes).
- Federation names, remotes, exposes, and imports are still aligned.
- Zephyr-related config still matches the intended remote identity.
- Any newly introduced remote surface is easy to understand and documented in code.
- This `AGENTS.md` is updated if the architecture or conventions materially change.
