// ─── SOAP ────────────────────────────────────────────────────────────────────

export interface SOAPGoal {
  id: number;
  title: string;
  objectives: string[];
}

export interface SOAPData {
  vision: string;
  mission: string;
  goals: SOAPGoal[];
  leadershipValues: string[];
}

// ─── 3HM ─────────────────────────────────────────────────────────────────────

export interface HorizonData {
  id: 1 | 2 | 3;
  label: string; // e.g. "Operationalise & Stabilise"
  timeframe: string; // e.g. "Next 12 months"
  objectives: string[];
}

export interface THMData {
  h1: HorizonData;
  h2: HorizonData;
  h3: HorizonData;
}

// ─── BSC ─────────────────────────────────────────────────────────────────────

export type RAGStatus = "R" | "A" | "G" | null;

export type BSCPerspectiveKey =
  | "financial"
  | "customers"
  | "systems"
  | "learning";

export const BSC_PERSPECTIVE_LABELS: Record<BSCPerspectiveKey, string> = {
  financial: "Financials",
  customers: "Customers & Partners",
  systems: "Systems & Processes",
  learning: "Learning & Growth",
};

export interface BSCRow {
  id: string;
  objective: string;
  smartActions: string[];
  ragStatus: RAGStatus;
  lead: string | null;
}

export interface BSCPerspective {
  key: BSCPerspectiveKey;
  rows: BSCRow[]; // max 4
}

export interface BSCData {
  perspectives: BSCPerspective[];
}

// ─── STEP 1 OUTPUT ───────────────────────────────────────────────────────────

export interface Step1Output {
  soap: SOAPData;
  thm: THMData;
}

// ─── STEP 2 OUTPUT ───────────────────────────────────────────────────────────

export interface Step2Output {
  bsc: BSCData;
}

// ─── FULL STRATEGY PACK ──────────────────────────────────────────────────────

export interface StrategyPack extends Step1Output, Step2Output {}

// ─── APP STATE ───────────────────────────────────────────────────────────────

export type AppStatus =
  | "idle"
  | "uploading"
  | "files_ready"
  | "step1_loading"
  | "step1_complete"
  | "step2_loading"
  | "complete"
  | "error";

export interface UploadedFile {
  file: File;
  base64: string;
  name: string;
  sizeKB: number;
  url: string;
}
