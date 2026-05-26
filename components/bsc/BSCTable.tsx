import { BSCRow } from "./BSCRow";
import { BSC_PERSPECTIVE_LABELS } from "@/types";
import type { BSCPerspective, BSCPerspectiveKey } from "@/types";

interface BSCTableProps {
  perspectives: BSCPerspective[];
}

const PERSPECTIVE_CONFIG: Record<
  BSCPerspectiveKey,
  { accent: string; icon: string }
> = {
  financial: { accent: "var(--teal)", icon: "₿" },
  customers: { accent: "var(--orange)", icon: "◈" },
  systems: { accent: "#7B9EC4", icon: "⬡" },
  learning: { accent: "#B07FD4", icon: "◎" },
};

export function BSCTable({ perspectives }: BSCTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        {/* Table header */}
        <thead>
          <tr style={{ background: "var(--navy-light)" }}>
            {[
              "Objective",
              "Performance Measures & Targets (SMART Actions)",
              "RAG",
              "Lead",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left font-mono text-xs font-semibold tracking-widest uppercase"
                style={{
                  color: "var(--muted)",
                  borderBottom: "1px solid var(--border-mid)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {perspectives.map((perspective, pi) => {
            const config = PERSPECTIVE_CONFIG[perspective.key];
            const label = BSC_PERSPECTIVE_LABELS[perspective.key];

            return (
              <>
                {/* Perspective group header */}
                <tr key={`header-${perspective.key}`}>
                  <td
                    colSpan={4}
                    className="px-4 py-2.5"
                    style={{
                      background: "var(--navy-mid)",
                      borderTop:
                        pi > 0 ? "2px solid var(--border-mid)" : "none",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Accent pill */}
                      <div
                        className="w-1 h-4 rounded-full shrink-0"
                        style={{ background: config.accent }}
                      />
                      <span
                        className="text-xs font-mono font-semibold tracking-widest uppercase"
                        style={{ color: config.accent }}
                      >
                        {label}
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Perspective rows */}
                {perspective.rows.map((row, ri) => (
                  <tr
                    key={row.id}
                    style={{
                      background:
                        ri % 2 === 0 ? "transparent" : "rgba(26,46,66,0.4)",
                    }}
                  >
                    {/* Render as a single row but use BSCRow internals */}
                    <td
                      className="px-4 py-3.5 text-sm font-medium align-top leading-relaxed"
                      style={{
                        color: "var(--text-primary)",
                        width: "28%",
                        borderBottom:
                          ri < perspective.rows.length - 1
                            ? "1px solid var(--border-subtle)"
                            : "none",
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                          style={{ background: config.accent }}
                        />
                        {row.objective}
                      </div>
                    </td>

                    <td
                      className="px-4 py-3.5 align-top"
                      style={{
                        width: "52%",
                        borderBottom:
                          ri < perspective.rows.length - 1
                            ? "1px solid var(--border-subtle)"
                            : "none",
                      }}
                    >
                      <ul className="flex flex-col gap-1.5">
                        {row.smartActions.map((action, ai) => (
                          <li
                            key={ai}
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

                    <td
                      className="px-4 py-3.5 align-top"
                      style={{
                        width: "10%",
                        borderBottom:
                          ri < perspective.rows.length - 1
                            ? "1px solid var(--border-subtle)"
                            : "none",
                      }}
                    >
                      <div className="flex justify-center">
                        <div
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-semibold"
                          style={{
                            border: "1.5px dashed var(--border-mid)",
                            color: "var(--muted-dim)",
                          }}
                          title="Awaiting human review"
                        >
                          —
                        </div>
                      </div>
                    </td>

                    <td
                      className="px-4 py-3.5 align-top text-center font-mono text-xs"
                      style={{
                        color: "var(--muted-dim)",
                        width: "10%",
                        borderBottom:
                          ri < perspective.rows.length - 1
                            ? "1px solid var(--border-subtle)"
                            : "none",
                      }}
                    >
                      —
                    </td>
                  </tr>
                ))}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
