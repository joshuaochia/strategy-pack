import { FrameworkHeader } from "@/components/ui/FrameworkHeader";
import { SOAPSkeleton } from "@/components/ui/LoadingSkeleton";
import { VisionMission } from "./VisionMission";
import { GoalCard } from "./GoalCard";
import { ValuesBar } from "./ValuesBar";
import type { SOAPData } from "@/types";

interface SOAPSectionProps {
  data: SOAPData | null;
  loading: boolean;
}

export function SOAPSection({ data, loading }: SOAPSectionProps) {
  return (
    <div
      className="rounded-sm overflow-hidden animate-fade-up"
      style={{ border: "1px solid var(--border-mid)" }}
    >
      <FrameworkHeader
        title="Strategy-on-a-Page (SOAP)"
        subtitle="Goals & Objectives"
      />

      {loading && <SOAPSkeleton />}

      {!loading && data && (
        <div className="p-8 space-y-8" style={{ background: "var(--navy)" }}>
          {/* Vision + Mission */}
          <VisionMission vision={data.vision} mission={data.mission} />

          {/* Goals & Objectives */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-mono font-semibold tracking-widest uppercase"
                style={{ color: "var(--muted)" }}
              >
                Goals &amp; Objectives
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "var(--border-subtle)" }}
              />
            </div>

            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${data.goals.length}, 1fr)`,
              }}
            >
              {data.goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  index={goal.id}
                  title={goal.title}
                  objectives={goal.objectives}
                />
              ))}
            </div>
          </div>

          {/* Leadership Values */}
          <ValuesBar values={data.leadershipValues} />
        </div>
      )}
    </div>
  );
}
