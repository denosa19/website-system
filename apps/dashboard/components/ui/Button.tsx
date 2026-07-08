import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-neutral-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}