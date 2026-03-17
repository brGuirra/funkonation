import { Skeleton } from "@funkonation/ui/components/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { RemoteBoundary } from "../components/RemoteBoundary";
import { useCartContext } from "../context/CartContext";
import { buildCatalogSearch, pageSize } from "../lib/catalog-search";
import { productsRoute } from "../router";

const ProductList = lazy(() =>
	import("product_catalog/ProductList").then((m) => ({
		default: m.ProductList,
	})),
);

function ProductListSkeleton() {
	return (
		<div className="flex flex-col gap-8">
			<Skeleton className="h-20 w-full rounded-xl" />
			<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
				{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
					<Skeleton key={i} className="h-96 w-full rounded-lg" />
				))}
			</div>
			<Skeleton className="h-20 w-full rounded-xl" />
		</div>
	);
}

export function ProductsPage() {
	const navigate = useNavigate({ from: productsRoute.fullPath });
	const search = productsRoute.useSearch();
	const { addItem } = useCartContext();
	const catalogSearchKey = `${search.series ?? "all"}:${search.page}`;

	const navigateToCatalog = (page: number, series?: string) =>
		navigate({
			to: "/products",
			search: () => buildCatalogSearch({ page, series }),
		});

	return (
		<RemoteBoundary>
			<Suspense fallback={<ProductListSkeleton />}>
				<ProductList
					key={catalogSearchKey}
					onAddToCart={addItem}
					onPageChange={(page) => navigateToCatalog(page, search.series)}
					onProductSelect={(slug) => {
						navigate({
							to: "/products/$slug",
							params: { slug },
							search: () => buildCatalogSearch(search),
						});
					}}
					onSeriesChange={(series) => navigateToCatalog(1, series ?? undefined)}
					page={search.page}
					pageSize={pageSize}
					selectedSeries={search.series ?? null}
				/>
			</Suspense>
		</RemoteBoundary>
	);
}
