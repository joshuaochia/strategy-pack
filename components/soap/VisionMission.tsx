import { Eye, Target } from "lucide-react";

interface VisionMissionProps {
  vision: string;
  mission: string;
}

function HexCard({
  icon: Icon,
  label,
  content,
  accent,
}: {
  icon: typeof Eye;
  label: string;
  content: string;
  accent: string;
}) {
  return (
    <div
      className="flex gap-5 p-6 rounded-sm"
      style={{
        background: "var(--navy-mid)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Hex icon */}
      <div className="shrink-0 mt-0.5">
        <div
          className="relative flex items-center justify-center w-12 h-12"
          style={{ color: accent }}
        >
          {/* Hexagon SVG background */}
          <svg
            viewBox="0 0 48 48"
            className="absolute inset-0 w-full h-full"
            fill="none"
          >
            <polygon
              points="24,2 44,13 44,35 24,46 4,35 4,13"
              stroke={accent}
              strokeWidth="1.5"
              fill={`${accent}18`}
            />
          </svg>
          <Icon size={18} strokeWidth={1.5} className="relative z-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 min-w-0">
        <span
          className="text-xs font-mono font-semibold tracking-widest uppercase"
          style={{ color: accent }}
        >
          {label}
        </span>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-primary)" }}
        >
          {content}
        </p>
      </div>
    </div>
  );
}

export function VisionMission({ vision, mission }: VisionMissionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <HexCard
        icon={Eye}
        label="Vision"
        content={vision}
        accent="var(--teal)"
      />
      <HexCard
        icon={Target}
        label="Mission"
        content={mission}
        accent="var(--orange)"
      />
    </div>
  );
}
