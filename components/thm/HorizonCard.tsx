import type { HorizonData } from "@/types";

const HORIZON_CONFIG = {
  1: {
    accent: "var(--teal)",
    bg: "rgba(46,196,182,0.08)",
    border: "rgba(46,196,182,0.2)",
  },
  2: {
    accent: "var(--orange)",
    bg: "rgba(232,81,26,0.08)",
    border: "rgba(232,81,26,0.2)",
  },
  3: {
    accent: "#7B9EC4",
    bg: "rgba(123,158,196,0.08)",
    border: "rgba(123,158,196,0.2)",
  },
};

interface HorizonCardProps {
  horizon: HorizonData;
}

export function HorizonCard({ horizon }: HorizonCardProps) {
  const config = HORIZON_CONFIG[horizon.id];

  return (
    <div
      className="flex gap-4 p-5 rounded-sm animate-fade-up"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        animationDelay: `${(horizon.id - 1) * 100}ms`,
      }}
    >
      {/* Hex badge */}
      <div className="shrink-0">
        <div
          className="relative flex items-center justify-center w-10 h-10"
          style={{ color: config.accent }}
        >
          <svg
            viewBox="0 0 40 40"
            className="absolute inset-0 w-full h-full"
            fill="none"
          >
            <polygon
              points="20,2 36,11 36,29 20,38 4,29 4,11"
              fill={config.bg}
              stroke={config.accent}
              strokeWidth="1.5"
            />
          </svg>
          <span
            className="relative z-10 text-xs font-mono font-bold"
            style={{ color: config.accent }}
          >
            H{horizon.id}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        {/* Header row */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className="text-sm font-semibold"
            style={{ color: config.accent }}
          >
            {horizon.label}
          </span>
          <span
            className="text-xs font-mono"
            style={{ color: "var(--muted-dim)" }}
          >
            {horizon.timeframe}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ background: config.border }} />

        {/* Objectives */}
        <ul className="flex flex-col gap-2">
          {horizon.objectives.map((obj, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
              <span
                className="shrink-0 font-mono text-xs mt-0.5 font-medium"
                style={{ color: config.accent, minWidth: "2.2rem" }}
              >
                {horizon.id}.{i + 1}
              </span>
              <span style={{ color: "var(--text-secondary)" }}>{obj}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
