import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { STEP2_SYSTEM_PROMPT, STEP2_USER_PROMPT } from "@/lib/prompts";
import { Step2OutputSchema } from "@/lib/schemas";
import { safeParseJSON, extractTextContent } from "@/lib/utils";
import type { Step2Request } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: Step2Request = await req.json();
    const { step1Output } = body;

    if (!step1Output?.soap || !step1Output?.thm) {
      return NextResponse.json(
        { success: false, error: "Step 1 output (SOAP + 3HM) is required" },
        { status: 400 },
      );
    }

    // ✅ Gemini call using the new model SDK implementation
    const result = await geminiModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${STEP2_SYSTEM_PROMPT}\n\n${STEP2_USER_PROMPT(
                JSON.stringify(step1Output, null, 2),
              )}`,
            },
          ],
        },
      ],
    });

    const response = await result.response;
    const raw = response.text();

    const parsed = safeParseJSON(raw);

    if (!parsed) {
      console.error(
        "[/api/step2] Failed to parse JSON from model response:",
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

    const validated = Step2OutputSchema.safeParse(parsed);

    if (!validated.success) {
      console.error(
        "[/api/step2] Zod validation failed:",
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
    console.error("[/api/step2] Unexpected error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}
