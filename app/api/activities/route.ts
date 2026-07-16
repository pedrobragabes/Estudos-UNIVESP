import { NextResponse } from "next/server";
import { createActivitySchema } from "@/src/domain/academic";
import { ensureSchema, getDb, mapActivity } from "@/src/lib/db";
import { apiError, parseJson } from "@/src/lib/http";

export async function POST(request: Request) {
  try {
    const input = createActivitySchema.parse(await parseJson(request));
    await ensureSchema();
    const db = getDb();
    const discipline = await db
      .prepare("SELECT id FROM disciplines WHERE id = ?")
      .bind(input.disciplineId)
      .first();

    if (!discipline) {
      return NextResponse.json({ error: "Disciplina não encontrada." }, { status: 404 });
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    await db
      .prepare(
        `INSERT INTO activities
         (id, discipline_id, title, kind, due_at, status, weight, grade, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        input.disciplineId,
        input.title,
        input.kind,
        input.dueAt,
        input.status,
        input.weight,
        input.grade,
        input.notes,
        now,
        now,
      )
      .run();

    const row = await db.prepare("SELECT * FROM activities WHERE id = ?").bind(id).first();
    return NextResponse.json(mapActivity(row as Parameters<typeof mapActivity>[0]), {
      status: 201,
    });
  } catch (error) {
    return apiError(error);
  }
}
