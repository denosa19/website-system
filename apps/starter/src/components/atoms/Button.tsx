import Link from "next/link";
import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  disabled = false,
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

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  const classes = `
    inline-flex items-center justify-center
    ${theme.radius.button}
    ${sizeClasses[size]}
    ${theme.typography.button}
    ${variantClasses[variant]}
    ${disabledClasses}
    transition
  `;

  if (href) {
    return (
      <Link href={disabled ? "#" : href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled}>
      {children}
    </button>
  );
}