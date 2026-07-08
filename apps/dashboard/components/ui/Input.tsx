import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none placeholder:text-neutral-500 ${className}`}
      {...props}
    />
  );
}