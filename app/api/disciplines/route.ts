import { NextResponse } from "next/server";
import { createDisciplineSchema } from "@/src/domain/academic";
import { ensureSchema, getDb, mapDiscipline } from "@/src/lib/db";
import { apiError, parseJson } from "@/src/lib/http";

export async function POST(request: Request) {
  try {
    const input = createDisciplineSchema.parse(await parseJson(request));
    await ensureSchema();
    const db = getDb();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO disciplines (id, name, code, color, term, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, input.name, input.code, input.color, input.term, now, now)
      .run();

    const row = await db.prepare("SELECT * FROM disciplines WHERE id = ?").bind(id).first();
    return NextResponse.json(mapDiscipline(row as Parameters<typeof mapDiscipline>[0]), {
      status: 201,
    });
  } catch (error) {
    return apiError(error);
  }
}
