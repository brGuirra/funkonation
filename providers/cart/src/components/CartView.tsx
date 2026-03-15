import { Button } from "@funkonation/ui/components/button";
import { Card, CardContent } from "@funkonation/ui/components/card";
import { Separator } from "@funkonation/ui/components/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@funkonation/ui/components/tooltip";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "../types";
import "../styles.css";

export type CartViewProps = {
	cartItems: CartItem[];
	onBack: () => void;
	onChangeQuantity: (productId: string, qty: number) => void;
	onConfirm: () => void;
	onRemove: (productId: string) => void;
};

const formatPrice = (cents: number) =>
	new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
		cents / 100,
	);

export const CartView = ({
	cartItems,
	onBack,
	onChangeQuantity,
	onConfirm,
	onRemove,
}: CartViewProps) => {
	const totalCents = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	if (cartItems.length === 0) {
		return (
			<section className="flex flex-col gap-4">
				<Button
					className="self-start px-0 font-sans font-medium"
					onClick={onBack}
					type="button"
					variant="link"
				>
					<ArrowLeft className="size-4" />
					Continue shopping
				</Button>
				<div className="text-center">
					<h1 className="font-display text-3xl font-bold text-foreground">
						Your bag
					</h1>
				</div>
				<Card className="rounded-xl border-dashed shadow-none">
					<CardContent className="flex flex-col items-center px-8 py-14 text-center sm:px-10">
						<div className="flex max-w-sm flex-col gap-3">
							<p className="text-sm font-medium text-link">Empty bag</p>
							<h2 className="font-display text-2xl font-bold text-foreground">
								No collectibles added yet.
							</h2>
							<p className="text-sm leading-6 text-muted-foreground">
								Head back to the catalog and find something shelf-worthy.
							</p>
						</div>
					</CardContent>
				</Card>
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
				Continue shopping
			</Button>
			<h1 className="w-full text-center font-display text-3xl font-bold text-foreground">
				Your bag
			</h1>

			<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
				<div className="flex flex-col gap-3">
					{cartItems.map((item) => (
						<Card
							key={item.productId}
							className="overflow-hidden rounded-xl py-0 shadow-[0_4px_12px_rgba(23,25,35,0.08)]"
						>
							<CardContent className="flex items-center gap-4 px-5 py-4 sm:gap-6 sm:px-6">
								<div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-muted p-2 sm:size-24">
									<img
										alt={item.name}
										className="aspect-square h-full w-full object-contain"
										loading="lazy"
										src={item.imageUrl}
									/>
								</div>

								<div className="flex min-w-0 flex-1 flex-col gap-3">
									<h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-foreground sm:text-lg">
										{item.name}
									</h3>
									<p className="font-display text-lg font-extrabold text-foreground">
										{formatPrice(item.price)}
									</p>

									<div className="flex items-center justify-between gap-4">
										<div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-1 py-1">
											<Button
												aria-label="Decrease quantity"
												className="size-7 hover:bg-white hover:text-foreground"
												disabled={item.quantity <= 1}
												onClick={() => {
													onChangeQuantity(item.productId, item.quantity - 1);
												}}
												size="icon"
												type="button"
												variant="ghost"
											>
												<Minus />
											</Button>
											<span className="w-6 text-center text-sm font-medium tabular-nums text-foreground">
												{item.quantity}
											</span>
											<Button
												aria-label="Increase quantity"
												className="size-7 hover:bg-white hover:text-foreground"
												onClick={() => {
													onChangeQuantity(item.productId, item.quantity + 1);
												}}
												size="icon"
												type="button"
												variant="ghost"
											>
												<Plus />
											</Button>
										</div>

										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														aria-label="Remove item"
														className="size-8 hover:text-destructive"
														onClick={() => {
															onRemove(item.productId);
														}}
														size="icon"
														type="button"
														variant="ghost"
													>
														<Trash2 />
													</Button>
												</TooltipTrigger>
												<TooltipContent>Remove</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<div>
					<Card className="sticky top-6 rounded-xl shadow-[0_4px_12px_rgba(23,25,35,0.08)]">
						<CardContent className="flex flex-col gap-4 px-6 py-6">
							<h2 className="font-display text-lg font-bold text-foreground">
								Order summary
							</h2>

							<div className="flex flex-col gap-2">
								{cartItems.map((item) => (
									<div
										key={item.productId}
										className="flex items-start justify-between gap-2 text-sm"
									>
										<span className="line-clamp-2 text-muted-foreground">
											{item.name}{" "}
											<span className="text-foreground">×{item.quantity}</span>
										</span>
										<span className="shrink-0 font-medium text-foreground tabular-nums">
											{formatPrice(item.price * item.quantity)}
										</span>
									</div>
								))}
							</div>

							<Separator />

							<div className="flex items-center justify-between">
								<span className="font-display font-bold text-foreground">
									Total
								</span>
								<span className="font-display text-xl font-extrabold text-foreground tabular-nums">
									{formatPrice(totalCents)}
								</span>
							</div>

							<Button
								className="h-11 w-full text-base"
								onClick={onConfirm}
								type="button"
							>
								Confirm order
							</Button>

							<p className="text-center text-xs text-muted-foreground">
								This is a simulated checkout. No payment is processed.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
};
