import { cn } from "@/lib/utils";

interface FrameworkHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function FrameworkHeader({
  title,
  subtitle,
  className,
}: FrameworkHeaderProps) {
  return (
    <div
      className={cn(
        "diagonal-accent relative px-8 py-5 select-none",
        className,
      )}
      style={{ background: "var(--navy-mid)" }}
    >
      {/* Left orange rule */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: "var(--orange)" }}
      />

      <div className="flex flex-col gap-0.5 pr-24">
        <h2
          className="text-lg font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "var(--muted)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
