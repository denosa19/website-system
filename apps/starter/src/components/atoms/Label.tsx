import type { LabelHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({
  children,
  className,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        "mb-2 block text-sm font-medium text-white",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}