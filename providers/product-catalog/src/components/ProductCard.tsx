import { Button } from "@funkonation/ui/components/button";
import { Card, CardContent, CardFooter } from "@funkonation/ui/components/card";
import { Plus } from "lucide-react";
import { normalizeProduct } from "../catalog/normalize";
import type { CatalogProductAction } from "../catalog/types";
import "../styles.css";

export type ProductCardProps = {
	onAddToCart?: (product: CatalogProductAction) => void;
	onSelect?: (slug: string) => void;
	product: CatalogProductAction;
};

export const ProductCard = ({
	onAddToCart,
	onSelect,
	product,
}: ProductCardProps) => {
	const normalizedProduct = normalizeProduct(product);

	return (
		<Card className="group h-full gap-0 overflow-hidden rounded-lg border-border/80 py-0 shadow-[0_6px_16px_rgba(23,25,35,0.12)] transition-transform duration-200 hover:-translate-y-1">
			<button
				className="flex flex-1 flex-col text-left"
				onClick={() => {
					onSelect?.(product.slug);
				}}
				type="button"
			>
				<CardContent className="px-6 pt-5">
					<div className="flex min-h-60 items-center justify-center rounded-md bg-muted px-5 py-6">
						<img
							alt={product.name}
							className="mx-auto aspect-square w-full max-w-[190px] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
							loading="lazy"
							src={product.imageUrl}
						/>
					</div>
					<div className="pt-6">
						<p className="text-sm text-muted-foreground">
							{normalizedProduct.lineLabel}
						</p>
						<h3 className="mt-3 line-clamp-2 font-display text-[1.05rem] leading-6 font-bold text-foreground">
							{product.name}
						</h3>
						<p className="mt-4 font-display text-xl font-extrabold text-foreground">
							{normalizedProduct.priceLabel}
						</p>
					</div>
				</CardContent>
			</button>
			<CardFooter className="px-6 pb-6 pt-5">
				<Button
					className="h-11 w-full justify-center gap-2 text-base"
					disabled={!onAddToCart}
					onClick={() => {
						onAddToCart?.(product);
					}}
					type="button"
				>
					<span>{onAddToCart ? "Add to bag" : "Cart soon"}</span>
					<span className="flex size-5 items-center justify-center rounded-full bg-white text-primary">
						<Plus className="size-3" />
					</span>
				</Button>
			</CardFooter>
		</Card>
	);
};
