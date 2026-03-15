declare module "product_catalog/ProductList" {
	import type { JSX } from "react";
	import type { CatalogProductAction } from "product_catalog/ProductCard";

	export interface ProductListProps {
		onAddToCart?: (product: CatalogProductAction) => void;
		onPageChange: (page: number) => void;
		onProductSelect: (slug: string) => void;
		onSeriesChange: (series: string | null) => void;
		page: number;
		pageSize: number;
		selectedSeries?: string | null;
	}

	export function ProductList(props: ProductListProps): JSX.Element;
}

declare module "product_catalog/ProductDetails" {
	import type { JSX } from "react";
	import type { CatalogProductAction } from "product_catalog/ProductCard";

	export interface ProductDetailsProps {
		onAddToCart?: (product: CatalogProductAction) => void;
		onBack: () => void;
		slug: string;
	}

	export function ProductDetails(props: ProductDetailsProps): JSX.Element;
}

declare module "product_catalog/ProductCard" {
	import type { JSX } from "react";

	export interface CatalogProductAction {
		description: string;
		id: string;
		imageUrl: string;
		line: string | null;
		name: string;
		number: number;
		price: number;
		rarity: string | null;
		series: string;
		slug: string;
		stock: number;
	}

	export interface ProductCardProps {
		onAddToCart?: (product: CatalogProductAction) => void;
		onSelect?: (slug: string) => void;
		product: CatalogProductAction;
	}

	export function ProductCard(props: ProductCardProps): JSX.Element;
}

declare module "cart/CartView" {
	import type { JSX } from "react";

	export interface CartItem {
		productId: string;
		slug: string;
		name: string;
		imageUrl: string;
		price: number;
		quantity: number;
	}

	export interface CartViewProps {
		cartItems: CartItem[];
		onBack: () => void;
		onChangeQuantity: (productId: string, qty: number) => void;
		onConfirm: () => void;
		onRemove: (productId: string) => void;
	}

	export function CartView(props: CartViewProps): JSX.Element;
}

declare module "product_catalog/SeriesFilter" {
	import type { JSX } from "react";

	export interface SeriesFilterProps {
		onSeriesChange: (series: string | null) => void;
		options?: string[];
		selectedSeries?: string | null;
	}

	export function SeriesFilter(props: SeriesFilterProps): JSX.Element;
	export function getSeriesOptions(): string[];
}
