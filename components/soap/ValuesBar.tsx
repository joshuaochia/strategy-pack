interface ValuesBarProps {
  values: string[];
}

export function ValuesBar({ values }: ValuesBarProps) {
  return (
    <div className="space-y-2">
      {/* Label */}
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-mono font-semibold tracking-widest uppercase"
          style={{ color: "var(--muted)" }}
        >
          Leadership Values
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: "var(--border-subtle)" }}
        />
      </div>

      {/* Values strip */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${values.length}, 1fr)` }}
      >
        {values.map((value, i) => (
          <div
            key={i}
            className="flex items-center justify-center px-3 py-3 rounded-sm text-center"
            style={{
              background: "var(--navy-light)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <span
              className="text-xs font-mono font-semibold tracking-wide uppercase"
              style={{ color: "var(--muted)" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
