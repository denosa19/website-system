import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
}: ButtonProps) {
  const variantClasses = {
    primary: `${theme.colors.primary} ${theme.colors.primaryHover}`,
    secondary:
      "bg-transparent text-white border border-white hover:bg-white hover:text-black",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: theme.spacing.button,
    lg: "px-10 py-5 text-lg",
  };

  return (
    <button
      className={`
        ${theme.radius.button}
        ${sizeClasses[size]}
        ${theme.typography.button}
        ${variantClasses[variant]}
        transition
      `}
    >
      {children}
    </button>
  );
}