import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { theme } from "../../styles/theme";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={cn(
        theme.radius.lg,
        theme.colors.border,
        theme.colors.surfaceLight,
        theme.spacing.md,
        theme.shadow.sm,
        className
      )}
    >
      {children}
    </div>
  );
}