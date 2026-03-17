import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@funkonation/ui/components/alert";
import { Badge } from "@funkonation/ui/components/badge";
import { Button } from "@funkonation/ui/components/button";
import { Card } from "@funkonation/ui/components/card";
import { Separator } from "@funkonation/ui/components/separator";
import { ArrowLeft, Plus } from "lucide-react";
import { getNormalizedProductBySlug } from "../catalog/data";
import type { CatalogProductAction } from "../catalog/types";
import "../styles.css";

export type ProductDetailsProps = {
	onAddToCart?: (product: CatalogProductAction) => void;
	onBack: () => void;
	slug: string;
};

export const ProductDetails = ({
	onAddToCart,
	onBack,
	slug,
}: ProductDetailsProps) => {
	const product = getNormalizedProductBySlug(slug);

	if (!product) {
		return (
			<section className="flex flex-col gap-4">
				<Button
					className="self-start px-0 font-sans font-medium"
					onClick={onBack}
					type="button"
					variant="link"
				>
					<ArrowLeft className="size-4" />
					Back to catalog
				</Button>
				<Alert variant="destructive">
					<AlertTitle>Collectible not found</AlertTitle>
					<AlertDescription>
						That collectible is not in this shipment. Use the back action to
						return to the catalog list.
					</AlertDescription>
				</Alert>
			</section>
		);
	}

	return (
		<section className="flex flex-col gap-6">
			<Button
				className="self-start px-0 font-sans font-medium"
				onClick={onBack}
				type="button"
				variant="link"
			>
				<ArrowLeft className="size-4" />
				Back to catalog
			</Button>
			<Card className="overflow-hidden rounded-xl py-0">
				<div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
					<div className="bg-secondary/65 p-6 sm:p-8 lg:p-10">
						<div className="flex h-full items-center justify-center rounded-xl bg-white p-6 shadow-[0_8px_20px_rgba(23,25,35,0.08)]">
							<img
								alt={product.name}
								className="aspect-square w-full max-w-[420px] object-contain"
								src={product.imageUrl}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
						<div className="flex flex-wrap gap-2">
							<Badge variant="outline">{product.series}</Badge>
							<Badge>{product.rarityLabel}</Badge>
							<Badge variant="success">{product.stock} in stock</Badge>
						</div>
						<div className="flex flex-col gap-2">
							<p className="text-sm text-muted-foreground">
								{product.lineLabel}
							</p>
							<h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
								{product.name}
							</h2>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="rounded-xl bg-secondary px-5 py-4">
								<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
									Collector price
								</p>
								<p className="mt-2 font-display text-3xl font-extrabold text-foreground">
									{product.priceLabel}
								</p>
							</div>
							<div className="rounded-xl bg-secondary px-5 py-4">
								<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
									Product number
								</p>
								<p className="mt-2 font-display text-3xl font-extrabold text-foreground">
									#{product.number}
								</p>
							</div>
						</div>
						<Separator />
						<p className="text-sm leading-7 text-muted-foreground sm:text-base">
							{product.description}
						</p>
						<div className="mt-auto flex flex-col gap-3 sm:flex-row">
							<Button
								className="flex-1 gap-2 text-base"
								disabled={!onAddToCart}
								onClick={() => {
									onAddToCart?.(product);
								}}
								type="button"
							>
								<span>{onAddToCart ? "Add to bag" : "Cart coming soon"}</span>
								<span className="flex size-5 items-center justify-center rounded-full bg-white text-primary">
									<Plus className="size-3" />
								</span>
							</Button>
							<Button
								asChild
								className="flex-1 font-sans font-medium"
								variant="outline"
							>
								<a href={product.url} rel="noreferrer" target="_blank">
									View source listing
								</a>
							</Button>
						</div>
					</div>
				</div>
			</Card>
		</section>
	);
};
