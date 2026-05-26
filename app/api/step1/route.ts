import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { STEP1_SYSTEM_PROMPT, STEP1_USER_PROMPT } from "@/lib/prompts";
import { Step1OutputSchema } from "@/lib/schemas";
import { safeParseJSON } from "@/lib/utils";
import type { Step1Request } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

async function urlToBase64(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
    },
  });

  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}

export async function POST(req: NextRequest) {
  try {
    const body: Step1Request = await req.json();
    const { companyDocUrl, strategyDocUrl } = body;

    if (!companyDocUrl || !strategyDocUrl) {
      return NextResponse.json(
        { success: false, error: "Both document URLs are required" },
        { status: 400 },
      );
    }

    // Fetch both blobs server-side and convert to base64
    const [companyDocBase64, strategyDocBase64] = await Promise.all([
      urlToBase64(companyDocUrl),
      urlToBase64(strategyDocUrl),
    ]);

    const result = await geminiModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: STEP1_SYSTEM_PROMPT },
            { text: "--- COMPANY DOCUMENT ---" },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: companyDocBase64,
              },
            },
            { text: "--- STRATEGY DOCUMENT ---" },
            {
              inlineData: {
                mimeType: "application/pdf",
                data: strategyDocBase64,
              },
            },
            { text: `--- TASK ---\n${STEP1_USER_PROMPT}` },
          ],
        },
      ],
    });

    const raw = result.response.text();
    const parsed = safeParseJSON(raw);

    if (!parsed) {
      console.error("[/api/step1] Failed to parse JSON:", raw);
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
