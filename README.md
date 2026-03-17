# Funkonation — Micro-Frontend Demo with Module Federation and Zephyr Cloud

A simple ecommerce application demonstrating a micro-frontend
architecture using Module Federation and deployed with Zephyr Cloud.

The system is composed of independently deployable applications that are
dynamically integrated at runtime.

> **Live demo:** [funkonation](https://br-guirra-gmail-com-311-ecommerce-funkonation-brg-754e24f28-ze.zephyrcloud.app)

---

## What this project demonstrates

- Micro-frontend architecture using Module Federation
- Runtime composition of independently deployed applications
- Shared dependency management across micro-frontends (React, ReactDOM, and lucide-react as singletons)
- Clear separation between host (consumer) and remotes (providers)
- Deployment and orchestration using Zephyr Cloud

---

## Architecture

    Host (ecommerce)
       ├── product_catalog (remote)
       └── cart (remote)

    ┌─────────────────────────────────────────────────┐
    │  ecommerce (host shell) — port 3000             │
    │  Routing, layout, cart state orchestration       │
    │                                                  │
    │  Consumes:                                       │
    │    ├── product_catalog/ProductList                │
    │    ├── product_catalog/ProductDetails             │
    │    ├── product_catalog/ProductCard                │
    │    ├── product_catalog/SeriesFilter               │
    │    ├── cart/CartView                              │
    │    └── cart/CartBadge                             │
    └────────┬──────────────────────────┬──────────────┘
             │                          │
             ▼                          ▼
    ┌────────────────────┐   ┌────────────────────┐
    │  product_catalog    │   │  cart               │
    │  port 3001          │   │  port 3002          │
    │                     │   │                     │
    │  Exposes:           │   │  Exposes:           │
    │  ./ProductList      │   │  ./CartView         │
    │  ./ProductDetails   │   │  ./CartBadge        │
    │  ./ProductCard      │   │                     │
    │  ./SeriesFilter     │   │                     │
    └────────────────────┘   └────────────────────┘
             │                          │
             └──────────┬───────────────┘
                        ▼
              ┌──────────────────┐
              │  @funkonation/ui  │
              │  (build-time)     │
              │  Shared UI source │
              └──────────────────┘

---

## Federation topology

| App | MF Container | Port | Role | Exposed Modules |
| --- | --- | --- | --- | --- |
| `consumers/ecommerce` | `ecommerce` | 3000 | Host (consumer) | — |
| `providers/product-catalog` | `product_catalog` | 3001 | Remote (provider) | `ProductList`, `ProductDetails`, `ProductCard`, `SeriesFilter` |
| `providers/cart` | `cart` | 3002 | Remote (provider) | `CartView`, `CartBadge` |

### Shared dependencies

All three apps share these libraries via Module Federation's `shared` config:

| Package | Strategy | Notes |
| --- | --- | --- |
| `react` | singleton, eager in host | Prevents duplicate React instances across remotes |
| `react-dom` | singleton, eager in host | Must match the React singleton |
| `lucide-react` | singleton | Shared icon library used by all apps |

The host marks `react` and `react-dom` as `eager` so they load immediately with the shell, before any remote code executes.

---

## Key decisions

- **Cart state lives in the host.** The host owns `CartContext` (React Context + `localStorage`) and injects cart actions into remote components via props.
- **Remote components are router-agnostic.** Navigation callbacks are injected via props.
- **No cross-remote imports.** Remotes are isolated; the host orchestrates composition.
- **UI is source-shared, not federated.** `@funkonation/ui` is a workspace package consumed at build time by all three apps, simplifying styling and avoiding runtime coupling.
- **Error boundaries wrap every remote.** Ensures graceful degradation if a remote fails to load.

---

## Routes

All routing is owned by the host application (`consumers/ecommerce`) using TanStack Router. Remote components receive navigation callbacks via props and never import the router directly.

| Route | Page | Notes |
| --- | --- | --- |
| `/` | — | Redirects to `/products` |
| `/products` | Product listing | Supports `series` and `page` search params |
| `/products/$slug` | Product details | Preserves list search params for back-navigation |
| `/cart` | Cart and checkout | Combined cart review and order confirmation |

---

## Zephyr Cloud integration

Every app includes `withZephyr()` as the **last plugin** in its `rsbuild.config.ts`. This hooks into the build pipeline for both local development and edge deployment.

How Zephyr is wired in this project:

- **Plugin placement:** `withZephyr()` is always the last entry in the `plugins` array of every `rsbuild.config.ts` (host and both remotes).
- **Dependency declaration:** The host's `package.json` declares a `zephyr:dependencies` field that tells Zephyr which remotes it consumes (`product_catalog` and `cart`).
- **Local dev:** Remotes resolve to hardcoded `localhost` URLs (`localhost:3001`, `localhost:3002`).
- **Deployed environments:** Zephyr dynamically resolves remote entry URLs based on the deployment environment — the same build works across environments without code changes.
- **Build = deploy:** Running `pnpm build` both bundles the apps and deploys artifacts to Zephyr's edge. There is no separate deploy step.

---

## Tech stack

- React 19 with TypeScript
- Rsbuild (Rspack)
- Module Federation (`@module-federation/rsbuild-plugin`)
- Zephyr Cloud (`zephyr-rsbuild-plugin`)
- TanStack Router
- Tailwind CSS v4
- pnpm workspaces

---

## Getting started

**Prerequisites:** Node >= 18 and pnpm. The repo locks to `pnpm@10.32.1` via the `packageManager` field — corepack will pick it up automatically.

```bash
pnpm install
pnpm dev
```

This starts three dev servers in parallel. Visit `http://localhost:3000` for the storefront. Ports 3001 (product catalog) and 3002 (cart) serve the remotes and do not need to be opened directly.

---

## Building

```bash
pnpm build
```

`withZephyr()` is always-on in every app's build config. Running `pnpm build` bundles providers first, then the consumer, and deploys all artifacts to Zephyr's edge in the process.

---

## Project structure

    funkonation/
    ├── consumers/
    │   └── ecommerce/          # Host shell — routing, layout, cart state
    ├── providers/
    │   ├── product-catalog/    # Catalog remote — product listing and details
    │   └── cart/               # Cart remote — cart badge, cart view, order confirmation
    └── packages/
        └── ui/                 # Shared UI source (shadcn-based, build-time only)

---

## Tradeoffs

- No backend — product data is static JSON
- Cart state persisted in `localStorage`
- UI package is shared at build time instead of federated

---

AI tools were used to accelerate boilerplate work; all architecture and design decisions were made and validated manually.
