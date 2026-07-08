import type { ReactNode } from "react";

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
    sm: "py-12",
    md: "py-20",
    lg: "py-28",
  };

  return (
    <section className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  );
}