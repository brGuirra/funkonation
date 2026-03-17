import { Skeleton } from "@funkonation/ui/components/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { RemoteBoundary } from "../components/RemoteBoundary";
import { useCartContext } from "../context/CartContext";
import { buildCatalogSearch } from "../lib/catalog-search";
import { productDetailsRoute } from "../router";

const ProductDetails = lazy(() =>
	import("product_catalog/ProductDetails").then((m) => ({
		default: m.ProductDetails,
	})),
);

function ProductDetailsSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<Skeleton className="h-9 w-40" />
			<div className="grid gap-0 overflow-hidden rounded-xl border border-border lg:grid-cols-2">
				<Skeleton className="h-[420px] w-full" />
				<div className="flex flex-col gap-6 p-8">
					<div className="flex gap-2">
						<Skeleton className="h-6 w-20 rounded-full" />
						<Skeleton className="h-6 w-24 rounded-full" />
					</div>
					<Skeleton className="h-10 w-3/4" />
					<div className="grid gap-4 sm:grid-cols-2">
						<Skeleton className="h-24 rounded-xl" />
						<Skeleton className="h-24 rounded-xl" />
					</div>
					<Skeleton className="h-px w-full" />
					<Skeleton className="h-20 w-full" />
					<Skeleton className="h-11 w-full rounded-md" />
				</div>
			</div>
		</div>
	);
}

export function ProductDetailsPage() {
	const navigate = useNavigate({ from: productDetailsRoute.fullPath });
	const params = productDetailsRoute.useParams();
	const search = productDetailsRoute.useSearch();
	const { addItem } = useCartContext();

	return (
		<RemoteBoundary>
			<Suspense fallback={<ProductDetailsSkeleton />}>
				<ProductDetails
					onAddToCart={addItem}
					onBack={() => {
						navigate({
							to: "/products",
							search: () => buildCatalogSearch(search),
						});
					}}
					slug={params.slug}
				/>
			</Suspense>
		</RemoteBoundary>
	);
}
