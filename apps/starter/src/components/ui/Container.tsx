import type { ReactNode } from "react";
import { theme } from "../../styles/theme";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`${theme.container.default} ${className}`}>
      {children}
    </div>
  );
}