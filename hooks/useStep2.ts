"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Step2OutputSchema } from "@/lib/schemas";
import type { Step1Output, Step2Output, Step2APIResponse } from "@/types";

type Step2Status = "idle" | "loading" | "success" | "error";

interface UseStep2Return {
  run: (step1Output: Step1Output) => Promise<Step2Output | null>;
  data: Step2Output | null;
  loading: boolean;
  error: string | null;
  status: Step2Status;
  reset: () => void;
}

export function useStep2(): UseStep2Return {
  const [data, setData] = useState<Step2Output | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Step2Status>("idle");

  const run = useCallback(
    async (step1Output: Step1Output): Promise<Step2Output | null> => {
      setLoading(true);
      setError(null);
      setStatus("loading");
      setData(null);

      try {
        const res = await fetch("/api/step2", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step1Output }),
        });

        const json: Step2APIResponse = await res.json();

        if (!res.ok || !json.success) {
          const msg = !json.success
            ? json.error
            : `Server error (${res.status})`;
          throw new Error(msg);
        }

        // Validate shape with Zod
        const parsed = Step2OutputSchema.safeParse(json.data);
        if (!parsed.success) {
          console.error(
            "[useStep2] Zod validation failed:",
            parsed.error.flatten(),
          );
          throw new Error(
            "AI returned an unexpected response structure. Please try again.",
          );
        }

        setData(parsed.data);
        setStatus("success");
        toast.success("Balanced Scorecard generated successfully");
        return parsed.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        setStatus("error");
        toast.error(`Step 2 failed: ${message}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus("idle");
    setLoading(false);
  }, []);

  return { run, data, loading, error, status, reset };
}
