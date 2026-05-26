# StratiFi Project: Claude AI Integration

This document outlines the integration and usage of Claude AI within the StratiFi project, a single-page web application designed to generate a comprehensive Strategy Pack from two uploaded PDF documents. The project leverages a two-step AI pipeline to produce Strategy-On-A-Page (SOAP), 3-Horizon Model (3HM), and Balanced Scorecard (BSC) frameworks.

## 1. Project Overview

The StratiFi application processes a company overview document and a strategy reference document (both in PDF format) to generate a Strategy Pack. The AI is the sole source of information for generating this pack. The output is displayed directly on the website and is not downloaded or exported.

## 2. Claude AI Integration

Claude AI is a core component of the StratiFi project, specifically utilized for generating the strategic frameworks. The integration is managed through the official `@anthropic-ai/sdk` [1], which handles streaming, base64 document encoding, and typed responses. The AI processing is divided into two distinct steps, each exposed via a Next.js API route.

### 2.1. AI Pipeline (Data Flow)

The application follows a two-step AI pipeline:

1.  **Step 1: Generate SOAP + 3HM**
    - **Input**: The user uploads two PDF documents (company overview and strategy reference). These are converted to base64 format using the `useFileUpload()` hook.
    - **Process**: The base64 encoded PDFs are posted to the `/api/step1` endpoint. Claude AI processes these documents to generate the SOAP and 3HM frameworks.
    - **Output**: The `useStep1()` hook fetches and validates the JSON response using Zod schemas, storing the SOAP and 3HM output in the application state. The generated content is then rendered on the UI.

2.  **Step 2: Generate BSC**
    - **Input**: The output from Step 1 (SOAP and 3HM data) is used as input for this step. Raw files are not used again.
    - **Process**: This data is posted to the `/api/step2` endpoint. Claude AI generates the Balanced Scorecard (BSC) based on the previously generated frameworks.
    - **Output**: The `useStep2()` hook retrieves and validates the BSC data. The BSC framework is then rendered, completing the Strategy Pack.

### 2.2. Key AI-related Packages and Utilities

- **`@anthropic-ai/sdk`**: The official SDK for interacting with Claude AI from Next.js API routes. It supports streaming, base64 documents, and typed responses.
- **`prompts.ts`**: This file (`lib/prompts.ts`) centralizes all system and user prompts used for interacting with Claude AI, ensuring consistency and ease of management.
- **`schemas.ts`**: Zod schemas (`lib/schemas.ts`) are used to validate the JSON output from each AI step, ensuring data integrity and graceful handling of malformed responses.
- **`anthropic.ts`**: Contains the SDK client singleton (`lib/anthropic.ts`) for Claude AI.

## 3. Framework Outputs and Evaluation

The AI generates content for three frameworks:

### 3.1. Strategy On A Page (SOAP)

| Field      | Purpose                                                         | Output       |
| :--------- | :-------------------------------------------------------------- | :----------- |
| Vision     | The desired future state of the organisation                    | AI Generated |
| Mission    | The core purpose and what the organisation exists to do         | AI Generated |
| Goals      | Major outcomes the organisation wants to achieve (2-3)          | AI Generated |
| Objectives | Specific, actionable statements that break down the goals (3-4) | AI Generated |

### 3.2. 3-Horizon Model (3HM)

| Field          | Purpose                                           | Output       |
| :------------- | :------------------------------------------------ | :----------- |
| 12-Month Goals | Short-term priorities for the next year           | AI Generated |
| 24-Month Goals | Mid-term priorities for the following two years   | AI Generated |
| 36-Month Goals | Longer-term priorities for the three-year horizon | AI Generated |

### 3.3. Balanced Scorecard (BSC)

The BSC covers four perspectives: Financial, Customers & Partners, Systems & Processes, and Learning & Growth. The AI generates a maximum of four rows per perspective.

| Field                                        | Purpose                                                                       | Output       |
| :------------------------------------------- | :---------------------------------------------------------------------------- | :----------- |
| Objective                                    | The strategic outcome being pursued                                           | AI Generated |
| Performance Measure & Target (SMART Actions) | The metric used to track progress and desired level or result for the measure | AI Generated |
| RAG Status                                   | Red-Amber-Green progress indicator                                            | Leave Blank  |
| Lead                                         | The person responsible for execution                                          | Leave Blank  |

_Note: RAG Status and Lead fields are left blank for the user to complete, requiring human judgment and organizational knowledge._ [2]

## 4. AI Tool Usage and Evaluation Criteria

The project encourages the use of AI coding assistants like Claude, Cursor, Copilot, or similar. The evaluation of the project will consider:

- **Output Quality**: The AI output must be meaningful, structured, and specific to the company provided. The BSC generated in Step 2 must genuinely reflect the strategy established in Step 1.
- **UI & Design**: The application's look and feel should convey a professional, consultant-like quality suitable for a boardroom presentation.

## References

