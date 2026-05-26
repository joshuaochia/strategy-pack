import { cn } from "@/lib/utils";

interface GoalCardProps {
  index: number;
  title: string;
  objectives: string[];
}

const ACCENT_COLOURS = [
  "var(--teal)",
  "var(--orange)",
  "#7B9EC4", // steel blue for goal 3
];

export function GoalCard({ index, title, objectives }: GoalCardProps) {
  const accent = ACCENT_COLOURS[(index - 1) % ACCENT_COLOURS.length];

  return (
    <div
      className="flex flex-col rounded-sm overflow-hidden animate-fade-up"
      style={{
        background: "var(--navy-mid)",
        border: "1px solid var(--border-subtle)",
        animationDelay: `${(index - 1) * 80}ms`,
      }}
    >
      {/* Chevron banner */}
      <div
        className="relative flex items-center gap-3 px-4 py-3"
        style={{ background: "var(--navy-light)" }}
      >
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ background: accent }}
        />

        {/* Number badge */}
        <div
          className="flex items-center justify-center w-7 h-7 rounded-sm shrink-0 text-sm font-mono font-semibold"
          style={{
            background: `${accent}22`,
            color: accent,
            border: `1px solid ${accent}44`,
          }}
        >
          {index}
        </div>

        {/* Title */}
        <span
          className="text-sm font-semibold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </span>

        {/* Chevron decoration */}
        <div
          className="absolute right-0 top-0 bottom-0 w-6 overflow-hidden pointer-events-none"
          aria-hidden
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-12"
            style={{
              background: `linear-gradient(135deg, transparent 50%, ${accent}18 50%)`,
            }}
          />
        </div>
      </div>

      {/* Objectives list */}
      <div className="flex flex-col gap-0 flex-1">
        {objectives.map((obj, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3 px-4 py-3 text-sm leading-relaxed",
              i < objectives.length - 1 &&
                "border-b border-[var(--border-subtle)]",
            )}
            style={{ color: "var(--text-secondary)" }}
          >
            {/* Objective number */}
            <span
              className="shrink-0 text-xs font-mono font-medium mt-0.5"
              style={{ color: accent, minWidth: "2rem" }}
            >
              {index}.{i + 1}
            </span>
            <span>{obj}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
