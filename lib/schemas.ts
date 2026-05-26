import { z } from "zod";

// ─── SOAP ────────────────────────────────────────────────────────────────────

export const SOAPGoalSchema = z.object({
  id: z.number().int().min(1).max(3),
  title: z.string().min(1),
  objectives: z.array(z.string().min(1)).min(2).max(4),
});

export const SOAPSchema = z.object({
  vision: z.string().min(1),
  mission: z.string().min(1),
  goals: z.array(SOAPGoalSchema).min(2).max(3),
  leadershipValues: z.array(z.string().min(1)).min(2).max(4),
});

// ─── 3HM ─────────────────────────────────────────────────────────────────────

export const HorizonDataSchema = z.object({
  id: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  label: z.string().min(1),
  timeframe: z.string().min(1),
  objectives: z.array(z.string().min(1)).min(2).max(4),
});

export const THMSchema = z.object({
  h1: HorizonDataSchema,
  h2: HorizonDataSchema,
  h3: HorizonDataSchema,
});

// ─── STEP 1 OUTPUT ───────────────────────────────────────────────────────────

export const Step1OutputSchema = z.object({
  soap: SOAPSchema,
  thm: THMSchema,
});

// ─── BSC ─────────────────────────────────────────────────────────────────────

export const RAGStatusSchema = z.union([
  z.literal("R"),
  z.literal("A"),
  z.literal("G"),
  z.null(),
]);

export const BSCRowSchema = z.object({
  id: z.string().min(1),
  objective: z.string().min(1),
  smartActions: z.array(z.string().min(1)).min(1).max(4),
  ragStatus: RAGStatusSchema,
  lead: z.string().nullable(),
});

export const BSCPerspectiveKeySchema = z.enum([
  "financial",
  "customers",
  "systems",
  "learning",
]);

export const BSCPerspectiveSchema = z.object({
  key: BSCPerspectiveKeySchema,
  rows: z.array(BSCRowSchema).min(1).max(4),
});

export const BSCSchema = z.object({
  perspectives: z
    .array(BSCPerspectiveSchema)
    .length(4)
    .refine(
      (perspectives) => {
        const keys = perspectives.map((p) => p.key);
        const required = ["financial", "customers", "systems", "learning"];
        return required.every((k) => keys.includes(k as never));
      },
      { message: "BSC must include all four perspectives" },
    ),
});

// ─── STEP 2 OUTPUT ───────────────────────────────────────────────────────────

export const Step2OutputSchema = z.object({
  bsc: BSCSchema,
});

// ─── INFERRED TYPES (match types/strategy.ts) ────────────────────────────────

export type SOAPGoalParsed = z.infer<typeof SOAPGoalSchema>;
export type SOAPParsed = z.infer<typeof SOAPSchema>;
export type THMParsed = z.infer<typeof THMSchema>;
export type Step1OutputParsed = z.infer<typeof Step1OutputSchema>;
export type BSCRowParsed = z.infer<typeof BSCRowSchema>;
export type BSCPerspectiveParsed = z.infer<typeof BSCPerspectiveSchema>;
export type BSCParsed = z.infer<typeof BSCSchema>;
export type Step2OutputParsed = z.infer<typeof Step2OutputSchema>;
