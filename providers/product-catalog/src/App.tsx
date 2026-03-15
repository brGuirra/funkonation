import { useState } from "react";
import { ProductDetails } from "./components/ProductDetails";
import { ProductList } from "./components/ProductList";

const pageSize = 8;

const App = () => {
	const [page, setPage] = useState(1);
	const [selectedSeries, setSelectedSeries] = useState<string | null>(null);
	const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

	return (
		<main className="min-h-screen bg-background text-foreground">
			<header className="border-b border-border bg-secondary">
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-5 sm:px-6 lg:px-8">
					<p className="font-brand text-[2rem] leading-none text-link">
						Funkonation
					</p>
					<div className="flex flex-wrap items-center gap-3 text-sm">
						<span className="rounded-md bg-white px-3 py-1 font-medium text-link">
							Catalog preview
						</span>
						<span className="text-muted-foreground">
							Standalone remote surface while the host owns real storefront
							routing.
						</span>
					</div>
				</div>
			</header>
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
				{selectedSlug ? (
					<ProductDetails
						onAddToCart={undefined}
						onBack={() => {
							setSelectedSlug(null);
						}}
						slug={selectedSlug}
					/>
				) : (
					<ProductList
						onAddToCart={undefined}
						onPageChange={setPage}
						onProductSelect={setSelectedSlug}
						onSeriesChange={(series) => {
							setPage(1);
							setSelectedSeries(series);
						}}
						page={page}
						pageSize={pageSize}
						selectedSeries={selectedSeries}
					/>
				)}
			</div>
		</main>
	);
};

export default App;
