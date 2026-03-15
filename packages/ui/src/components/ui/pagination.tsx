import { cn } from "@funkonation/ui/lib/utils";
import type { VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { buttonVariants } from "./button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
	return (
		<nav
			aria-label="pagination"
			className={cn("mx-auto flex w-full justify-center", className)}
			data-slot="pagination"
			{...props}
		/>
	);
}

function PaginationContent({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			className={cn("flex flex-row items-center gap-1", className)}
			data-slot="pagination-content"
			{...props}
		/>
	);
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
	return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	isActive?: boolean;
	size?: VariantProps<typeof buttonVariants>["size"];
};

const PaginationLink = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
	({ className, isActive, size = "icon", type = "button", ...props }, ref) => (
		<button
			aria-current={isActive ? "page" : undefined}
			className={cn(
				buttonVariants({
					size,
					variant: isActive ? "outline" : "ghost",
				}),
				"min-w-9",
				className,
			)}
			data-active={isActive}
			data-slot="pagination-link"
			ref={ref}
			type={type}
			{...props}
		/>
	),
);
PaginationLink.displayName = "PaginationLink";

function PaginationPrevious({
	className,
	children,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label="Go to previous page"
			className={cn("gap-1 px-3 sm:pl-3", className)}
			size="default"
			{...props}
		>
			<ChevronLeft aria-hidden className="size-4" />
			<span>{children ?? "Previous"}</span>
		</PaginationLink>
	);
}

function PaginationNext({
	className,
	children,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label="Go to next page"
			className={cn("gap-1 px-3 sm:pr-3", className)}
			size="default"
			{...props}
		>
			<span>{children ?? "Next"}</span>
			<ChevronRight aria-hidden className="size-4" />
		</PaginationLink>
	);
}

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			aria-hidden
			className={cn(
				"flex size-9 items-center justify-center text-muted-foreground",
				className,
			)}
			data-slot="pagination-ellipsis"
			{...props}
		>
			<MoreHorizontal className="size-4" />
			<span className="sr-only">More pages</span>
		</span>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
