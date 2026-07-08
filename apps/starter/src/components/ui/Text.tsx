import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

type TextVariant = "default" | "muted" | "large";

type TextProps = {
  children: ReactNode;
  variant?: TextVariant;
  className?: string;
};

export default function Text({
  children,
  variant = "default",
  className = "",
}: TextProps) {
  const styles = {
    default: `${theme.typography.body} ${theme.colors.text}`,
    muted: `${theme.typography.body} ${theme.colors.muted}`,
    large: `${theme.typography.large} ${theme.colors.muted}`,
  };

  return <p className={`${styles[variant]} ${className}`}>{children}</p>;
}