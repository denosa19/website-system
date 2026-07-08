import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({ children, className = "", ...props }: SelectProps) {
  return (
    <select
      className={`rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}