"use client";

import { useState, useEffect, useRef } from "react";
import {
  Shield,
  Clock,
  FileX,
  Globe,
  RefreshCw,
  Smartphone,
  Zap,
  AlertTriangle,
  Check,
  ChevronRight,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type Tab = "edge" | "roadmap" | "stack" | "compare";

// ─── ANIMATION HOOK ───────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── EDGE CASES ───────────────────────────────────────────────────────────────

const EDGE_CASES = [
  {
    icon: FileX,
    color: "var(--rag-red)",
    bg: "rgba(231,76,60,0.1)",
    title: "Malformed or scanned PDF",
    desc: "User uploads an image-only PDF. No extractable text — Gemini returns vague or hallucinated content.",
    fix: 'Detect with OCR check before sending. Warn: "This PDF may be image-only."',
  },
  {
    icon: AlertTriangle,
    color: "var(--rag-red)",
    bg: "rgba(231,76,60,0.1)",
    title: "Gemini returns invalid JSON",
    desc: "Model occasionally wraps output in markdown fences or returns partial JSON — Zod validation fails.",
    fix: "safeParseJSON strips fences. Add retry button in UI on schema failure.",
  },
  {
    icon: Clock,
    color: "var(--rag-amber)",
    bg: "rgba(243,156,18,0.1)",
    title: "Request timeout on Vercel",
    desc: "Large PDFs + slow Gemini response can exceed the 60s function timeout on the free tier.",
    fix: "Stream the response. Move to Vercel Pro (300s). Show elapsed timer in UI.",
  },
  {
    icon: Shield,
    color: "var(--rag-amber)",
    bg: "rgba(243,156,18,0.1)",
    title: "Unrelated documents uploaded",
    desc: "User uploads an invoice or HR policy — AI generates nonsense strategy output.",
    fix: "Add relevance check in Step 1 prompt. Return confidence score, warn if low.",
  },
  {
    icon: Globe,
    color: "var(--teal)",
    bg: "rgba(46,196,182,0.1)",
    title: "Non-English documents",
    desc: "Strategy doc in French or Mandarin — output language may be inconsistent with UI.",
    fix: "Detect language server-side. Add output language selector. Force English in prompt.",
  },
  {
    icon: RefreshCw,
    color: "var(--teal)",
    bg: "rgba(46,196,182,0.1)",
    title: "Orphaned blobs on reset",
    desc: "User hits Reset after Step 2 — blob URLs stay in Vercel storage, wasting quota.",
    fix: "Call blob.delete() on reset. Set 1hr TTL on uploaded blobs via Vercel config.",
  },

  {
    icon: Zap,
    color: "var(--muted)",
    bg: "rgba(139,156,175,0.1)",
    title: "Gemini rate limit (429)",
    desc: "Free tier: 15 req/min. Multiple users simultaneously triggers 429 with no client feedback.",
    fix: 'Catch 429, show "Retry in 30s" with countdown. Add exponential backoff.',
  },
];

// ─── ROADMAP ─────────────────────────────────────────────────────────────────

const WEEKS = [
  {
    week: "Week 1 · Days 1–7",
    title: "Foundation — built today",
    status: "done" as const,
    pills: [
      { label: "Next.js + Gemini pipeline", color: "green" },
      { label: "SOAP + 3HM + BSC", color: "green" },
      { label: "Vercel Blob upload", color: "green" },
      { label: "Core UI components", color: "green" },
      { label: "Zod validation", color: "green" },
    ],
  },
  {
    week: "Week 2 · Days 8–14",
    title: "Auth, persistence & multi-user",
    status: "upcoming" as const,
    pills: [
      { label: "Clerk auth", color: "blue" },
      { label: "Neon Postgres", color: "blue" },
      { label: "Save + load packs", color: "blue" },
      { label: "User dashboard", color: "blue" },
      { label: "Team accounts", color: "blue" },
    ],
  },
  {
    week: "Week 3 · Days 15–21",
    title: "Editing, export & collaboration",
    status: "upcoming" as const,
    pills: [
      { label: "Inline field editing", color: "amber" },
      { label: "RAG status toggle", color: "amber" },
      { label: "Lead assignment", color: "amber" },
      { label: "PDF/PPTX export", color: "amber" },
      { label: "Share links", color: "amber" },
    ],
  },
  {
    week: "Week 4 · Days 22–30",
    title: "RAG pipeline, streaming & production",
    status: "upcoming" as const,
    pills: [
      { label: "RAG for large docs", color: "purple" },
      { label: "Streaming AI", color: "purple" },
      { label: "Error recovery", color: "purple" },
      { label: "Audit log", color: "purple" },
      { label: "E2E tests", color: "purple" },
      { label: "Mobile responsive", color: "purple" },
    ],
  },
];

// ─── STACK ────────────────────────────────────────────────────────────────────

const STACK = [
  {
    layer: "Framework",
    name: "Next.js 16",
    why: "SSR + API routes in one project. Zero-config on Vercel.",
  },
  {
    layer: "AI",
    name: "Gemini 2.5 Flash",
    why: "Free tier. 1M context. Native PDF via inlineData.",
  },
  {
    layer: "File storage",
    name: "Vercel Blob",
    why: "Bypasses 4.5MB body limit. No infra to manage.",
  },
  {
    layer: "Database ·30d",
    name: "Neon Postgres/Pgvector",
    why: "Serverless Postgres. Stores users, packs, sessions.",
  },
  {
    layer: " Auth ·30d",
    name: "Supabase Auth",
    why: "Serverless Auth. Stores users, packs, sessions.",
  },
  {
    layer: "RAG · 30d",
    name: "pgvector + Neon",
    why: "Vector search in same Postgres DB. No extra infra.",
  },
  {
    layer: "Export · 30d",
    name: "Claude",
    why: "More strong models and accurate result",
  },
  {
    layer: "Validation",
    name: "Zod",
    why: "Every AI response validated before touching the UI.",
  },
  {
    layer: "Deploy",
    name: "Vercel",
    why: "Blob, Postgres, and Edge all in one dashboard.",
  },
];

// ─── COMPARE ─────────────────────────────────────────────────────────────────

const DAY1 = [
  "Two-step AI pipeline",
  "SOAP + 3HM + BSC output",
  "PDF upload via Vercel Blob",
  "Zod validation on AI output",
  "Professional dark UI",
  "Deployed & live on Vercel",
];

const DAY1_MISSING = ["No auth", "No persistence", "No editing", "No export"];

const DAY30 = [
  "Everything from day 1",
  "Auth",
  "Save + load past packs",
  "Inline editing of all fields",
  "PDF + PPTX export",
  "Share links",
  "Streaming AI responses",
  "RAG for large doc corpora",
  "Mobile responsive",
];

// ─── SUB COMPONENTS ──────────────────────────────────────────────────────────

function EdgeCard({
  ec,
  index,
}: {
  ec: (typeof EDGE_CASES)[0];
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const { ref, inView } = useInView();
  const Icon = ec.icon;

  return (
    <div
      ref={ref}
      onClick={() => setFlipped((f) => !f)}
      className="cursor-pointer select-none"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
        perspective: "800px",
      }}
    >
      <div
        style={{
          position: "relative",
          height: "180px",
          transformStyle: "preserve-3d",
          transition: "transform 0.5s ease",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            background: "var(--navy-mid)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "4px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: ec.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={16} style={{ color: ec.color }} />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-primary)",
                lineHeight: 1.3,
              }}
            >
              {ec.title}
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              flex: 1,
            }}
          >
            {ec.desc}
          </p>
          <p
            style={{
              fontSize: 11,
              fontFamily: "var(--font-ibm-plex-mono)",
              color: "var(--muted-dim)",
            }}
          >
            Click to see the fix →
          </p>
        </div>

        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: ec.bg,
            border: `1px solid ${ec.color}44`,
            borderRadius: "4px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontFamily: "var(--font-ibm-plex-mono)",
              color: ec.color,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            The fix
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-primary)",
              lineHeight: 1.7,
            }}
          >
            {ec.fix}
          </p>
          <p
            style={{
              fontSize: 11,
              fontFamily: "var(--font-ibm-plex-mono)",
              color: "var(--muted-dim)",
            }}
          >
            ← Click to go back
          </p>
        </div>
      </div>
    </div>
  );
}

