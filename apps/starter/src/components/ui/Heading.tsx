import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

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
    h1: theme.typography.h1,
    h2: theme.typography.h2,
    h3: theme.typography.h3,
  };

  const Tag = level;

  return <Tag className={`${styles[level]} ${className}`}>{children}</Tag>;
}