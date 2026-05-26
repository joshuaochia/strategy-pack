// app/api/upload/route.ts
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File;

  const blob = await put(file.name, file, {
    access: "private",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
