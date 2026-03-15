import { useNavigate } from "@tanstack/react-router";
import { ProductList } from "product_catalog/ProductList";
import { useCartContext } from "../context/CartContext";
import { buildCatalogSearch, pageSize } from "../lib/catalog-search";
import { productsRoute } from "../router";

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
	);
}
