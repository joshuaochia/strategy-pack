# StratiFi Project: Gemini AI Integration

This document describes the current StratiFi app flow after the Vercel Blob upload change. The app accepts two PDFs, uploads them to blob storage, and generates a Strategy Pack in two AI steps: SOAP + 3HM, then BSC.

## 1. Project Overview

StratiFi accepts two PDF source files:
- a company overview document
- a strategy reference document

The app uploads both PDFs to Vercel Blob storage first, then uses the returned blob URLs for Step 1. The AI is the engine behind the strategy output, and the results are rendered in the browser.

## 2. Upload + AI Pipeline

### 2.1. Upload flow

- Users upload PDFs using `UploadZone` components.
- `useFileUpload()` validates file type and size, then uploads files through `@vercel/blob/client`.
- The upload endpoint is `/api/upload`, which delegates to `handleUpload()`.
- The route is configured to accept PDFs and uses `addRandomSuffix: true` to avoid filename collisions.
- Each uploaded file stores a private blob URL that later feeds Step 1.

### 2.2. Step 1: Generate SOAP + 3HM

- When the user clicks Generate, `useStep1()` sends `companyDocUrl` and `strategyDocUrl` to `/api/step1`.
- The server fetches both PDFs from private blob storage using the blob access token.
- The PDFs are converted to base64 inside the server route.
- Gemini is called with `inlineData` payloads for both documents.
- The response is parsed and validated with Zod, then rendered as SOAP + 3HM.

### 2.3. Step 2: Generate BSC

- After Step 1 completes, the app uses the generated SOAP + 3HM data as input for `/api/step2`.
- Gemini returns Balanced Scorecard output.
- The response is validated and rendered in the BSC section.

## 3. Current Implementation Notes

### Upload handling

- `app/api/upload/route.ts`
  - uses `handleUpload()` from `@vercel/blob/client`
  - allows `application/pdf`
  - enables `addRandomSuffix: true`
  - logs completed blob uploads in `onUploadCompleted`

- `hooks/useFileUpload.ts`
  - uploads directly from the browser via `upload()` instead of building local base64 payloads
  - tracks `companyUploading`, `strategyUploading`, and `uploading`
  - stores the returned `url` for each blob upload

### Step 1 server flow

- `app/api/step1/route.ts`
  - receives blob URLs from the client
  - validates both `companyDocUrl` and `strategyDocUrl`
  - fetches the private PDFs server-side using `process.env.BLOB_READ_WRITE_TOKEN`
  - converts each PDF to base64 for the Gemini request
  - validates the Gemini output with `Step1OutputSchema`

## 4. Key Packages

- `@google/generative-ai`
  - Gemini model calls from the server
- `@vercel/blob`
  - browser upload helper and server-side upload route
- `react-dropzone`
  - drag-and-drop upload UI
- `sonner`
  - toast notifications for upload and AI errors
- `zod`
  - response validation for AI outputs

## 5. Generated Frameworks

### Strategy On A Page (SOAP)

| Field      | Purpose                                                         |
| :--------- | :-------------------------------------------------------------- |
| Vision     | The desired future state of the organisation                    |
| Mission    | The core purpose and what the organisation exists to do         |
| Goals      | Major outcomes the organisation wants to achieve                |
| Objectives | Specific, actionable statements that break down the goals       |

### 3-Horizon Model (3HM)

| Field          | Purpose                                           |
| :------------- | :------------------------------------------------ |
| 12-Month Goals | Short-term priorities for the next year           |
| 24-Month Goals | Mid-term priorities for the following two years   |
| 36-Month Goals | Longer-term priorities for the three-year horizon |

### Balanced Scorecard (BSC)

- Four perspectives: Financial, Customers & Partners, Systems & Processes, Learning & Growth
- Each row includes Objective, SMART Actions, RAG status placeholder, and Lead placeholder
- RAG + Lead are intentionally left blank for user completion

## 6. App Architecture

### File structure highlights

- `app/page.tsx` — orchestrates upload, Step 1, and Step 2
- `app/api/upload/route.ts` — Vercel Blob upload token route
- `app/api/step1/route.ts` — PDF fetch + Gemini SOAP/3HM generation
- `app/api/step2/route.ts` — BSC generation from Step 1 output
- `components/upload/UploadPanel.tsx` — upload UI + generate CTA
- `components/upload/UploadZone.tsx` — single PDF dropzone
- `hooks/useFileUpload.ts` — upload state + blob URL management
- `hooks/useStep1.ts` — call Step 1 API and parse output
- `hooks/useStep2.ts` — call Step 2 API and parse output
- `hooks/useStrategyPack.ts` — application state orchestration

## 7. User experience

- Upload panel remains visible while files upload and while Step 1 is generating
- Step 1 now shows a clear loading indicator that instructs users not to close or refresh
- The generate button is disabled until both files are uploaded and ready

## 8. Notes

- The current implementation relies on private blob access using a server-side token.
- The upload route is the first line of defense for file type validation and duplicate upload handling.
- Step 1 is the point where AI output is parsed and validated before rendering.
