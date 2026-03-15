import { Button } from "@funkonation/ui/components/button";
import { getSeriesOptions as getDatasetSeriesOptions } from "../catalog/data";
import "../styles.css";

export type SeriesFilterProps = {
	onSeriesChange: (series: string | null) => void;
	options?: string[];
	selectedSeries?: string | null;
};

export const getSeriesOptions = () => getDatasetSeriesOptions();

export const SeriesFilter = ({
	onSeriesChange,
	options = getDatasetSeriesOptions(),
	selectedSeries,
}: SeriesFilterProps) => (
	<div className="flex flex-wrap gap-3">
		<Button
			className="min-w-20 font-sans font-medium"
			onClick={() => {
				onSeriesChange(null);
			}}
			size="sm"
			type="button"
			variant={selectedSeries ? "outline" : "default"}
		>
			All
		</Button>
		{options.map((series) => (
			<Button
				className="min-w-20 font-sans font-medium"
				key={series}
				onClick={() => {
					onSeriesChange(series);
				}}
				size="sm"
				type="button"
				variant={selectedSeries === series ? "default" : "outline"}
			>
				{series}
			</Button>
		))}
	</div>
);
