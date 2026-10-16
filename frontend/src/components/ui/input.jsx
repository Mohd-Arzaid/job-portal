"use client";

import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, variant = "input", className = "", error, id, rows = 5, ...props },
  ref,
) {
  const inputId = id || props.name || "form-input";

  const inputClasses = `w-full rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors duration-200 ${
    error
      ? "border border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100"
      : "border border-neutral-200 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100"
  } ${
    variant === "textarea" ? "resize-none px-4 py-3" : "h-12 px-4"
  } ${className}`;

  return (
    <div className="w-full space-y-2">
      {label && (
        <label
          htmlFor={id || props.name || "form-input"}
          className="block text-sm font-medium text-neutral-800"
        >
          {label}
        </label>
      )}

      {variant === "textarea" ? (
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={inputClasses}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      ) : (
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      )}

      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
