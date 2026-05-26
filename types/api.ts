import type { Step1Output, Step2Output } from "./strategy";

// ─── STEP 1 ──────────────────────────────────────────────────────────────────

// now:
export interface Step1Request {
  companyDocUrl: string;
  strategyDocUrl: string;
}

export interface Step1Response {
  success: true;
  data: Step1Output;
}

// ─── STEP 2 ──────────────────────────────────────────────────────────────────

export interface Step2Request {
  step1Output: Step1Output;
}

export interface Step2Response {
  success: true;
  data: Step2Output;
}

// ─── ERROR ───────────────────────────────────────────────────────────────────

export interface APIErrorResponse {
  success: false;
  error: string;
}

export type Step1APIResponse = Step1Response | APIErrorResponse;
export type Step2APIResponse = Step2Response | APIErrorResponse;