[1] StratiFi Architecture Design (`stratifi_architecture_design.html`)
[2] STRATIFI Skill Test Brief (local file: `STRATIFI_Skill_Test_Brief.pdf`)

## 5. Technical Architecture

### 5.1. File Structure

The project follows the Next.js App Router structure:

```
📁 stratifi/
  📁 app/
    layout.tsx — fonts, metadata, Toaster provider
    page.tsx — single page, orchestrates all steps
    globals.css — design tokens, base styles
    📁 api/
      📁 step1/
        route.ts — SOAP + 3HM generation
      📁 step2/
        route.ts — BSC generation from Step 1

  📁 components/
    📁 upload/
      UploadZone.tsx — dropzone for one PDF slot
      UploadPanel.tsx — both zones + step 1 trigger
    📁 soap/
      SOAPSection.tsx — full SOAP framework view
      VisionMission.tsx — hexagon card pair
      GoalCard.tsx — chevron banner + objectives
      ValuesBar.tsx — leadership values strip
    📁 thm/
      THMSection.tsx — full 3HM framework view
      HorizonCard.tsx — single H1/H2/H3 block
      HorizonCurve.tsx — SVG growth curve visual
    📁 bsc/
      BSCSection.tsx — full BSC framework view
      BSCTable.tsx — table with 4 perspectives
      BSCRow.tsx — single objective row
      RAGBadge.tsx — blank R/A/G status pill
    📁 ui/
      Button.tsx — primary/ghost variants
      FrameworkHeader.tsx — dark navy section header
      LoadingSkeleton.tsx — shimmer placeholders
      SectionDivider.tsx — decorative step separator
      StepBadge.tsx — Step 1 / Step 2 indicator

  📁 hooks/
    useStep1.ts — SOAP + 3HM fetch + state
    useStep2.ts — BSC fetch + state
    useFileUpload.ts — file to base64 + validation
    useStrategyPack.ts — orchestrator hook for the whole pipeline state

  📁 lib/
    anthropic.ts — SDK client singleton
    prompts.ts — all system + user prompts
    schemas.ts — Zod schemas for AI output
    utils.ts — cn(), fileToBase64(), etc.

  📁 types/
    strategy.ts — SOAP, THM, BSC TypeScript types
    api.ts — API request/response types
```

### 5.2. Components

#### Pages

| Component        | Description                                                                                     | Props                 |
| :--------------- | :---------------------------------------------------------------------------------------------- | :-------------------- |
| `app/page.tsx`   | Root orchestrator                                                                               | `none` — top-level    |
| `app/layout.tsx` | IBM Plex Sans + Mono font loading, metadata, dark background base, Sonner Toaster mounted here. | `children: ReactNode` |

#### Upload Components

| Component     | Description                                                                                               | Props                              |
| :------------ | :-------------------------------------------------------------------------------------------------------- | :--------------------------------- |
| `UploadPanel` | Container for both upload zones side-by-side. Shows "Generate Strategy" button when both files are ready. | `onGenerate`, `loading`            |
| `UploadZone`  | Single dropzone slot. Accepts PDF only. Shows file name + size on upload. Drag-over state animation.      | `label`, `onFile`, `file`, `error` |

#### SOAP Components

| Component       | Description                                                                                                | Props                           |
| :-------------- | :--------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `SOAPSection`   | Wrapper with FrameworkHeader. Renders VisionMission, three GoalCards, and ValuesBar.                       | `data: SOAPData`                |
| `VisionMission` | Two-column hexagon-accented cards. Vision left, Mission right. Navy fill with orange accent line.          | `vision`, `mission: string`     |
| `GoalCard`      | Chevron-style numbered goal banner in dark navy. Objectives listed below with numbered prefix (1.1, 1.2…). | `index`, `goal`, `objectives[]` |
| `ValuesBar`     | Full-width horizontal strip with 4 leadership values in equal columns. Muted slate fill.                   | `values: string[]`              |

#### 3HM Components

| Component      | Description                                                                                                     | Props                  |
| :------------- | :-------------------------------------------------------------------------------------------------------------- | :--------------------- |
| `THMSection`   | Wrapper with header. Renders HorizonCurve SVG alongside three HorizonCards stacked vertically.                  | `data: THMData`        |
| `HorizonCurve` | SVG S-curve growth chart. H1/H2/H3 zones marked. Decorative — matches template visual.                          | `active: 1\|2\|3`      |
| `HorizonCard`  | Single horizon block with H1/H2/H3 hexagon badge, title (Operationalise/Integrate/Endure), and objectives list. | `horizon: HorizonData` |

#### BSC Components

