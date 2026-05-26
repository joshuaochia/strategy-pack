"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Step1OutputSchema } from "@/lib/schemas";
import { safeParseJSON } from "@/lib/utils";
import type { Step1Output, Step1APIResponse } from "@/types";

type Step1Status = "idle" | "loading" | "success" | "error";

interface UseStep1Return {
  run: (
    companyBase64: string,
    strategyBase64: string,
  ) => Promise<Step1Output | null>;
  data: Step1Output | null;
  loading: boolean;
  error: string | null;
  status: Step1Status;
  reset: () => void;
}

export function useStep1(): UseStep1Return {
  const [data, setData] = useState<Step1Output | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Step1Status>("idle");

  const run = useCallback(async (companyUrl: string, strategyUrl: string) => {
    setLoading(true);
    setError(null);
    setStatus("loading");
    setData(null);

    try {
      const res = await fetch("/api/step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyDocUrl: companyUrl,
          strategyDocUrl: strategyUrl,
        }),
      });

      const json: Step1APIResponse = await res.json();

      if (!res.ok || !json.success) {
        const msg = !json.success ? json.error : `Server error (${res.status})`;
        throw new Error(msg);
      }

      // Validate shape with Zod
      const parsed = Step1OutputSchema.safeParse(json.data);
      if (!parsed.success) {
        console.error(
          "[useStep1] Zod validation failed:",
          parsed.error.flatten(),
        );
        throw new Error(
          "AI returned an unexpected response structure. Please try again.",
        );
      }

      setData(parsed.data);
      setStatus("success");
      toast.success("SOAP & 3HM generated successfully");
      return parsed.data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
      setStatus("error");
      toast.error(`Step 1 failed: ${message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus("idle");
    setLoading(false);
  }, []);

  return { run, data, loading, error, status, reset };
}
