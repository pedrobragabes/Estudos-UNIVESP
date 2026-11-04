import { NextResponse } from "next/server";
import { readStudy, validateStudy, withStudyLock, writeStudy } from "@/src/lib/study-store";
import { assertSameOrigin, readLimitedJson, studyError } from "@/src/lib/study-http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return NextResponse.json(await readStudy(), { headers: { "Cache-Control": "no-store" } }); } catch (error) { return studyError(error); }
}
export async function PUT(request: Request) {
  try {
    assertSameOrigin(request);
    const state = validateStudy(await readLimitedJson(request));
    return NextResponse.json(await withStudyLock(() => writeStudy(state, state.revision)));
  } catch (error) { return studyError(error); }
}
