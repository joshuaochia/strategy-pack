import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={cn(
        // Base
        "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-200 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]",
        "disabled:opacity-40 disabled:cursor-not-allowed",

        // Size
        size === "sm" && "px-3 py-1.5 text-xs rounded",
        size === "md" && "px-5 py-2.5 text-sm rounded-sm",
        size === "lg" && "px-7 py-3.5 text-sm rounded-sm",

        // Variant
        variant === "primary" && [
          "bg-[var(--teal)] text-[var(--navy)] border border-[var(--teal)]",
          "hover:bg-[var(--teal-dim)] hover:border-[var(--teal-dim)]",
          "active:scale-[0.98]",
        ],
        variant === "ghost" && [
          "bg-transparent text-[var(--text-primary)] border border-[var(--border-mid)]",
          "hover:border-[var(--border-strong)] hover:bg-[var(--navy-mid)]",
          "active:scale-[0.98]",
        ],
        variant === "danger" && [
          "bg-transparent text-[var(--rag-red)] border border-[var(--rag-red)]",
          "hover:bg-[var(--rag-red)] hover:text-white",
          "active:scale-[0.98]",
        ],

        className,
      )}
      {...props}
    >
      {loading && (
        <Loader2
          className="animate-spin shrink-0"
          size={size === "sm" ? 12 : 14}
        />
      )}
      {children}
    </button>
  );
}
