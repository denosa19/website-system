import type { ReactNode } from "react";

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
    default: "text-base text-white",
    muted: "text-base text-neutral-300",
    large: "text-xl text-neutral-300",
  };

  return <p className={`${styles[variant]} ${className}`}>{children}</p>;
}