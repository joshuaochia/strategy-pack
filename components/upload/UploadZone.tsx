"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import type { UploadedFile } from "@/types";

interface UploadZoneProps {
  label: string;
  description: string;
  file: UploadedFile | null;
  error?: string | null;
  disabled?: boolean;
  onFile: (file: File) => void;
  onClear: () => void;
}

export function UploadZone({
  label,
  description,
  file,
  error,
  disabled,
  onFile,
  onClear,
}: UploadZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      maxSize: 20 * 1024 * 1024, // 20MB
      disabled: disabled || !!file,
    });

  const hasError = !!error || isDragReject;

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-mono font-medium tracking-widest uppercase"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </span>
        {file && (
          <span
            className="flex items-center gap-1 text-xs font-mono"
            style={{ color: "var(--rag-green)" }}
          >
            <CheckCircle2 size={10} />
            Ready
          </span>
        )}
        {hasError && (
          <span
            className="flex items-center gap-1 text-xs font-mono"
            style={{ color: "var(--rag-red)" }}
          >
            <AlertCircle size={10} />
            Error
          </span>
        )}
      </div>

      {/* Drop area */}
      {!file ? (
        <div
          {...getRootProps()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 rounded-sm border-2 border-dashed px-6 py-10 transition-all duration-200 cursor-pointer select-none",
            isDragActive &&
              !isDragReject &&
              "border-[var(--teal)] bg-[rgba(46,196,182,0.06)] glow-teal",
            isDragReject && "border-[var(--rag-red)] bg-[rgba(231,76,60,0.06)]",
            hasError && !isDragReject && "border-[var(--rag-red)]",
            !isDragActive &&
              !hasError &&
              "border-[var(--border-mid)] hover:border-[var(--border-strong)] hover:bg-[var(--navy-mid)]",
            disabled && "opacity-40 cursor-not-allowed pointer-events-none",
          )}
          style={{
            background:
              isDragActive && !isDragReject ? undefined : "var(--navy-mid)",
          }}
        >
          <input {...getInputProps()} />

          {/* Icon */}
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-sm transition-colors duration-200",
              isDragActive && !isDragReject
                ? "bg-[rgba(46,196,182,0.15)] text-[var(--teal)]"
                : "bg-[var(--navy-light)] text-[var(--muted)]",
            )}
          >
            <UploadCloud size={22} />
          </div>

          {/* Text */}
          <div className="text-center space-y-1">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {isDragActive && !isDragReject
                ? "Drop to upload"
                : "Drag & drop or click to browse"}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {isDragReject ? "PDF files only" : description}
            </p>
            <p
              className="text-xs font-mono"
              style={{ color: "var(--muted-dim)" }}
            >
              PDF · Max 20MB
            </p>
          </div>
        </div>
      ) : (
        /* File card */
        <div
          className="flex items-center gap-4 rounded-sm px-4 py-3.5 animate-fade-up"
          style={{
            background: "var(--navy-mid)",
            border: "1px solid var(--teal)",
            boxShadow: "0 0 0 1px var(--teal), 0 0 12px rgba(46,196,182,0.1)",
          }}
        >
          {/* File icon */}
          <div
            className="flex items-center justify-center w-10 h-10 rounded-sm shrink-0"
            style={{ background: "rgba(46,196,182,0.1)" }}
          >
            <FileText size={18} style={{ color: "var(--teal)" }} />
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-medium truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {file.name}
            </p>
            <p
              className="text-xs font-mono mt-0.5"
              style={{ color: "var(--muted)" }}
            >
              {formatFileSize(file.sizeKB * 1024)}
            </p>
          </div>

          {/* Clear */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="flex items-center justify-center w-7 h-7 rounded-sm transition-colors duration-150 hover:bg-[var(--navy-light)] shrink-0 cursor-pointer"
            style={{ color: "var(--muted)" }}
            title="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs font-mono" style={{ color: "var(--rag-red)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
