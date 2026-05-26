"use client";

import { Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StepBadge } from "@/components/ui/StepBadge";
import { UploadZone } from "./UploadZone";
import type { UploadedFile } from "@/types";

interface UploadPanelProps {
  companyFile: UploadedFile | null;
  strategyFile: UploadedFile | null;
  companyError?: string | null;
  strategyError?: string | null;
  companyUploading: boolean;
  strategyUploading: boolean;
  loading: boolean;
  onCompanyFile: (file: File) => void;
  onStrategyFile: (file: File) => void;
  onClearCompany: () => void;
  onClearStrategy: () => void;
  onGenerate: () => void;
}

export function UploadPanel({
  companyFile,
  strategyFile,
  companyError,
  strategyError,
  companyUploading,
  strategyUploading,
  loading,
  onCompanyFile,
  onStrategyFile,
  onClearCompany,
  onClearStrategy,
  onGenerate,
}: UploadPanelProps) {
  const bothReady = !!companyFile && !!strategyFile;
  const uploading = companyUploading || strategyUploading;

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ border: "1px solid var(--border-mid)" }}
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-8 py-5"
        style={{
          background: "var(--navy-mid)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-sm"
            style={{ background: "rgba(46,196,182,0.1)" }}
          >
            <ShieldCheck size={16} style={{ color: "var(--teal)" }} />
          </div>
          <div>
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Document Upload
            </h3>
            <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>
              Two source documents required
            </p>
          </div>
        </div>

        <StepBadge
          step={1}
          status={
            loading || uploading ? "active" : bothReady ? "done" : "pending"
          }
          label="SOAP + 3HM"
        />
      </div>

      {/* Upload zones */}
      <div
        className="grid grid-cols-2 gap-6 p-8"
        style={{ background: "var(--navy)" }}
      >
        <UploadZone
          label="Company Overview"
          description="Background, operations & strategic context"
          file={companyFile}
          error={companyError}
          disabled={loading}
          uploading={companyUploading}
          onFile={onCompanyFile}
          onClear={onClearCompany}
        />
        <UploadZone
          label="Strategy Reference"
          description="Government or industry-level strategy document"
          file={strategyFile}
          error={strategyError}
          disabled={loading}
          uploading={strategyUploading}
          onFile={onStrategyFile}
          onClear={onClearStrategy}
        />
      </div>

      {/* Footer / CTA */}
      <div
        className="flex items-center justify-between px-8 py-5"
        style={{
          background: "var(--navy-mid)",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        {/* Status text */}
        <div className="flex items-center gap-2">
          {uploading && (
            <p
              className="text-xs font-mono animate-pulse"
              style={{ color: "var(--teal)" }}
            >
              Uploading document
              {companyUploading && strategyUploading ? "s" : ""}…
            </p>
          )}
          {!uploading && !bothReady && !loading && (
            <p
              className="text-xs font-mono"
              style={{ color: "var(--muted-dim)" }}
            >
              {!companyFile && !strategyFile
                ? "Upload both documents to continue"
                : !companyFile
                  ? "Upload company overview to continue"
                  : "Upload strategy reference to continue"}
            </p>
          )}
          {!uploading && bothReady && !loading && (
            <p className="text-xs font-mono" style={{ color: "var(--teal)" }}>
              Both documents ready — generate the strategy pack
            </p>
          )}
          {loading && (
            <div className="space-y-1">
              <p
                className="text-xs font-mono animate-pulse"
                style={{ color: "var(--teal)" }}
              >
                Analysing documents and generating SOAP + 3HM…
              </p>
              <p
                className="text-xs font-mono"
                style={{ color: "var(--muted)" }}
              >
                Please do not close, refresh or navigate away until generation
                completes.
              </p>
            </div>
          )}
        </div>

        {/* Generate button */}
        <Button
          variant="primary"
          size="lg"
          loading={loading || uploading}
          disabled={!bothReady || uploading}
          onClick={onGenerate}
          className="gap-2"
        >
          <Zap size={15} />
          Generate Strategy Pack
        </Button>
      </div>
    </div>
  );
}
