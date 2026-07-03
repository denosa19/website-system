import type { ReactNode } from "react";
import { theme } from "../styles/theme";
type ButtonProps = {
  children: ReactNode;
};

export default function Button({ children }: ButtonProps) {
  return (
    <button className={`${theme.colors.primary} ${theme.radius.button} ${theme.spacing.button} ${theme.typography.button}`}>
      {children}
    </button>
  );
}