"use client";

import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-neutral-900 text-white hover:bg-neutral-800",
  outline:
    "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100 hover:border-neutral-300",
  ghost: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
};

export default function Button({
  children,
  leftIcon,
  rightIcon,
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
        variants[variant] ?? variants.primary,
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {leftIcon && <span className="flex items-center">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
}
