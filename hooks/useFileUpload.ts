"use client";

import { useState, useCallback } from "react";
import { fileToBase64, formatFileSize } from "@/lib/utils";
import type { UploadedFile } from "@/types";

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

interface FileUploadState {
  companyFile: UploadedFile | null;
  strategyFile: UploadedFile | null;
  companyError: string | null;
  strategyError: string | null;
  bothReady: boolean;
}

interface UseFileUploadReturn extends FileUploadState {
  setCompanyFile: (file: File) => Promise<void>;
  setStrategyFile: (file: File) => Promise<void>;
  clearCompanyFile: () => void;
  clearStrategyFile: () => void;
  clearAll: () => void;
}

async function processFile(file: File): Promise<UploadedFile> {
  const base64 = await fileToBase64(file);
  return {
    file,
    base64,
    name: file.name,
    sizeKB: Math.round(file.size / 1024),
  };
}

function validateFile(file: File): string | null {
  if (file.type !== "application/pdf") {
    return "Only PDF files are accepted";
  }
  if (file.size > MAX_SIZE_BYTES) {
    return `File exceeds 20MB limit (${formatFileSize(file.size)})`;
  }
  return null;
}

export function useFileUpload(): UseFileUploadReturn {
  const [companyFile, setCompanyFileState] = useState<UploadedFile | null>(
    null,
  );
  const [strategyFile, setStrategyFileState] = useState<UploadedFile | null>(
    null,
  );
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [strategyError, setStrategyError] = useState<string | null>(null);

  const setCompanyFile = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setCompanyError(error);
      setCompanyFileState(null);
      return;
    }
    setCompanyError(null);
    const processed = await processFile(file);
    setCompanyFileState(processed);
  }, []);

  const setStrategyFile = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setStrategyError(error);
      setStrategyFileState(null);
      return;
    }
    setStrategyError(null);
    const processed = await processFile(file);
    setStrategyFileState(processed);
  }, []);

  const clearCompanyFile = useCallback(() => {
    setCompanyFileState(null);
    setCompanyError(null);
  }, []);

  const clearStrategyFile = useCallback(() => {
    setStrategyFileState(null);
    setStrategyError(null);
  }, []);

  const clearAll = useCallback(() => {
    setCompanyFileState(null);
    setStrategyFileState(null);
    setCompanyError(null);
    setStrategyError(null);
  }, []);

  return {
    companyFile,
    strategyFile,
    companyError,
    strategyError,
    bothReady: !!companyFile && !!strategyFile,
    setCompanyFile,
    setStrategyFile,
    clearCompanyFile,
    clearStrategyFile,
    clearAll,
  };
}
