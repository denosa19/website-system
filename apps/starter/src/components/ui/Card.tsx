import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border border-white/10
        bg-white/5
        p-6
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
}