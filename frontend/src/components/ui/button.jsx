import { forwardRef } from "react";

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    fullWidth = false,
    className = "",
    disabled = false,
    ...props
  },
  ref,
) {
  const base =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-800",
    outline:
      "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-100 hover:border-neutral-300",
    ghost: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const sizeClass = "h-11 px-5";

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`${base} ${variants[variant] ?? variants.primary} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
