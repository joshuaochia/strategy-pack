import type { CSSProperties } from "react";

interface HorizonCurveProps {
  className?: string;
  style?: CSSProperties;
}

export function HorizonCurve({ className, style }: HorizonCurveProps) {
  return (
    <div className={className} style={style}>
      <svg
        viewBox="0 0 420 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden
      >
        {/* ── Zone fills ─────────────────────────────────────────── */}
        <rect x="0" y="0" width="140" height="280" fill="rgba(13,27,42,0.6)" />
        <rect
          x="140"
          y="0"
          width="140"
          height="280"
          fill="rgba(26,46,66,0.4)"
        />
        <rect
          x="280"
          y="0"
          width="140"
          height="280"
          fill="rgba(36,59,85,0.3)"
        />

        {/* ── Zone dividers ───────────────────────────────────────── */}
        <line
          x1="140"
          y1="0"
          x2="140"
          y2="280"
          stroke="rgba(139,156,175,0.15)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="280"
          y1="0"
          x2="280"
          y2="280"
          stroke="rgba(139,156,175,0.15)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* ── Y axis ──────────────────────────────────────────────── */}
        <line
          x1="32"
          y1="16"
          x2="32"
          y2="280"
          stroke="rgba(139,156,175,0.3)"
          strokeWidth="1"
        />
        {/* Arrow */}
        <polygon points="32,10 28,20 36,20" fill="rgba(139,156,175,0.3)" />

        {/* ── X axis ──────────────────────────────────────────────── */}
        <line
          x1="32"
          y1="280"
          x2="408"
          y2="280"
          stroke="rgba(139,156,175,0.3)"
          strokeWidth="1"
        />
        {/* Arrow */}
        <polygon
          points="414,280 404,276 404,284"
          fill="rgba(139,156,175,0.3)"
        />

        {/* ── Growth curve (S-curve) ──────────────────────────────── */}
        {/* Glow layer */}
        <path
          d="M 32 260 C 60 258, 90 252, 110 240 C 130 228, 138 210, 160 185 C 185 155, 210 120, 240 90 C 265 65, 300 42, 380 28"
          fill="none"
          stroke="rgba(46,196,182,0.15)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Main curve */}
        <path
          d="M 32 260 C 60 258, 90 252, 110 240 C 130 228, 138 210, 160 185 C 185 155, 210 120, 240 90 C 265 65, 300 42, 380 28"
          fill="none"
          stroke="var(--teal)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* ── Horizon marker dots on curve ───────────────────────── */}
        {/* H1 dot — ~x=90 */}
        <circle
          cx="90"
          cy="250"
          r="5"
          fill="var(--navy)"
          stroke="var(--teal)"
          strokeWidth="2"
        />
        {/* H2 dot — ~x=210 */}
        <circle
          cx="210"
          cy="120"
          r="5"
          fill="var(--navy)"
          stroke="var(--teal)"
          strokeWidth="2"
        />
        {/* H3 dot — ~x=340 */}
        <circle
          cx="340"
          cy="44"
          r="5"
          fill="var(--navy)"
          stroke="var(--teal)"
          strokeWidth="2"
        />

        {/* ── Horizon zone labels (bottom) ────────────────────────── */}
        <text
          x="70"
          y="300"
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--font-ibm-plex-mono, monospace)"
          fill="rgba(139,156,175,0.7)"
          fontWeight="600"
        >
          HORIZON 1
        </text>
        <text
          x="210"
          y="300"
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--font-ibm-plex-mono, monospace)"
          fill="rgba(139,156,175,0.7)"
          fontWeight="600"
        >
          HORIZON 2
        </text>
        <text
          x="350"
          y="300"
          textAnchor="middle"
          fontSize="10"
          fontFamily="var(--font-ibm-plex-mono, monospace)"
          fill="rgba(139,156,175,0.7)"
          fontWeight="600"
        >
          HORIZON 3
        </text>

        {/* ── Timeframe labels (bottom sub) ───────────────────────── */}
        <text
          x="70"
          y="313"
          textAnchor="middle"
          fontSize="8"
          fontFamily="var(--font-ibm-plex-mono, monospace)"
          fill="rgba(139,156,175,0.4)"
        >
          12 months
        </text>
        <text
          x="210"
          y="313"
          textAnchor="middle"
          fontSize="8"
          fontFamily="var(--font-ibm-plex-mono, monospace)"
          fill="rgba(139,156,175,0.4)"
        >
          12–24 months
        </text>
        <text
          x="350"
          y="313"
          textAnchor="middle"
          fontSize="8"
          fontFamily="var(--font-ibm-plex-mono, monospace)"
          fill="rgba(139,156,175,0.4)"
        >
          36 months+
        </text>

        {/* ── Y axis label ────────────────────────────────────────── */}
        <text
          x="14"
          y="150"
          textAnchor="middle"
          fontSize="9"
          fontFamily="var(--font-ibm-plex-mono, monospace)"
          fill="rgba(139,156,175,0.5)"
          fontWeight="600"
          transform="rotate(-90, 14, 150)"
          letterSpacing="2"
        >
          GROWTH
        </text>
      </svg>
    </div>
  );
}
