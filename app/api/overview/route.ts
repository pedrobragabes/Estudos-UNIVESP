import { NextResponse } from "next/server";
import { getAcademicSnapshot } from "@/src/lib/db";
import { apiError } from "@/src/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getAcademicSnapshot();
    return NextResponse.json(snapshot, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}
