"use client";

import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useFileUpload } from "./useFileUpload";
import { useStep1 } from "./useStep1";
import { useStep2 } from "./useStep2";
import type { AppStatus } from "@/types";

export function useStrategyPack() {
  const upload = useFileUpload();
  const step1 = useStep1();
  const step2 = useStep2();

  // ─── Derived app status ───────────────────────────────────────────────────

  const appStatus = useMemo<AppStatus>(() => {
    if (step2.status === "success") return "complete";
    if (step2.status === "loading") return "step2_loading";
    if (step1.status === "success") return "step1_complete";
    if (step1.status === "loading") return "step1_loading";
    if (upload.uploading) return "uploading";
    if (upload.bothReady) return "files_ready";
    if (step1.status === "error" || step2.status === "error") return "error";
    return "idle";
  }, [step1.status, step2.status, upload.bothReady, upload.uploading]);

  // ─── Step 1 trigger ───────────────────────────────────────────────────────

  const generateStep1 = useCallback(async () => {
    if (!upload.companyFile || !upload.strategyFile) {
      toast.error("Please upload both documents before generating");
      return;
    }

    if (upload.uploading) {
      toast.error("Please wait until both files finish uploading");
      return;
    }

    await step1.run(upload.companyFile.url, upload.strategyFile.url);
  }, [upload.companyFile, upload.strategyFile, upload.uploading, step1]);

  // ─── Step 2 trigger ───────────────────────────────────────────────────────

  const generateStep2 = useCallback(async () => {
    if (!step1.data) {
      toast.error("Step 1 must complete before generating the BSC");
      return;
    }

    await step2.run(step1.data);
  }, [step1.data, step2]);

  // ─── Full reset ───────────────────────────────────────────────────────────

  const resetAll = useCallback(() => {
    upload.clearAll();
    step1.reset();
    step2.reset();
  }, [upload, step1, step2]);

  return {
    // Upload state
    companyFile: upload.companyFile,
    strategyFile: upload.strategyFile,
    companyError: upload.companyError,
    strategyError: upload.strategyError,
    companyUploading: upload.companyUploading,
    strategyUploading: upload.strategyUploading,
    uploading: upload.uploading,
    setCompanyFile: upload.setCompanyFile,
    setStrategyFile: upload.setStrategyFile,
    clearCompanyFile: upload.clearCompanyFile,
    clearStrategyFile: upload.clearStrategyFile,

    // Step 1
    soap: step1.data?.soap ?? null,
    thm: step1.data?.thm ?? null,
    step1Loading: step1.loading,
    step1Error: step1.error,

    // Step 2
    bsc: step2.data?.bsc ?? null,
    step2Loading: step2.loading,
    step2Error: step2.error,

    // Actions
    generateStep1,
    generateStep2,
    resetAll,

    // Derived
    appStatus,
  };
}
