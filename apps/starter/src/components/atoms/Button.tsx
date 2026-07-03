import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
};

export default function Button({
  children,
  variant = "primary",
}: ButtonProps) {
  const variantClasses = {
    primary: `${theme.colors.primary} ${theme.colors.primaryHover}`,
    secondary: "bg-transparent text-white border border-white hover:bg-white hover:text-black",
  };

  return (
    <button
      className={`
        ${theme.radius.button}
        ${theme.spacing.button}
        ${theme.typography.button}
        ${variantClasses[variant]}
        transition
      `}
    >
      {children}
    </button>
  );
}