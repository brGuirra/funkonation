export type CatalogProductRecord = {
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
	source: string;
	stock: number;
	url: string;
};

export type CatalogProductAction = Pick<
	CatalogProductRecord,
	| "description"
	| "id"
	| "imageUrl"
	| "line"
	| "name"
	| "number"
	| "price"
	| "rarity"
	| "series"
	| "slug"
	| "stock"
>;

export type CatalogProduct = CatalogProductRecord & {
	lineLabel: string;
	priceLabel: string;
	rarityLabel: string;
};
