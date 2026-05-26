import { NextRequest, NextResponse } from "next/server";
import anthropic, { MODEL, MAX_TOKENS } from "@/lib/anthropic";
import { STEP1_SYSTEM_PROMPT, STEP1_USER_PROMPT } from "@/lib/prompts";
import { Step1OutputSchema } from "@/lib/schemas";
import { safeParseJSON, extractTextContent } from "@/lib/utils";
import type { Step1Request } from "@/types";

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

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: STEP1_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: companyDocBase64,
              },
            },
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: strategyDocBase64,
              },
            },
            {
              type: "text",
              text: STEP1_USER_PROMPT,
            },
          ],
        },
      ],
    });

    const raw = extractTextContent(
      response.content as Array<{ type: string; text?: string }>,
    );

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
