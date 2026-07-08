import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import { theme } from "../../styles/theme";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white">
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={cn(
          "w-full border bg-white/5 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-white",
          theme.radius.md,
          error ? "border-red-500" : "border-white/10",
          className
        )}
        {...props}
      />

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}