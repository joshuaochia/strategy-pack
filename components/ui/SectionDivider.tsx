import { cn } from "@/lib/utils";

interface SectionDividerProps {
  label?: string;
  className?: string;
}

export function SectionDivider({ label, className }: SectionDividerProps) {
  return (
    <div className={cn("flex items-center gap-4 py-2", className)}>
      <div
        className="flex-1 h-px"
        style={{ background: "var(--border-subtle)" }}
      />
      {label && (
        <span
          className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-sm shrink-0"
          style={{
            color: "var(--muted-dim)",
            background: "var(--navy-mid)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          {label}
        </span>
      )}
      <div
        className="flex-1 h-px"
        style={{ background: "var(--border-subtle)" }}
      />
    </div>
  );
}
