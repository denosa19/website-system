import type { ReactNode } from "react";
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
    <section className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  );
}