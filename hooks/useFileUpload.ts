"use client";

import { useState, useCallback } from "react";
import { fileToBase64, formatFileSize } from "@/lib/utils";
import type { UploadedFile } from "@/types";
import { upload } from "@vercel/blob/client";

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

interface FileUploadState {
  companyFile: UploadedFile | null;
  strategyFile: UploadedFile | null;
  companyError: string | null;
  strategyError: string | null;
  companyUploading: boolean;
  strategyUploading: boolean;
  uploading: boolean;
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
  try {
    const newBlob = await upload(file.name, file, {
      access: "private", // Or 'public' depending on your needs
      handleUploadUrl: "/api/upload", // This is your new API route
    });

    return {
      file,
      base64: "",
      url: newBlob.url, // The URL of the uploaded blob
      name: file.name,
      sizeKB: Math.round(file.size / 1024),
    };
  } catch (error) {
    console.error("Error during client-side upload:", error);
    throw new Error("Failed to upload file directly to Vercel Blob.");
  }
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
  const [companyUploading, setCompanyUploading] = useState(false);
  const [strategyUploading, setStrategyUploading] = useState(false);

  const setCompanyFile = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setCompanyError(error);
      setCompanyFileState(null);
      return;
    }

    setCompanyError(null);
    setCompanyUploading(true);

    try {
      const processed = await processFile(file);
      setCompanyFileState(processed);
    } catch (err) {
      setCompanyFileState(null);
      setCompanyError(
        err instanceof Error
          ? err.message
          : "Failed to upload company document",
      );
    } finally {
      setCompanyUploading(false);
    }
  }, []);

  const setStrategyFile = useCallback(async (file: File) => {
    const error = validateFile(file);
    if (error) {
      setStrategyError(error);
      setStrategyFileState(null);
      return;
    }

    setStrategyError(null);
    setStrategyUploading(true);

    try {
      const processed = await processFile(file);
      setStrategyFileState(processed);
    } catch (err) {
      setStrategyFileState(null);
      setStrategyError(
        err instanceof Error
          ? err.message
          : "Failed to upload strategy document",
      );
    } finally {
      setStrategyUploading(false);
    }
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
    companyUploading,
    strategyUploading,
    uploading: companyUploading || strategyUploading,
    bothReady: !!companyFile && !!strategyFile,
    setCompanyFile,
    setStrategyFile,
    clearCompanyFile,
    clearStrategyFile,
    clearAll,
  };
}
