import type { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  icon?: ReactNode;
};

export function Button({ className, variant = "primary", icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
        variant === "primary" && "bg-leaf-700 text-white hover:bg-leaf-600",
        variant === "secondary" && "border border-border bg-white text-ink hover:bg-leaf-50",
        variant === "danger" && "bg-red-700 text-white hover:bg-red-600",
        variant === "ghost" && "text-muted hover:bg-leaf-50 hover:text-leaf-700",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
