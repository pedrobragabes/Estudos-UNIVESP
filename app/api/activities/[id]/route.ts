import { NextResponse } from "next/server";
import { updateActivitySchema } from "@/src/domain/academic";
import { ensureSchema, getDb, mapActivity } from "@/src/lib/db";
import { apiError, parseJson } from "@/src/lib/http";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const input = updateActivitySchema.parse(await parseJson(request));
    await ensureSchema();
    const db = getDb();
    const current = await db.prepare("SELECT * FROM activities WHERE id = ?").bind(id).first();

    if (!current) {
      return NextResponse.json({ error: "Atividade não encontrada." }, { status: 404 });
    }

    if (input.disciplineId) {
      const discipline = await db
        .prepare("SELECT id FROM disciplines WHERE id = ?")
        .bind(input.disciplineId)
        .first();
      if (!discipline) {
        return NextResponse.json({ error: "Disciplina não encontrada." }, { status: 404 });
      }
    }

    const row = current as Parameters<typeof mapActivity>[0];
    const now = new Date().toISOString();
    await db
      .prepare(
        `UPDATE activities
         SET discipline_id = ?, title = ?, kind = ?, due_at = ?, status = ?,
             weight = ?, grade = ?, notes = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        input.disciplineId ?? row.discipline_id,
        input.title ?? row.title,
        input.kind ?? row.kind,
        input.dueAt ?? row.due_at,
        input.status ?? row.status,
        input.weight === undefined ? row.weight : input.weight,
        input.grade === undefined ? row.grade : input.grade,
        input.notes ?? row.notes,
        now,
        id,
      )
      .run();

    const updated = await db.prepare("SELECT * FROM activities WHERE id = ?").bind(id).first();
    return NextResponse.json(mapActivity(updated as Parameters<typeof mapActivity>[0]));
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await ensureSchema();
    const result = await getDb().prepare("DELETE FROM activities WHERE id = ?").bind(id).run();

    if (!result.meta.changes) {
      return NextResponse.json({ error: "Atividade não encontrada." }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(error);
  }
}
