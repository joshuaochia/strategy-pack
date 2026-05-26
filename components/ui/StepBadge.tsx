import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type StepStatus = "pending" | "active" | "done";

interface StepBadgeProps {
  step: 1 | 2;
  status: StepStatus;
  label?: string;
  className?: string;
}

export function StepBadge({ step, status, label, className }: StepBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      {/* Circle */}
      <div
        className={cn(
          "relative flex items-center justify-center w-7 h-7 rounded-full text-xs font-mono font-semibold shrink-0 transition-all duration-300",
          status === "pending" &&
            "border border-[var(--border-mid)] text-[var(--muted)]",
          status === "active" &&
            "border border-[var(--teal)] text-[var(--teal)] glow-teal",
          status === "done" &&
            "bg-[var(--teal)] text-[var(--navy)] border border-[var(--teal)]",
        )}
      >
        {/* Active pulse */}
        {status === "active" && (
          <span className="absolute inset-0 rounded-full border border-[var(--teal)] pulse-dot" />
        )}
        {status === "done" ? <Check size={12} strokeWidth={3} /> : step}
      </div>

      {/* Label */}
      <div className="flex flex-col gap-0">
        <span
          className={cn(
            "text-xs font-mono font-medium tracking-widest uppercase transition-colors duration-300",
            status === "pending" && "text-[var(--muted-dim)]",
            status === "active" && "text-[var(--teal)]",
            status === "done" && "text-[var(--muted)]",
          )}
        >
          Step {step}
        </span>
        {label && (
          <span
            className={cn(
              "text-xs transition-colors duration-300",
              status === "pending" && "text-[var(--muted-dim)]",
              status === "active" && "text-[var(--text-primary)]",
              status === "done" && "text-[var(--muted)]",
            )}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
