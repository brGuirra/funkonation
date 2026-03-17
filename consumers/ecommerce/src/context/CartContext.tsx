import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export type AddToCartPayload = {
	id: string;
	slug: string;
	name: string;
	imageUrl: string;
	price: number;
};

export type CartItem = {
	productId: string;
	slug: string;
	name: string;
	imageUrl: string;
	price: number;
	quantity: number;
};

type CartContextValue = {
	items: CartItem[];
	totalItems: number;
	addItem: (product: AddToCartPayload) => void;
	removeItem: (productId: string) => void;
	changeQuantity: (productId: string, qty: number) => void;
	clearCart: () => void;
};

const STORAGE_KEY = "funkonation_cart";

const CartContext = createContext<CartContextValue | null>(null);

function readFromStorage(): CartItem[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		return JSON.parse(raw) as CartItem[];
	} catch {
		return [];
	}
}

function writeToStorage(items: CartItem[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {
		// storage unavailable — state is still live in memory
	}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>(readFromStorage);

	useEffect(() => {
		writeToStorage(items);
	}, [items]);

	const addItem = useCallback((product: AddToCartPayload) => {
		setItems((prev) => {
			const existing = prev.find((item) => item.productId === product.id);
			if (existing) {
				return prev.map((item) =>
					item.productId === product.id
						? { ...item, quantity: item.quantity + 1 }
						: item,
				);
			}
			return [
				...prev,
				{
					productId: product.id,
					slug: product.slug,
					name: product.name,
					imageUrl: product.imageUrl,
					price: product.price,
					quantity: 1,
				},
			];
		});
	}, []);

	const removeItem = useCallback((productId: string) => {
		setItems((prev) => prev.filter((item) => item.productId !== productId));
	}, []);

	const changeQuantity = useCallback((productId: string, qty: number) => {
		if (qty < 1) return;
		setItems((prev) =>
			prev.map((item) =>
				item.productId === productId ? { ...item, quantity: qty } : item,
			),
		);
	}, []);

	const clearCart = useCallback(() => {
		setItems([]);
	}, []);

	const totalItems = useMemo(
		() => items.reduce((sum, item) => sum + item.quantity, 0),
		[items],
	);

	const value = useMemo(
		() => ({
			items,
			totalItems,
			addItem,
			removeItem,
			changeQuantity,
			clearCart,
		}),
		[items, totalItems, addItem, removeItem, changeQuantity, clearCart],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
	const ctx = useContext(CartContext);
	if (!ctx) {
		throw new Error("useCartContext must be used within a CartProvider");
	}
	return ctx;
}
