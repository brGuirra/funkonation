import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@funkonation/ui/components/alert";
import { Button } from "@funkonation/ui/components/button";
import { Component, type ReactNode } from "react";

type Props = {
	children: ReactNode;
	fallback?: ReactNode;
};

type State = {
	error: Error | null;
};

function DefaultFallback({ onRetry }: { onRetry: () => void }) {
	return (
		<Alert className="flex flex-col gap-3">
			<AlertTitle>Something went wrong</AlertTitle>
			<AlertDescription>
				This section could not be loaded. The remote module may be temporarily
				unavailable.
			</AlertDescription>
			<Button className="w-fit" onClick={onRetry} size="sm" type="button">
				Retry
			</Button>
		</Alert>
	);
}

export class RemoteBoundary extends Component<Props, State> {
	state: State = { error: null };

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	render() {
		if (this.state.error) {
			return (
				this.props.fallback ?? (
					<DefaultFallback onRetry={() => this.setState({ error: null })} />
				)
			);
		}
		return this.props.children;
	}
}
