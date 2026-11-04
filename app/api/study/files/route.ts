import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { saveAttachment, withStudyLock, StoreError, type StoredFile } from "@/src/lib/study-store";
import { assertSameOrigin, readLimitedJson, studyError } from "@/src/lib/study-http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = await readLimitedJson(request, 12 * 1024 * 1024);
    if (!input || typeof input.name !== "string" || typeof input.type !== "string" || typeof input.data !== "string") throw new StoreError("Arquivo inválido.", 400);
    const file: StoredFile = { id: randomUUID(), name: input.name, type: input.type, data: input.data };
    await withStudyLock(() => saveAttachment(file));
    return NextResponse.json({ id: file.id, name: file.name }, { status: 201 });
  } catch (error) { return studyError(error); }
}
