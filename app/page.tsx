"use client";

import { useStrategypack } from "@/hooks";
import { UploadPanel } from "@/components/upload";
import { SOAPSection } from "@/components/soap";
import { THMSection } from "@/components/thm";
import { BSCSection } from "@/components/bsc";
import { SOAPSkeleton, THMSkeleton, BSCSkeleton } from "@/components/ui";
import { SectionDivider } from "@/components/ui/SectionDivider";

export default function Home() {
  const {
    appStatus,
    companyFile,
    strategyFile,
    companyError,
    strategyError,
    setCompanyFile,
    setStrategyFile,
    clearCompanyFile,
    clearStrategyFile,
    generateStep1,
    generateStep2,
    soap,
    thm,
    bsc,
    step1Loading,
    step2Loading,
  } = useStrategypack();

  const showFrameworks =
    appStatus === "step1_loading" ||
    appStatus === "step1_complete" ||
    appStatus === "step2_loading" ||
    appStatus === "complete";

  const showBSC =
    appStatus === "step1_complete" ||
    appStatus === "step2_loading" ||
    appStatus === "complete";

  return (
    <div
      style={{ background: "var(--navy)" }}
      className="min-h-screen  text-white"
    >
      <main className="w-full max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* ─── Upload Section (idle, files_ready) ─────────────────────────── */}
        {(appStatus === "idle" || appStatus === "files_ready") && (
          <UploadPanel
            companyFile={companyFile}
            strategyFile={strategyFile}
            companyError={companyError}
            strategyError={strategyError}
            onCompanyFile={setCompanyFile}
            onStrategyFile={setStrategyFile}
            onClearCompany={clearCompanyFile}
            onClearStrategy={clearStrategyFile}
            onGenerate={generateStep1}
            loading={step1Loading}
          />
        )}

        {/* ─── SOAP Section ─────────────────────────────────────────────────── */}
        {showFrameworks && (
          <>
            {step1Loading ? (
              <SOAPSkeleton />
            ) : soap ? (
              <SOAPSection data={soap} loading={step1Loading} />
            ) : null}
          </>
        )}

        {/* ─── Divider between SOAP and 3HM ────────────────────────────────── */}
        {showFrameworks && (soap || step1Loading) && <SectionDivider />}

        {/* ─── 3HM Section ──────────────────────────────────────────────────── */}
        {showFrameworks && (
          <>
            {step1Loading ? (
              <THMSkeleton />
            ) : thm ? (
              <THMSection data={thm} loading={step1Loading} />
            ) : null}
          </>
        )}

        {/* ─── Divider between 3HM and BSC ─────────────────────────────────── */}
        {showBSC && (thm || step1Loading) && <SectionDivider />}

        {/* ─── BSC Section ──────────────────────────────────────────────────── */}
        {showBSC && (
          <BSCSection
            data={bsc}
            onGenerate={generateStep2}
            loading={step2Loading}
          />
        )}
      </main>
    </div>
  );
}
