import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        ${theme.radius.lg}
        ${theme.colors.border}
        ${theme.colors.surfaceLight}
        ${theme.spacing.md}
        ${theme.shadow.sm}
        ${className}
      `}
    >
      {children}
    </div>
  );
}