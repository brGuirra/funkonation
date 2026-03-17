import { Link, Outlet } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { lazy, Suspense } from "react";
import { Logo } from "../components/Logo";
import { RemoteBoundary } from "../components/RemoteBoundary";
import { useCartContext } from "../context/CartContext";

const CartBadge = lazy(() =>
	import("cart/CartBadge").then((m) => ({ default: m.CartBadge })),
);

function CartBadgeFallback() {
	return (
		<div className="flex flex-col items-center">
			<ShoppingBag aria-hidden className="size-6" />
			<p className="mt-1 text-xs font-medium">Cart</p>
		</div>
	);
}

export function StorefrontShell() {
	const { totalItems } = useCartContext();

	return (
		<main className="flex min-h-screen flex-col bg-background text-foreground">
			<header className="border-b border-border bg-secondary">
				<div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
					<div className="flex min-w-0 flex-col gap-1">
						<Link
							search={(prev) => ({
								page: prev.page ?? 1,
								series: prev.series,
							})}
							className="font-brand text-[2rem] leading-none text-link transition-opacity hover:opacity-90"
							to="/products"
						>
							<Logo />
						</Link>
						<p className="text-sm text-muted-foreground">
							Collectible storefront for browsing shelf-ready releases.
						</p>
					</div>
					<Link
						className="shrink-0 text-right text-link transition-opacity hover:opacity-80"
						to="/cart"
					>
						<RemoteBoundary fallback={<CartBadgeFallback />}>
							<Suspense fallback={<CartBadgeFallback />}>
								<CartBadge itemCount={totalItems} />
							</Suspense>
						</RemoteBoundary>
					</Link>
				</div>
			</header>
			<section className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
				<Outlet />
			</section>
			<footer className="border-t border-border bg-secondary">
				<div className="mx-auto flex w-full max-w-7xl items-center justify-end px-4 py-4 text-sm text-link sm:px-6 lg:px-8">
					Built with React, Module Federation, and static catalog data.
				</div>
			</footer>
		</main>
	);
}
