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
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  disabled = false,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const variantClasses = {
    primary: `${theme.colors.primary} ${theme.colors.primaryHover}`,
    secondary: theme.colors.secondary,
  };

  const sizeClasses = {
    sm: `${theme.spacing.buttonSm} text-sm`,
    md: theme.spacing.buttonMd,
    lg: `${theme.spacing.buttonLg} text-lg`,
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "";

  const classes = `
    inline-flex items-center justify-center gap-2
    ${theme.radius.md}
    ${sizeClasses[size]}
    ${theme.typography.button}
    ${variantClasses[variant]}
    ${disabledClasses}
    ${theme.animation.default}
  `;

  const content = (
    <>
      {leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span>{rightIcon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={disabled ? "#" : href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled}>
      {content}
    </button>
  );
}