function WeekRow({ week, index }: { week: (typeof WEEKS)[0]; index: number }) {
  const { ref, inView } = useInView();
  const pillColors: Record<string, { bg: string; color: string }> = {
    green: { bg: "rgba(39,174,96,0.12)", color: "var(--rag-green)" },
    blue: { bg: "rgba(46,196,182,0.12)", color: "var(--teal)" },
    amber: { bg: "rgba(243,156,18,0.12)", color: "var(--rag-amber)" },
    purple: { bg: "rgba(139,156,175,0.12)", color: "var(--muted)" },
  };

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        gap: 24,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.5s ease ${index * 120}ms, transform 0.5s ease ${index * 120}ms`,
      }}
    >
      {/* Left — dot + line */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 4,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            flexShrink: 0,
            background:
              week.status === "done" ? "var(--rag-green)" : "var(--navy-mid)",
            border:
              week.status === "done"
                ? "2px solid var(--rag-green)"
                : "2px solid var(--border-mid)",
            boxShadow:
              week.status === "done" ? "0 0 8px rgba(39,174,96,0.4)" : "none",
            transition: "all 0.3s",
            position: "relative",
            zIndex: 1,
          }}
        >
          {week.status === "done" && (
            <Check
              size={8}
              style={{
                color: "white",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />
          )}
        </div>
        {index < WEEKS.length - 1 && (
          <div
            style={{
              width: 1,
              flex: 1,
              background: "var(--border-subtle)",
              marginTop: 4,
              minHeight: 32,
            }}
          />
        )}
      </div>

      {/* Right — content */}
      <div style={{ flex: 1, paddingBottom: 28 }}>
        <p
          style={{
            fontSize: 11,
            fontFamily: "var(--font-ibm-plex-mono)",
            color: "var(--muted-dim)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {week.week}
        </p>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-primary)",
            marginBottom: 10,
          }}
        >
          {week.title}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {week.pills.map((p, i) => {
            const c = pillColors[p.color];
            return (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: c.bg,
                  color: c.color,
                  fontWeight: 500,
                }}
              >
                {p.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StackCard({
  item,
  index,
}: {
  item: (typeof STACK)[0];
  index: number;
}) {
  const { ref, inView } = useInView();
  const is30d = item.layer.includes("30d");

  return (
    <div
      ref={ref}
      style={{
        border: `1px solid ${is30d ? "var(--border-mid)" : "var(--border-subtle)"}`,
        borderRadius: 4,
        padding: "12px 14px",
        background: is30d ? "var(--navy-mid)" : "transparent",
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateY(0) scale(1)"
          : "translateY(16px) scale(0.97)",
        transition: `opacity 0.45s ease ${index * 60}ms, transform 0.45s ease ${index * 60}ms`,
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontFamily: "var(--font-ibm-plex-mono)",
          color: is30d ? "var(--teal)" : "var(--muted-dim)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 5,
        }}
      >
        {item.layer}
      </p>
      <p
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text-primary)",
          marginBottom: 3,
        }}
      >
        {item.name}
      </p>
      <p
        style={{
          fontSize: 12,
          color: "var(--text-secondary)",
          lineHeight: 1.5,
        }}
      >
        {item.why}
      </p>
    </div>
  );
}

function CompareItem({
  text,
  done,
  delay,
}: {
  text: string;
  done: boolean;
  delay: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 0",
        borderBottom: "1px solid var(--border-subtle)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-12px)",
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: done ? "rgba(39,174,96,0.12)" : "rgba(139,156,175,0.1)",
        }}
      >
        {done ? (
          <Check size={10} style={{ color: "var(--rag-green)" }} />
        ) : (
          <span style={{ fontSize: 10, color: "var(--muted-dim)" }}>—</span>
        )}
      </div>
      <span
        style={{
          fontSize: 12,
          color: done ? "var(--text-primary)" : "var(--muted-dim)",
        }}
      >
        {text}
      </span>
    </div>
  );
}

// ─── TAB BUTTON ──────────────────────────────────────────────────────────────

function TabBtn({
  id,
  label,
  active,
  onClick,
}: {
  id: Tab;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "var(--font-ibm-plex-sans)",
        color: active ? "var(--text-primary)" : "var(--muted)",
        background: "none",
        border: "none",
        borderBottom: `2px solid ${active ? "var(--teal)" : "transparent"}`,
        cursor: "pointer",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  const [tab, setTab] = useState<Tab>("edge");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--navy)",
        color: "var(--text-primary)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "48px 48px 0",
          maxWidth: 1000,
          margin: "0 auto",
          animation: "fade-up 0.6s ease forwards",
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontFamily: "var(--font-ibm-plex-mono)",
            color: "var(--teal)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          STRATIFI Platform · Engineering Brief
        </p>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          Edge cases, 30-day roadmap
          <br />
          <span style={{ color: "var(--teal)" }}>& full production stack</span>
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--muted)",
            lineHeight: 1.7,
            maxWidth: 560,
          }}
        >
          What was built in one day, what breaks in the real world, and what a
          production-grade version looks like over 30 days.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          maxWidth: 1000,
          margin: "32px auto 0",
          padding: "0 48px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          gap: 0,
          overflowX: "auto",
        }}
      >
        <TabBtn
          id="edge"
          label="Edge cases"
          active={tab === "edge"}
          onClick={() => setTab("edge")}
        />
        <TabBtn
          id="roadmap"
          label="30-day roadmap"
          active={tab === "roadmap"}
          onClick={() => setTab("roadmap")}
        />
        <TabBtn
          id="stack"
          label="Full stack"
          active={tab === "stack"}
          onClick={() => setTab("stack")}
        />
        <TabBtn
          id="compare"
          label="1 day vs 30 days"
          active={tab === "compare"}
          onClick={() => setTab("compare")}
        />
      </div>

      {/* Content */}
      <div
        style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 48px 80px" }}
      >
        {/* EDGE CASES */}
        {tab === "edge" && (
          <div>
            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              Eight real failure modes — click any card to flip it and see the
              fix.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              {EDGE_CASES.map((ec, i) => (
                <EdgeCard key={i} ec={ec} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ROADMAP */}
        {tab === "roadmap" && (
          <div style={{ maxWidth: 640 }}>
            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                marginBottom: 32,
                lineHeight: 1.6,
              }}
            >
              What a 30-day sprint looks like — from the one-day MVP to a
              production-grade multi-tenant platform.
            </p>
            {WEEKS.map((w, i) => (
              <WeekRow key={i} week={w} index={i} />
            ))}
          </div>
        )}

        {/* STACK */}
        {tab === "stack" && (
          <div>
            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              Current stack plus what gets added in a 30-day build.{" "}
              <span
                style={{
                  color: "var(--teal)",
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: 12,
                }}
              >
                · 30d
              </span>{" "}
              items are additions.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 10,
              }}
            >
              {STACK.map((s, i) => (
                <StackCard key={i} item={s} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* COMPARE */}
        {tab === "compare" && (
          <div>
            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                marginBottom: 32,
                lineHeight: 1.6,
              }}
            >
              Honest scope comparison — what one day delivers vs what 30 days
              unlocks.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 24,
              }}
            >
              {/* Day 1 */}
              <div
                style={{
                  border: "1px solid var(--border-mid)",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    background: "var(--navy-mid)",
                    borderBottom: "1px solid var(--border-subtle)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--rag-green)",
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    1-day build · today
                  </span>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  {DAY1.map((t, i) => (
                    <CompareItem key={i} text={t} done={true} delay={i * 60} />
                  ))}
                  <div style={{ marginTop: 12 }}>
                    {DAY1_MISSING.map((t, i) => (
                      <CompareItem
                        key={i}
                        text={t}
                        done={false}
                        delay={i * 60 + 400}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Day 30 */}
              <div
                style={{
                  border: "1px solid var(--teal)",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 0 16px rgba(46,196,182,0.08)",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(46,196,182,0.08)",
                    borderBottom: "1px solid rgba(46,196,182,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--teal)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--teal)",
                    }}
                  >
                    30-day build
                  </span>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  {DAY30.map((t, i) => (
                    <CompareItem key={i} text={t} done={true} delay={i * 60} />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom note */}
            <div
              style={{
                marginTop: 32,
                padding: "16px 20px",
                borderRadius: 4,
                background: "rgba(46,196,182,0.06)",
                border: "1px solid rgba(46,196,182,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <ChevronRight
                size={14}
                style={{ color: "var(--teal)", flexShrink: 0 }}
              />
              <p
                style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}
              >
                The one-day build proves the core AI pipeline works end-to-end.
                The 30-day sprint turns it into a product consultants can
                actually use in the field.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
