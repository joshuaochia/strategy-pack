import { RAGBadge } from "./RAGBadge";
import type { BSCRow as BSCRowType } from "@/types";

interface BSCRowProps {
  row: BSCRowType;
  accent: string;
  isLast: boolean;
}

export function BSCRow({ row, accent, isLast }: BSCRowProps) {
  return (
    <tr
      style={{
        borderBottom: isLast ? "none" : "1px solid var(--border-subtle)",
      }}
    >
      {/* Objective */}
      <td
        className="px-4 py-3.5 text-sm font-medium align-top leading-relaxed"
        style={{ color: "var(--text-primary)", width: "28%" }}
      >
        <div className="flex items-start gap-2">
          <div
            className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
            style={{ background: accent }}
          />
          {row.objective}
        </div>
      </td>

      {/* SMART Actions */}
      <td className="px-4 py-3.5 align-top" style={{ width: "52%" }}>
        <ul className="flex flex-col gap-1.5">
          {row.smartActions.map((action, i) => (
            <li
              key={i}
              className="flex gap-2 text-xs leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              <span
                className="shrink-0 font-mono mt-0.5"
                style={{ color: "var(--muted-dim)" }}
              >
                ›
              </span>
              {action}
            </li>
          ))}
        </ul>
      </td>

      {/* RAG Status */}
      <td className="px-4 py-3.5 align-top" style={{ width: "10%" }}>
        <div className="flex justify-center">
          <RAGBadge status={row.ragStatus} />
        </div>
      </td>

      {/* Lead */}
      <td
        className="px-4 py-3.5 align-top text-center font-mono text-xs"
        style={{ color: "var(--muted-dim)", width: "10%" }}
      >
        —
      </td>
    </tr>
  );
}