| Component    | Description                                                                                                                               | Props                            |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------- |
| `BSCSection` | Wrapper with header and Step 2 trigger button. Shows loading state until step 2 completes.                                                | `data`, `onGenerate`, `loading`  |
| `BSCTable`   | Full scorecard table. Groups rows by perspective (Financial, Customers, Systems, Learning). Each group has a coloured left-border accent. | `perspectives: BSCPerspective[]` |
| `BSCRow`     | Single table row. Objective \| SMART Actions \| RAGBadge (blank) \| Lead (blank dash).                                                    | `row: BSCRow`                    |
| `RAGBadge`   | R/A/G pill — rendered as empty outlined circles. User fills manually after generation.                                                    | `status?: 'R'\|'A'\|'G'`         |

#### Shared UI Components

| Component         | Description                                                                                              | Props                           |
| :---------------- | :------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `FrameworkHeader` | Dark navy banner with diagonal orange accent. Title + subtitle. Matches template header style exactly.   | `title`, `subtitle`             |
| `LoadingSkeleton` | Shimmer placeholder cards for each framework section while AI is generating.                             | `rows?`, `variant?`             |
| `StepBadge`       | Step 1 / Step 2 numbered indicator shown above each framework trigger. With status: pending/active/done. | `step`, `status`                |
| `Button`          | Primary (navy fill + orange border) and ghost variants. Loading spinner state built in.                  | `variant`, `loading`, `onClick` |

### 5.3. Hooks & State Management

#### Custom Hooks

| Hook                | Description                                                                                                                                    | Returns                                                                  |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| `useFileUpload()`   | Manages two file slots (company doc + strategy doc). Converts each to base64 on selection. Validates PDF type and size (<20MB).                | `→ { companyFile, strategyFile, setFile, clearFile, bothReady, errors }` |
| `useStep1()`        | Posts base64 PDFs to `/api/step1`. Parses and validates JSON response with Zod. Stores SOAP + 3HM output in state.                             | `→ { run, data, loading, error, status }`                                |
| `useStep2()`        | Takes Step 1 output (not raw files). Posts to `/api/step2`. Returns validated BSC data. Cannot run before Step 1 completes.                    | `→ { run, data, loading, error, status }`                                |
| `useStrategyPack()` | Orchestrator hook used in `page.tsx`. Combines `useStep1` + `useStep2` + `useFileUpload`. Single source of truth for the whole pipeline state. | `→ { upload, step1, step2, appState }`                                   |

#### App State Machine

The application's state machine, managed by `useStrategyPack()`, progresses through the following states:

- **`idle`**: Initial state when the page loads. The upload panel is visible, and both file slots are empty.
- **`files_ready`**: Both PDF documents have been uploaded. The "Generate Strategy Pack" button is enabled.
- **`step1_loading`**: The API call to `/api/step1` is in progress. Loading skeletons are displayed for the SOAP and 3HM sections.
- **`step1_complete`**: The SOAP and 3HM frameworks have been successfully generated and rendered. The "Generate BSC" button appears.
- **`step2_loading`**: The API call to `/api/step2` is in progress. A loading skeleton is displayed for the BSC section.
- **`complete`**: All three frameworks (SOAP, 3HM, and BSC) are rendered, and the full Strategy Pack is visible.

## 6. Design System

### 6.1. Colour Palette

| Color Name | Hex Code  | Description          |
| :--------- | :-------- | :------------------- |
| Navy       | `#0D1B2A` | Primary background   |
| Navy-mid   | `#1A2E42` | Card backgrounds     |
| Slate      | `#243B55` |                      |
| Orange     | `#E8511A` | Accent color         |
| Teal       | `#2EC4B6` | Interactive elements |
| Off-white  | `#E8E8E8` |                      |
| Muted      | `#8B9CAF` |                      |
| RAG Green  | `#27AE60` | RAG status green     |
| RAG Amber  | `#F39C12` | RAG status amber     |
| RAG Red    | `#E74C3C` | RAG status red       |

### 6.2. Typography

- **IBM Plex Sans**: Used for display and headings, and body text.
- **IBM Plex Mono**: Used for labels, codes, and badges, providing a precise and classified-data feel.

### 6.3. CSS Variables (globals.css)

```css
:root {
  /* Brand */
  --navy: #0d1b2a;
  --navy-mid: #1a2e42;
  --slate: #243b55;
  --orange: #e8511a;
  --teal: #2ec4b6;
  --off-white: #e8e8e8;
  --muted: #8b9caf;
  /* RAG */
  --rag-green: #27ae60;
  --rag-amber: #f39c12;
  --rag-red: #e74c3c;
}
```

### 6.4. Key Design Decisions

- **Dark base**: A full-page navy background (`#0D1B2A`) with framework cards on a slightly lighter navy-mid (`#1A2E42`), and white text, to evoke a Defence sector aesthetic.
- **Orange diagonal**: A diagonal orange slash accent on the top-right of every `FrameworkHeader`, directly referencing the template's visual language.
- **Teal accents**: Used for interactive elements such as buttons, active states, and horizon badges. Orange is used for structural elements, while teal signifies interactivity.
- **IBM Plex Mono**: Applied to labels, codes, step markers, and BSC field names to give a sense of precision and classified data without being visually noisy.
