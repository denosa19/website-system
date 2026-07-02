export interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;

  primaryButton?: {
    text: string;
    href: string;
  };

  secondaryButton?: {
    text: string;
    href: string;
  };

  backgroundImage?: string;

  backgroundVideo?: string;

  overlay?: boolean;

  alignment?: "left" | "center";

  height?: "small" | "medium" | "large";

  darkMode?: boolean;
}