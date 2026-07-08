import type { ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3";

type HeadingProps = {
  children: ReactNode;
  level?: HeadingLevel;
  className?: string;
};

export default function Heading({
  children,
  level = "h2",
  className = "",
}: HeadingProps) {
  const styles = {
    h1: "text-5xl font-bold tracking-tight sm:text-6xl",
    h2: "text-4xl font-bold tracking-tight sm:text-5xl",
    h3: "text-2xl font-bold tracking-tight",
  };

  const Tag = level;

  return <Tag className={`${styles[level]} ${className}`}>{children}</Tag>;
}