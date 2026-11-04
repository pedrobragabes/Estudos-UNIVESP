import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { studySchema } from "@/src/domain/study";
import { readStudy, readAttachment, saveAttachment, validateFile, validateStudy, withStudyLock, writeStudy, StoreError } from "@/src/lib/study-store";
import { assertSameOrigin, readLimitedJson, studyError } from "@/src/lib/study-http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const backupSchema = z.object({ format: z.literal("univesp-study-backup-v1"), state: studySchema, files: z.array(z.object({ id: z.string().uuid(), name: z.string().max(250), type: z.string(), data: z.string().max(12 * 1024 * 1024) })).max(1000) });
export async function GET() {
  try {
    const payload = await withStudyLock(async () => {
      const state = await readStudy();
      const ids = [...new Set(state.materials.flatMap((m) => m.fileId ? [m.fileId] : []))];
      return { format: "univesp-study-backup-v1", state, files: await Promise.all(ids.map(readAttachment)) };
    });
    return new Response(new Blob([JSON.stringify(payload)]).stream(), { headers: { "Content-Type": "application/json", "Content-Disposition": 'attachment; filename="estudos-univesp-backup.json"', "Cache-Control": "no-store" } });
  } catch (error) { return studyError(error); }
}
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await readLimitedJson(request, 150 * 1024 * 1024);
    const backup = backupSchema.parse(body.backup);
    const revision = z.number().int().nonnegative().parse(body.revision);
    validateStudy(backup.state);
    backup.files.forEach(validateFile);
    if (new Set(backup.files.map((f) => f.id)).size !== backup.files.length || backup.state.materials.some((m) => m.fileId && !backup.files.some((f) => f.id === m.fileId))) throw new StoreError("O backup contém anexos ausentes ou duplicados.", 400);
    const result = await withStudyLock(async () => {
      const current = await readStudy();
      if (current.revision !== revision) throw new StoreError("Os dados mudaram. Recarregue antes de restaurar o backup.", 409);
      // Fresh file IDs ensure a failed import cannot overwrite existing attachments.
      const mapping = new Map(backup.files.map((f) => [f.id, randomUUID()]));
      for (const file of backup.files) await saveAttachment({ ...file, id: mapping.get(file.id)! });
      return writeStudy({ ...backup.state, materials: backup.state.materials.map((m) => ({ ...m, fileId: m.fileId ? mapping.get(m.fileId) : undefined })) }, revision);
    });
    return NextResponse.json(result);
  } catch (error) { return studyError(error); }
}
