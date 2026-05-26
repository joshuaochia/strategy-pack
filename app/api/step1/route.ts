import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { STEP1_SYSTEM_PROMPT, STEP1_USER_PROMPT } from "@/lib/prompts";
import { Step1OutputSchema } from "@/lib/schemas";
import { safeParseJSON } from "@/lib/utils";
import type { Step1Request } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body: Step1Request = await req.json();
    const { companyDocBase64, strategyDocBase64 } = body;

    if (!companyDocBase64 || !strategyDocBase64) {
      return NextResponse.json(
        { success: false, error: "Both documents are required" },
        { status: 400 },
      );
    }

    const result = await geminiModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            // System instructions
            { text: STEP1_SYSTEM_PROMPT },

            // Company PDF sent natively — no parsing needed
            { text: "--- COMPANY DOCUMENT ---" },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: companyDocBase64,
              },
            },

            // Strategy PDF sent natively
            { text: "--- STRATEGY DOCUMENT ---" },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: strategyDocBase64,
              },
            },

            // Task
            { text: `--- TASK ---\n${STEP1_USER_PROMPT}` },
          ],
        },
      ],
    });

    const response = await result.response;
    const raw = response.text();

    const parsed = safeParseJSON(raw);

    if (!parsed) {
      console.error(
        "[/api/step1] Failed to parse JSON from model response:",
        raw,
      );
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse AI response. Please try again.",
        },
        { status: 500 },
      );
    }

    const validated = Step1OutputSchema.safeParse(parsed);

    if (!validated.success) {
      console.error(
        "[/api/step1] Zod validation failed:",
        validated.error.flatten(),
      );
      return NextResponse.json(
        {
          success: false,
          error:
            "AI response did not match expected structure. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: validated.data });
  } catch (err) {
    console.error("[/api/step1] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}
