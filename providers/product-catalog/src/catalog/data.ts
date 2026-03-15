import productData from "../../../../data/products.json";
import { normalizeProduct } from "./normalize";
import type { CatalogProduct, CatalogProductRecord } from "./types";

const products = productData as CatalogProductRecord[];

export const getAllProducts = () => products;

export const getSeriesOptions = () =>
	[...new Set(products.map((product) => product.series))].sort((left, right) =>
		left.localeCompare(right),
	);

export const filterProductsBySeries = (
	source: CatalogProductRecord[],
	selectedSeries?: string | null,
) =>
	selectedSeries
		? source.filter((product) => product.series === selectedSeries)
		: source;

export const paginateProducts = (
	source: CatalogProductRecord[],
	page: number,
	pageSize: number,
) => {
	const safePageSize = Math.max(1, pageSize);
	const totalItems = source.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
	const currentPage = Math.min(Math.max(page, 1), totalPages);
	const start = (currentPage - 1) * safePageSize;

	return {
		currentPage,
		items: source.slice(start, start + safePageSize),
		totalItems,
		totalPages,
	};
};

export const findProductBySlug = (slug: string) =>
	products.find((product) => product.slug === slug) ?? null;

export const getNormalizedProductBySlug = (
	slug: string,
): CatalogProduct | null => {
	const product = findProductBySlug(slug);
	return product ? normalizeProduct(product) : null;
};
