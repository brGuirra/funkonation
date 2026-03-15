import { cn } from "@funkonation/ui/lib/utils";
import type * as React from "react";

function Separator({
	className,
	orientation = "horizontal",
	...props
}: React.HTMLAttributes<HTMLDivElement> & {
	orientation?: "horizontal" | "vertical";
}) {
	return (
		<div
			data-slot="separator"
			data-orientation={orientation}
			className={cn(
				"shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
				className,
			)}
			{...props}
		/>
	);
}

export { Separator };
