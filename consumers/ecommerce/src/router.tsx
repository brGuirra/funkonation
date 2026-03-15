import {
	createRootRoute,
	createRoute,
	createRouter,
	redirect,
} from "@tanstack/react-router";
import { StorefrontShell } from "./layouts/StorefrontShell";
import { parseCatalogSearch } from "./lib/catalog-search";
import { CartPage } from "./pages/CartPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { ProductsPage } from "./pages/ProductsPage";

const rootRoute = createRootRoute({
	component: StorefrontShell,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	beforeLoad: () => {
		throw redirect({ to: "/products", search: { page: 1 } });
	},
});

export const productsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/products",
	component: ProductsPage,
	validateSearch: parseCatalogSearch,
});

export const productDetailsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/products/$slug",
	component: ProductDetailsPage,
	validateSearch: parseCatalogSearch,
});

export const cartRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/cart",
	component: CartPage,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	productsRoute,
	productDetailsRoute,
	cartRoute,
]);

export const router = createRouter({
	routeTree,
	defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
