"use client";

import { cn } from "@/lib/utils";

export default function Textarea({ label, error, className, rows = 4, ...props }) {
  const textareaClasses = cn(
    "w-full rounded-lg bg-white text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors duration-200 p-3.5 border resize-y",
    error
      ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100"
      : "border-neutral-200 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-100",
    className,
  );

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}

      <textarea rows={rows} className={textareaClasses} {...props} />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
