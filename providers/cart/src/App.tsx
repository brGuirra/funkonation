import { useState } from "react";
import { CartView } from "./components/CartView";
import type { CartItem } from "./types";

const sampleItems: CartItem[] = [
	{
		productId: "sample-1",
		slug: "batman-funko",
		name: "Batman #01",
		imageUrl:
			"https://storage.googleapis.com/images.pricecharting.com/jjmeujathy57rkgj/1600.jpg",
		price: 1299,
		quantity: 1,
	},
	{
		productId: "sample-2",
		slug: "spider-man-funko",
		name: "Spider-Man #03",
		imageUrl:
			"https://storage.googleapis.com/images.pricecharting.com/jjmeujathy57rkgj/1600.jpg",
		price: 2499,
		quantity: 2,
	},
];

const App = () => {
	const [items, setItems] = useState<CartItem[]>(sampleItems);
	const [confirmed, setConfirmed] = useState(false);

	const handleRemove = (productId: string) => {
		setItems((prev) => prev.filter((item) => item.productId !== productId));
	};

	const handleChangeQuantity = (productId: string, qty: number) => {
		setItems((prev) =>
			prev.map((item) =>
				item.productId === productId ? { ...item, quantity: qty } : item,
			),
		);
	};

	const handleConfirm = () => {
		setItems([]);
		setConfirmed(true);
	};

	return (
		<main className="min-h-screen bg-background text-foreground">
			<header className="border-b border-border bg-secondary">
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-5 sm:px-6 lg:px-8">
					<p className="font-brand text-[2rem] leading-none text-link">
						Funkonation
					</p>
					<div className="flex flex-wrap items-center gap-3 text-sm">
						<span className="rounded-md bg-white px-3 py-1 font-medium text-link">
							Cart preview
						</span>
						<span className="text-muted-foreground">
							Standalone remote surface with sample data.
						</span>
					</div>
				</div>
			</header>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
				{confirmed && items.length === 0 && (
					<div className="rounded-xl bg-[#ebfff5] px-6 py-4 text-sm font-medium text-[#2f855a]">
						Order confirmed! Your collectibles are on their way.
					</div>
				)}
				<CartView
					cartItems={items}
					onBack={() => {}}
					onChangeQuantity={handleChangeQuantity}
					onConfirm={handleConfirm}
					onRemove={handleRemove}
				/>
			</div>
		</main>
	);
};

export default App;
