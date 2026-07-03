import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
};

export default function Button({ children }: ButtonProps) {
  return (
    <button className="rounded-xl bg-white text-black px-8 py-4 font-semibold hover:bg-neutral-200 transition">
      {children}
    </button>
  );
}