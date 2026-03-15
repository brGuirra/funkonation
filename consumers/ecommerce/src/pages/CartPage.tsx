import { Skeleton } from "@funkonation/ui/components/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useCartContext } from "../context/CartContext";

const CartView = lazy(() =>
	import("cart/CartView").then((m) => ({ default: m.CartView })),
);

function CartSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<Skeleton className="h-9 w-32" />
			<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
				<div className="flex flex-col gap-3">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-28 w-full rounded-xl" />
					))}
				</div>
				<Skeleton className="h-56 w-full rounded-xl" />
			</div>
		</div>
	);
}

export function CartPage() {
	const navigate = useNavigate();
	const { items, removeItem, changeQuantity, clearCart } = useCartContext();

	return (
		<Suspense fallback={<CartSkeleton />}>
			<CartView
				cartItems={items}
				onBack={() => {
					navigate({ to: "/products", search: { page: 1 } });
				}}
				onChangeQuantity={changeQuantity}
				onConfirm={() => {
					clearCart();
					navigate({ to: "/products", search: { page: 1 } });
				}}
				onRemove={removeItem}
			/>
		</Suspense>
	);
}
