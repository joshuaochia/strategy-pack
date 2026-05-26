import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

function Bone({ className }: SkeletonProps) {
  return <div className={cn("skeleton", className)} />;
}

export function SOAPSkeleton() {
  return (
    <div className="p-8 space-y-8 animate-fade-up">
      {/* Vision / Mission row */}
      <div className="grid grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="p-5 rounded-sm space-y-3"
            style={{
              background: "var(--navy-mid)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <Bone className="h-3 w-20" />
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-3/4" />
          </div>
        ))}
      </div>

      {/* Goals */}
      <div className="space-y-2">
        <Bone className="h-3 w-32 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <Bone className="h-10 w-full rounded-sm" />
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-5/6" />
              <Bone className="h-3 w-4/6" />
            </div>
          ))}
        </div>
      </div>

      {/* Values bar */}
      <div className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Bone key={i} className="h-10 w-full rounded-sm" />
        ))}
      </div>
    </div>
  );
}

export function THMSkeleton() {
  return (
    <div className="p-8 animate-fade-up">
      <div className="grid grid-cols-2 gap-8">
        {/* Curve placeholder */}
        <Bone className="h-64 w-full rounded-sm" />

        {/* Horizon cards */}
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="p-4 rounded-sm space-y-2"
              style={{
                background: "var(--navy-mid)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="flex items-center gap-3">
                <Bone className="h-8 w-8 rounded-sm" />
                <Bone className="h-4 w-40" />
              </div>
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BSCSkeleton() {
  return (
    <div className="p-8 animate-fade-up">
      <div className="space-y-1">
        {/* Table header */}
        <div
          className="grid grid-cols-4 gap-4 px-4 py-2"
          style={{ background: "var(--navy-light)" }}
        >
          {["Perspective", "Objective", "SMART Actions", "Status"].map((h) => (
            <Bone key={h} className="h-3 w-24" />
          ))}
        </div>

        {/* Rows */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-4 px-4 py-3"
            style={{
              background: i % 2 === 0 ? "var(--navy-mid)" : "transparent",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <Bone className="h-3 w-20" />
            <Bone className="h-3 w-full" />
            <div className="space-y-1.5">
              <Bone className="h-3 w-full" />
              <Bone className="h-3 w-4/5" />
            </div>
            <Bone className="h-6 w-8 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
