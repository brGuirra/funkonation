import { cn } from "@funkonation/ui/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

const badgeVariants = cva(
	"inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent px-2.5 py-1 font-sans text-xs font-medium whitespace-nowrap transition-[color,box-shadow,background-color,border-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
				secondary:
					"bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"bg-destructive text-white focus-visible:ring-destructive/20 [a&]:hover:bg-destructive/90",
			outline:
				"border-link/20 bg-white text-link [a&]:hover:bg-accent [a&]:hover:text-link",
			success: "bg-success text-success-foreground border-transparent",
			},
		},
		defaultVariants: {
			variant: "secondary",
		},
	},
);

function Badge({
	className,
	variant = "secondary",
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			data-variant={variant}
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
