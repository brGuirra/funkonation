# PRD --- Funkonation Micro-Frontend Demo

## 1. Overview

**Funkonation** is a small micro-frontend ecommerce demo built to
demonstrate **Module Federation architecture and deployment with Zephyr
Cloud**.

The application sells **Funko Pop collectible figures**.

The project intentionally focuses on:

-   Runtime composition using Module Federation
-   Independent deployment of micro-frontends
-   Shared dependencies between applications
-   Demonstrating provider/consumer relationships

This is **not a production ecommerce application**.

The system uses:

-   static JSON files
-   in-memory state
-   browser localStorage

No backend or database is used.

------------------------------------------------------------------------

# 2. Goals

## Primary Goals

1.  Demonstrate **Module Federation architecture**
2.  Deploy multiple apps using **Zephyr Cloud**
3.  Show **runtime loading of remote applications**
4.  Provide a clear example of **micro-frontend boundaries**

## Secondary Goals

-   Maintain a realistic ecommerce flow
-   Keep implementation small and understandable

------------------------------------------------------------------------

# 3. Non-Goals

The following features are **out of scope**:

-   Authentication
-   Payments
-   Backend APIs
-   Databases
-   Order management
-   Admin panels
-   Product search
-   Inventory synchronization

------------------------------------------------------------------------

# 4. High Level Architecture

The application consists of **three independent frontend applications**.

Host (Shell Application) │ ├── Catalog Remote └── Cart / Checkout Remote

Each application is deployed independently and composed at runtime using
**Module Federation**.

------------------------------------------------------------------------

# 5. Micro-Frontend Architecture

## 5.1 Host Application

The Host acts as the **application shell**.

Responsibilities:

-   Global layout
-   Navigation
-   Routing
-   Shared UI components
-   Shared application state (cart)
-   Loading remote modules dynamically

The host **consumes modules exposed by remotes**.

------------------------------------------------------------------------

## 5.2 Catalog Remote

The Catalog Remote provides **product browsing functionality**.

Responsibilities:

-   Product listing
-   Product details page
-   Reading product data from JSON

Exposed modules:

ProductList\
ProductDetails

------------------------------------------------------------------------

## 5.3 Cart / Checkout Remote

The Checkout Remote manages **cart and checkout functionality**.

Responsibilities:

-   Display cart contents
-   Update item quantities
-   Remove items
-   Simulate checkout

Exposed modules:

CartView\
CheckoutView

------------------------------------------------------------------------

# 6. Technology Stack

Framework

React

Bundler

Rsbuild

Federation

Module Federation

Deployment

Zephyr Cloud

State management

React Context

Persistence

localStorage

------------------------------------------------------------------------

# 7. Module Federation Configuration

## Host

Consumes modules from remotes:

catalog/ProductList\
catalog/ProductDetails\
checkout/CartView\
checkout/CheckoutView

------------------------------------------------------------------------

## Catalog Remote

Exposes:

./ProductList\
./ProductDetails

------------------------------------------------------------------------

## Checkout Remote

Exposes:

./CartView\
./CheckoutView

------------------------------------------------------------------------

## Shared Dependencies

Shared as singletons:

react\
react-dom

Purpose:

Prevent multiple React instances across micro-frontends.

------------------------------------------------------------------------

# 8. Data Model

Product data is stored in a static JSON file.

/data/products.json

Images are hosted externally on a **CDN or external store** and
referenced directly in the JSON.

Current entry shape:

``` ts
type ProductEntry = {
  id: string;
  slug: string;
  url: string;
  name: string;
  number: number;
  series: string;
  line: string | null;
  rarity: string | null;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
  source: string;
};
```

Notes:

-   `price` is stored as a number in dollars and may include decimals.
-   `line` and `rarity` can be `null` when the scraped source does not provide a value.
-   `rarity` is source-driven and currently includes mixed casing such as `rare`, `exclusive`, `Exclusive`, and `Chase`.
-   `imageUrl` is the current image field name. The old `image` field is no longer used.
-   `source` identifies the upstream data source for the scraped entry.

Example:

``` json
[
  {
    "id": "c7ff7b2b-9d1c-4ce4-88a6-e93d13d118f7",
    "slug": "huckleberry-hound-green-15",
    "url": "https://popiq.dev/series/funko-pop-animation/huckleberry-hound-green-15",
    "name": "Huckleberry Hound [Green] #15",
    "number": 15,
    "series": "Animation",
    "line": "Pop! Vinyl",
    "rarity": null,
    "price": 3825,
    "imageUrl": "https://storage.googleapis.com/images.pricecharting.com/jjmeujathy57rkgj/1600.jpg",
    "description": "Current value: $3825.00. Track price history, compare variants, and find the best deals on this Animation Funko Pop.",
    "stock": 15,
    "source": "popiq"
  }
]
```

------------------------------------------------------------------------

# 9. Cart Model

Cart state is stored in **localStorage**.

Example structure:

``` json
{
  "items": [
    {
      "productId": "batman-funko",
      "quantity": 2
    }
  ]
}
```

Cart state is managed via a **CartContext provider**.

------------------------------------------------------------------------

# 10. Shared State

Shared state is owned by the **Host application**.

Provider:

CartProvider

The provider wraps the entire application.

Example:

`<CartProvider>`{=html} `<RemoteCatalog />`{=html}
`<RemoteCheckout />`{=html} `</CartProvider>`{=html}

Remote components can consume the shared cart state.

------------------------------------------------------------------------

# 11. Routing

Routes are handled by the **Host application**.

/ → Home (Product Catalog)\
/product/:id → Product Details\
/cart → Cart\
/checkout → Checkout

------------------------------------------------------------------------

# 12. Feature Specifications

## Product Catalog

Displays a grid of Funko figures.

Each item shows:

-   image
-   product name
-   price
-   add to cart button

Data source:

products.json

------------------------------------------------------------------------

## Product Details

Displays full details of a product.

Features:

-   large product image
-   description
-   price
-   stock
-   add to cart button

------------------------------------------------------------------------

## Cart

Displays items currently in the cart.

Features:

-   product name
-   quantity selector
-   remove item
-   total price
-   checkout button

------------------------------------------------------------------------

## Checkout

Simulated checkout flow.

Features:

-   summary of cart items
-   total price
-   confirm order button

When confirmed:

clear cart\
show confirmation message

------------------------------------------------------------------------

# 13. Navigation

Global navigation is rendered by the **Host application**.

Navbar:

Funkonation logo\
Home\
Cart (with item count)

------------------------------------------------------------------------

# 14. UI Guidelines

The UI should remain simple and minimal.

Focus on:

-   clarity
-   usability
-   easy navigation

Layout example:

Header\
Product Grid\
Footer

------------------------------------------------------------------------

# 15. Deployment

Each application is deployed independently using **Zephyr Cloud**.

Applications:

host\
catalog-remote\
checkout-remote

Each remote exposes a **remote entry file** used by the host.

------------------------------------------------------------------------

# 16. Repository Structure

Recommended repository structure:

funkonation-mf-demo │ ├── host ├── catalog-remote ├── checkout-remote │
├── shared │ └── data └── products.json

------------------------------------------------------------------------

# 17. Success Criteria

The project is successful if:

-   Host loads remote modules dynamically
-   Catalog and checkout work as independent apps
-   Applications deploy successfully on Zephyr
-   Architecture clearly demonstrates Module Federation

------------------------------------------------------------------------

# 18. Deliverables

The final submission must include:

1.  Public GitHub repository
2.  Deployed applications
3.  README explaining:
    -   architecture
    -   Module Federation setup
    -   Zephyr deployment
    -   project structure
