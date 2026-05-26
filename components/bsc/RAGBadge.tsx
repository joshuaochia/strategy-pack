import { cn } from "@/lib/utils";
import type { RAGStatus } from "@/types";

interface RAGBadgeProps {
  status: RAGStatus;
  className?: string;
}

const RAG_CONFIG = {
  R: {
    label: "R",
    color: "var(--rag-red)",
    bg: "rgba(231,76,60,0.12)",
    border: "rgba(231,76,60,0.3)",
  },
  A: {
    label: "A",
    color: "var(--rag-amber)",
    bg: "rgba(243,156,18,0.12)",
    border: "rgba(243,156,18,0.3)",
  },
  G: {
    label: "G",
    color: "var(--rag-green)",
    bg: "rgba(39,174,96,0.12)",
    border: "rgba(39,174,96,0.3)",
  },
};

export function RAGBadge({ status, className }: RAGBadgeProps) {
  if (!status) {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-semibold",
          className,
        )}
        style={{
          border: "1.5px dashed var(--border-mid)",
          color: "var(--muted-dim)",
        }}
        title="Awaiting human review"
      >
        —
      </div>
    );
  }

  const config = RAG_CONFIG[status];

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-bold",
        className,
      )}
      style={{
        background: config.bg,
        border: `1.5px solid ${config.border}`,
        color: config.color,
      }}
    >
      {config.label}
    </div>
  );
}
