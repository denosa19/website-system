import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-neutral-800 bg-neutral-900 p-6 ${className}`}>
      {children}
    </div>
  );
}