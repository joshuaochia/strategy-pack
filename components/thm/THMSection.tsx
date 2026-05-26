import { FrameworkHeader } from "@/components/ui/FrameworkHeader";
import { THMSkeleton } from "@/components/ui/LoadingSkeleton";
import { HorizonCurve } from "./HorizonCurve";
import { HorizonCard } from "./HorizonCard";
import type { THMData } from "@/types";

interface THMSectionProps {
  data: THMData | null;
  loading: boolean;
}

export function THMSection({ data, loading }: THMSectionProps) {
  return (
    <div
      className="rounded-sm overflow-hidden animate-fade-up"
      style={{ border: "1px solid var(--border-mid)" }}
    >
      <FrameworkHeader
        title="3-Horizons Model (3HM)"
        subtitle="Operationalise · Integrate · Endure"
      />

      {loading && <THMSkeleton />}

      {!loading && data && (
        <div className="p-8" style={{ background: "var(--navy)" }}>
          <div className="grid grid-cols-2 gap-8 items-start">
            {/* Left — SVG curve */}
            <div className="flex flex-col gap-3">
              <HorizonCurve className="w-full" style={{ height: "320px" }} />
            </div>

            {/* Right — Horizon cards stacked */}
            <div className="flex flex-col gap-4">
              {/* H3 on top (highest growth), H1 at bottom — matches visual */}
              <HorizonCard horizon={data.h3} />
              <HorizonCard horizon={data.h2} />
              <HorizonCard horizon={data.h1} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
