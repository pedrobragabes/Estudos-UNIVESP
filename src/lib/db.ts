import { getCloudflareContext } from "@opennextjs/cloudflare";
import { schemaStatements } from "@/db/schema";
import type { Activity, Discipline } from "@/src/domain/academic";

let schemaReady: Promise<void> | null = null;

export function getDb() {
  const { env } = getCloudflareContext();
  if (!env.DB) {
    throw new Error("O binding D1 `DB` não está disponível.");
  }
  return env.DB;
}

export async function ensureSchema() {
  if (!schemaReady) {
    const db = getDb();
    schemaReady = db
      .batch(schemaStatements.map((statement) => db.prepare(statement)))
      .then(() => undefined)
      .catch((error) => {
        schemaReady = null;
        throw error;
      });
  }
  await schemaReady;
}

type DisciplineRow = {
  id: string;
  name: string;
  code: string;
  color: string;
  term: string;
  created_at: string;
  updated_at: string;
};

type ActivityRow = {
  id: string;
  discipline_id: string;
  title: string;
  kind: Activity["kind"];
  due_at: string;
  status: Activity["status"];
  weight: number | null;
  grade: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
};

export function mapDiscipline(row: DisciplineRow): Discipline {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    color: row.color,
    term: row.term,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    disciplineId: row.discipline_id,
    title: row.title,
    kind: row.kind,
    dueAt: row.due_at,
    status: row.status,
    weight: row.weight,
    grade: row.grade,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAcademicSnapshot() {
  await ensureSchema();
  const db = getDb();
  const [disciplineResult, activityResult] = await db.batch([
    db.prepare("SELECT * FROM disciplines ORDER BY term DESC, name ASC"),
    db.prepare("SELECT * FROM activities ORDER BY due_at ASC"),
  ]);

  return {
    disciplines: (disciplineResult.results as DisciplineRow[]).map(mapDiscipline),
    activities: (activityResult.results as ActivityRow[]).map(mapActivity),
  };
}
