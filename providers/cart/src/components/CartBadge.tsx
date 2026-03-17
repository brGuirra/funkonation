import { ShoppingBag } from "lucide-react";
import "../styles.css";

export type CartBadgeProps = {
	itemCount: number;
};

export function CartBadge({ itemCount }: CartBadgeProps) {
	return (
		<div className="flex flex-col items-center">
			<div className="relative">
				<ShoppingBag aria-hidden className="size-6" />
				{itemCount > 0 && (
					<span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
						{itemCount}
					</span>
				)}
			</div>
			<p className="mt-1 text-xs font-medium">
				{itemCount === 0
					? "Empty"
					: `${itemCount} ${itemCount === 1 ? "item" : "items"}`}
			</p>
		</div>
	);
}
