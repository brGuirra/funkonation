import { useNavigate } from "@tanstack/react-router";
import { ProductDetails } from "product_catalog/ProductDetails";
import { useCartContext } from "../context/CartContext";
import { buildCatalogSearch } from "../lib/catalog-search";
import { productDetailsRoute } from "../router";

export function ProductDetailsPage() {
	const navigate = useNavigate({ from: productDetailsRoute.fullPath });
	const params = productDetailsRoute.useParams();
	const search = productDetailsRoute.useSearch();
	const { addItem } = useCartContext();

	return (
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
	);
}
