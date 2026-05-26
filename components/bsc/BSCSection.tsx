import { Zap } from "lucide-react";
import { FrameworkHeader } from "@/components/ui/FrameworkHeader";
import { BSCSkeleton } from "@/components/ui/LoadingSkeleton";
import { Button } from "@/components/ui/Button";
import { StepBadge } from "@/components/ui/StepBadge";
import { BSCTable } from "./BSCTable";
import type { BSCData } from "@/types";

interface BSCSectionProps {
  data: BSCData | null;
  loading: boolean;
  onGenerate: () => void;
}

export function BSCSection({ data, loading, onGenerate }: BSCSectionProps) {
  return (
    <div
      className="rounded-sm overflow-hidden animate-fade-up"
      style={{ border: "1px solid var(--border-mid)" }}
    >
      <FrameworkHeader
        title="Balanced Scorecard (BSC)"
        subtitle="Financial · Customers & Partners · Systems & Processes · Learning & Growth"
      />

      {/* Pre-generation CTA — shown before Step 2 is triggered */}
      {!loading && !data && (
        <div
          className="flex flex-col items-center justify-center gap-6 py-16 px-8"
          style={{ background: "var(--navy)" }}
        >
          <StepBadge step={2} status="pending" label="Balanced Scorecard" />

          <div className="text-center space-y-2 max-w-md">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Ready to generate the Balanced Scorecard
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--muted)" }}
            >
              Step 2 uses the SOAP objectives and 3HM priorities established
              above to generate SMART Actions across all four BSC perspectives.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={onGenerate}
            className="gap-2"
          >
            <Zap size={15} />
            Generate Balanced Scorecard
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div style={{ background: "var(--navy)" }}>
          <div
            className="flex items-center gap-3 px-8 py-4"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <StepBadge step={2} status="active" label="Generating BSC…" />
          </div>
          <BSCSkeleton />
        </div>
      )}

      {/* Data rendered */}
      {!loading && data && (
        <div style={{ background: "var(--navy)" }}>
          {/* Step badge done row */}
          <div
            className="flex items-center justify-between px-8 py-3"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <StepBadge step={2} status="done" label="Balanced Scorecard" />
            <p
              className="text-xs font-mono"
              style={{ color: "var(--muted-dim)" }}
            >
              RAG status and Lead fields require human input
            </p>
          </div>

          <BSCTable perspectives={data.perspectives} />
        </div>
      )}
    </div>
  );
}
