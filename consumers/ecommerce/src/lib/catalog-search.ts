import { getSeriesOptions } from "product_catalog/SeriesFilter";

export type CatalogRouteSearch = {
	page: number;
	series?: string;
};

export const pageSize = 8;

const supportedSeries = new Set(getSeriesOptions());

const getFirstString = (value: unknown): string | undefined => {
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}

	if (Array.isArray(value)) {
		return getFirstString(value[0]);
	}

	return undefined;
};

const parsePage = (value: unknown): number => {
	if (typeof value === "number") {
		return Number.isInteger(value) && value > 0 ? value : 1;
	}

	const rawValue = getFirstString(value);
	const parsed = Number(rawValue);

	return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

const parseSeries = (value: unknown): string | undefined => {
	const rawValue = getFirstString(value);
	return rawValue && supportedSeries.has(rawValue) ? rawValue : undefined;
};

export const parseCatalogSearch = (
	search: Record<string, unknown>,
): CatalogRouteSearch => ({
	page: parsePage(search.page),
	series: parseSeries(search.series),
});

export const buildCatalogSearch = (
	search: CatalogRouteSearch,
): CatalogRouteSearch => ({
	page: search.page,
	series: search.series,
});
