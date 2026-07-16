import { NextResponse } from "next/server";
import { updateDisciplineSchema } from "@/src/domain/academic";
import { ensureSchema, getDb, mapDiscipline } from "@/src/lib/db";
import { apiError, parseJson } from "@/src/lib/http";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const input = updateDisciplineSchema.parse(await parseJson(request));
    await ensureSchema();
    const db = getDb();
    const current = await db.prepare("SELECT * FROM disciplines WHERE id = ?").bind(id).first();

    if (!current) {
      return NextResponse.json({ error: "Disciplina não encontrada." }, { status: 404 });
    }

    const row = current as Parameters<typeof mapDiscipline>[0];
    const now = new Date().toISOString();
    await db
      .prepare(
        `UPDATE disciplines
         SET name = ?, code = ?, color = ?, term = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(
        input.name ?? row.name,
        input.code ?? row.code,
        input.color ?? row.color,
        input.term ?? row.term,
        now,
        id,
      )
      .run();

    const updated = await db.prepare("SELECT * FROM disciplines WHERE id = ?").bind(id).first();
    return NextResponse.json(mapDiscipline(updated as Parameters<typeof mapDiscipline>[0]));
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await ensureSchema();
    const result = await getDb().prepare("DELETE FROM disciplines WHERE id = ?").bind(id).run();

    if (!result.meta.changes) {
      return NextResponse.json({ error: "Disciplina não encontrada." }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(error);
  }
}
