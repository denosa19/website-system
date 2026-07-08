import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";
import Label from "./Label";
import { theme } from "../../styles/theme";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export default function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="w-full">
      {label && (
        <Label htmlFor={textareaId}>
          {label}
        </Label>
      )}

      <textarea
        id={textareaId}
        className={cn(
          "min-h-32 w-full border bg-white/5 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-white",
          theme.radius.md,
          error ? "border-red-500" : "border-white/10",
          className
        )}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}