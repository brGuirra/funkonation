import { Button } from "@funkonation/ui/components/button";
import { ProductList } from "product_catalog/ProductList";

const App = () => {
	return (
		<main className="min-h-screen bg-background text-foreground">
			<section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-14">
				<h1 className="text-4xl font-semibold tracking-tight">
					Funkonation Shell
				</h1>
				<p className="text-muted-foreground">
					Shared UI comes from <code>@funkonation/ui</code> while remotes are
					still loaded with Module Federation.
				</p>
				<div className="flex flex-wrap items-center gap-3">
					<Button>Shell shared button</Button>
					<Button variant="outline">Host local action</Button>
				</div>
				<div className="flex flex-wrap items-center gap-3">
					<ProductList />
					<p className="text-sm text-muted-foreground">
						Remote button exposed by product-catalog
					</p>
				</div>
			</section>
		</main>
	);
};

export default App;
