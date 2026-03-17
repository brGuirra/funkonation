import type { CatalogProductAction } from "./types";

const usdFormatter = new Intl.NumberFormat("en-US", {
	currency: "USD",
	style: "currency",
});

const boilerplateDescriptionPattern =
	/(^Current value:)|(^PopIQ tracks Funko Pop prices)/i;

type NormalizableProduct = Pick<
	CatalogProductAction,
	"description" | "line" | "price" | "rarity" | "series"
>;

export type NormalizedDisplay = {
	description: string;
	lineLabel: string;
	priceLabel: string;
	rarityLabel: string;
};

const titleCase = (value: string) =>
	value
		.split(/\s+/)
		.filter(Boolean)
		.map(
			(part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`,
		)
		.join(" ");

export const formatUsdPrice = (price: number) => usdFormatter.format(price);

export const formatRarityLabel = (rarity: string | null) =>
	rarity ? titleCase(rarity) : "Core Release";

export const getFallbackDescription = (product: NormalizableProduct) =>
	`A collector-ready ${product.series} release with display-friendly details, shelf presence, and the kind of rarity that keeps a Funkonation lineup feeling curated.`;

export const normalizeDescription = (product: NormalizableProduct) =>
	boilerplateDescriptionPattern.test(product.description)
		? getFallbackDescription(product)
		: product.description;

export const normalizeProduct = <T extends NormalizableProduct>(
	product: T,
): T & NormalizedDisplay => ({
	...product,
	description: normalizeDescription(product),
	lineLabel: product.line ?? "Pop! Vinyl",
	priceLabel: formatUsdPrice(product.price),
	rarityLabel: formatRarityLabel(product.rarity),
});
