import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { theme } from "../../styles/theme";

type SectionSpacing = "sm" | "md" | "lg";

type SectionProps = {
  children: ReactNode;
  className?: string;
  spacing?: SectionSpacing;
};

export default function Section({
  children,
  className = "",
  spacing = "lg",
}: SectionProps) {
  const spacingClasses = {
    sm: theme.spacing.sectionSm,
    md: theme.spacing.sectionMd,
    lg: theme.spacing.sectionLg,
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {children}
    </section>
  );
}