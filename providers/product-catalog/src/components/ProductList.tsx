import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@funkonation/ui/components/alert";
import { Button } from "@funkonation/ui/components/button";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@funkonation/ui/components/pagination";
import {
	filterProductsBySeries,
	getAllProducts,
	paginateProducts,
} from "../catalog/data";
import type { CatalogProductAction } from "../catalog/types";
import "../styles.css";
import { ProductCard } from "./ProductCard";
import { SeriesFilter } from "./SeriesFilter";

export type ProductListProps = {
	onAddToCart?: (product: CatalogProductAction) => void;
	onPageChange: (page: number) => void;
	onProductSelect: (slug: string) => void;
	onSeriesChange: (series: string | null) => void;
	page: number;
	pageSize: number;
	selectedSeries?: string | null;
};

const buildPaginationItems = (currentPage: number, totalPages: number) => {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	const pages = new Set([
		1,
		totalPages,
		currentPage - 1,
		currentPage,
		currentPage + 1,
	]);
	const visiblePages = Array.from(pages).filter(
		(page) => page >= 1 && page <= totalPages,
	);
	const items: Array<number | "ellipsis"> = [];

	for (const page of visiblePages.sort((left, right) => left - right)) {
		const previousPage = items.at(-1);

		if (typeof previousPage === "number" && page - previousPage > 1) {
			items.push("ellipsis");
		}

		items.push(page);
	}

	return items;
};

export const ProductList = ({
	onAddToCart,
	onPageChange,
	onProductSelect,
	onSeriesChange,
	page,
	pageSize,
	selectedSeries,
}: ProductListProps) => {
	const filteredProducts = filterProductsBySeries(
		getAllProducts(),
		selectedSeries ?? null,
	);
	const { currentPage, items, totalItems, totalPages } = paginateProducts(
		filteredProducts,
		page,
		pageSize,
	);
	const paginationItems = buildPaginationItems(currentPage, totalPages);
	const changePage = (targetPage: number) => {
		if (
			targetPage < 1 ||
			targetPage > totalPages ||
			targetPage === currentPage
		) {
			return;
		}

		onPageChange(targetPage);
	};

	return (
		<section className="w-full space-y-8">
			<div className="flex flex-col gap-4 rounded-xl border border-border bg-secondary/55 px-4 py-4 sm:px-5 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
					<p className="text-sm font-medium text-foreground">Collections:</p>
					<SeriesFilter
						onSeriesChange={onSeriesChange}
						selectedSeries={selectedSeries}
					/>
				</div>
				<div className="flex items-center gap-4 text-sm text-muted-foreground">
					<span>{selectedSeries ?? "All series"}</span>
					<span>{totalItems} collectibles</span>
				</div>
			</div>

			{items.length > 0 ? (
				<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
					{items.map((product) => (
						<ProductCard
							key={product.id}
							onAddToCart={onAddToCart}
							onSelect={onProductSelect}
							product={product}
						/>
					))}
				</div>
			) : (
				<Alert className="flex flex-col gap-3">
					<AlertTitle>No collectibles matched that series</AlertTitle>
					<AlertDescription>
						Try another collection or reset the filter to return to the full
						catalog.
					</AlertDescription>
					<Button
						className="w-fit"
						onClick={() => {
							onSeriesChange(null);
						}}
						size="sm"
						type="button"
					>
						Show all series
					</Button>
				</Alert>
			)}

			<div className="space-y-4 rounded-xl border border-border bg-white px-4 py-5 shadow-[0_6px_16px_rgba(23,25,35,0.08)]">
				<div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>
						Page {currentPage} of {totalPages}
					</p>
				</div>
				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								aria-disabled={currentPage <= 1}
								aria-label="Go to previous page"
								className="font-sans font-medium"
								disabled={currentPage <= 1}
								onClick={(event) => {
									event.preventDefault();
									changePage(currentPage - 1);
								}}
								type="button"
							/>
						</PaginationItem>
						{paginationItems.map((item, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: "ellipsis" can appear more than once; index is the only stable disambiguator for this deterministic, non-reordering array
							<PaginationItem key={`${item}-${index}`}>
								{item === "ellipsis" ? (
									<PaginationEllipsis />
								) : (
									<PaginationLink
										aria-label={`Go to page ${item}`}
										className="font-sans font-medium"
										isActive={item === currentPage}
										onClick={(event) => {
											event.preventDefault();
											changePage(item);
										}}
										type="button"
									>
										{item}
									</PaginationLink>
								)}
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								aria-disabled={currentPage >= totalPages}
								aria-label="Go to next page"
								className="font-sans font-medium"
								disabled={currentPage >= totalPages}
								onClick={(event) => {
									event.preventDefault();
									changePage(currentPage + 1);
								}}
								type="button"
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</section>
	);
};
