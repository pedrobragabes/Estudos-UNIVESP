import { mkdir, readFile, writeFile, rename, readdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { get, head, put, list, BlobNotFoundError, BlobPreconditionFailedError } from "@vercel/blob";
import { initialStudyState, studySchema, type StudyState } from "@/src/domain/study";
import { allQuestions, topicById, allCards } from "@/src/data/curriculum";

const directory = () => {
  if (process.env.VERCEL) throw new StoreError("O armazenamento local precisa ser conectado a um banco e a um serviço de arquivos antes de usar na Vercel.", 503);
  return path.resolve(/* turbopackIgnore: true */ process.env.STUDY_DATA_DIR ?? path.join(process.cwd(), ".study-data"));
};
const cloud = () => Boolean(process.env.VERCEL);
async function readCloudState(forWrite = false) {
  // Downloads can expose a weak ETag after compression. Read the canonical
  // storage ETag before the write snapshot so racing writers still fail CAS.
  const metadata = forWrite ? await head("study/state.json").catch((error) => {
    if (error instanceof BlobNotFoundError) return undefined;
    throw error;
  }) : undefined;
  const result = await get("study/state.json", { access: "private", useCache: false });
  if (!result) return { state: structuredClone(initialStudyState), etag: undefined };
  if (result.statusCode !== 200) throw new StoreError("Não foi possível ler os estudos.", 503);
  return { state: studySchema.parse(await new Response(result.stream).json()), etag: forWrite ? metadata?.etag : result.blob.etag };
}
export class StoreError extends Error { constructor(message: string, public status: number) { super(message); } }
// Stored on globalThis so Next development reloads share the same write queue.
const globalStore = globalThis as typeof globalThis & { studyQueue?: Promise<unknown> };
export async function withStudyLock<T>(operation: () => Promise<T>): Promise<T> {
  const task = (globalStore.studyQueue ?? Promise.resolve()).then(operation, operation);
  globalStore.studyQueue = task.catch(() => undefined);
  return task;
}
export async function readStudy(): Promise<StudyState> {
  if (cloud()) return (await readCloudState()).state;
  try { return studySchema.parse(JSON.parse(await readFile(path.join(directory(), "state.json"), "utf8"))); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return structuredClone(initialStudyState);
    throw error;
  }
}
export function validateStudy(input: unknown): StudyState {
  const state = studySchema.parse(input);
  const cardIds = state.customCards.map((c) => c.id);
  const materialIds = state.materials.map((m) => m.id);
  const attemptIds = state.attempts.map((a) => a.id);
  const knownQuestions = new Set(allQuestions.map((q) => q.id));
  const knownCards = new Set([...allCards.map((c) => c.id), ...cardIds]);
  const invalid = [...state.completedTopics, ...state.customCards.map((c) => c.topicId), ...state.materials.map((m) => m.topicId)].some((id) => !topicById.has(id));
  const duplicates = [cardIds, materialIds, attemptIds, state.completedTopics].some((ids) => new Set(ids).size !== ids.length);
  if (invalid || duplicates || cardIds.some((id) => allCards.some((c) => c.id === id)) || Object.keys(state.reviews).some((id) => !knownCards.has(id)) || state.attempts.some((a) => new Set(a.questionIds).size !== a.questionIds.length || a.questionIds.some((id) => !knownQuestions.has(id)) || a.answers.some((answer) => answer !== null && answer > 3))) {
    throw new StoreError("Há disciplinas, cartões ou questões inválidos neste arquivo.", 400);
  }
  return state;
}
export async function writeStudy(state: StudyState, expectedRevision: number): Promise<StudyState> {
  const snapshot = cloud() ? await readCloudState(true) : undefined;
  const current = snapshot?.state ?? await readStudy();
  if (current.revision !== expectedRevision) throw new StoreError("Os dados mudaram em outra aba. Recarregue a página antes de continuar.", 409);
  const validated = validateStudy(state);
  for (const material of validated.materials) if (material.fileId) await readAttachment(material.fileId);
  const next = { ...validated, revision: current.revision + 1 };
  if (cloud()) {
    try {
      await put("study/state.json", JSON.stringify(next), { access: "private", addRandomSuffix: false, contentType: "application/json", ...(snapshot?.etag ? { ifMatch: snapshot.etag } : { allowOverwrite: false }) });
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError || (error instanceof Error && /already exists/i.test(error.message))) throw new StoreError("Os dados mudaram em outra aba. Recarregue a página antes de continuar.", 409);
      throw error;
    }
    return next;
  }
  const dir = directory();
  await mkdir(dir, { recursive: true });
  const temporary = path.join(dir, `state-${randomUUID()}.tmp`);
  await writeFile(temporary, JSON.stringify(next), "utf8");
  await rename(temporary, path.join(dir, "state.json"));
  return next;
}
export const allowedTypes: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "application/pdf": "pdf", "text/plain": "txt" };
export const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_TOTAL_SIZE = 100 * 1024 * 1024;
export type StoredFile = { id: string; name: string; type: string; data: string };
export function validateFile(file: StoredFile) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(file.id) || !allowedTypes[file.type] || !file.name || file.name.length > 250 || !/^[A-Za-z0-9+/]*={0,2}$/.test(file.data)) throw new StoreError("Arquivo inválido. Use PNG, JPG, WebP, PDF ou TXT.", 400);
  const bytes = Buffer.from(file.data, "base64");
  if (!bytes.length || bytes.length > MAX_FILE_SIZE) throw new StoreError("Cada arquivo deve ter entre 1 byte e 8 MB.", 400);
  const validSignature = file.type === "text/plain" || (file.type === "image/png" && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) || (file.type === "image/jpeg" && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) || (file.type === "application/pdf" && bytes.subarray(0, 5).toString() === "%PDF-") || (file.type === "image/webp" && bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP");
  if (!validSignature) throw new StoreError("O conteúdo do arquivo não corresponde ao formato informado.", 400);
}
export async function saveAttachment(file: StoredFile) {
  validateFile(file);
  if (cloud()) {
    let cursor: string | undefined; let total = Buffer.byteLength(JSON.stringify(file));
    do {
      const result = await list({ prefix: "study/files/", cursor });
      total += result.blobs.reduce((sum, entry) => sum + entry.size, 0);
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);
    if (total > Math.ceil(MAX_TOTAL_SIZE * 4 / 3)) throw new StoreError("O limite de anexos é 100 MB. Exporte um backup antes de reorganizar os arquivos.", 400);
    await put(`study/files/${file.id}.json`, JSON.stringify(file), { access: "private", addRandomSuffix: false, allowOverwrite: false, contentType: "application/json" });
    return;
  }
  const dir = path.join(directory(), "files");
  await mkdir(dir, { recursive: true });
  let total = Buffer.byteLength(file.data, "base64");
  for (const filename of await readdir(dir)) {
    if (filename.endsWith(".json") && filename !== `${file.id}.json`) { const entry: StoredFile = JSON.parse(await readFile(path.join(dir, filename), "utf8")); total += Buffer.byteLength(entry.data, "base64"); }
  }
  if (total > MAX_TOTAL_SIZE) throw new StoreError("O limite local de anexos é 100 MB. Exporte um backup antes de reorganizar os arquivos.", 400);
  await writeFile(path.join(dir, `${file.id}.json`), JSON.stringify(file), "utf8");
}
export async function readAttachment(id: string): Promise<StoredFile> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new StoreError("Arquivo inválido.", 400);
  if (cloud()) {
    const result = await get(`study/files/${id}.json`, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) throw new StoreError("Arquivo não encontrado.", 404);
    return new Response(result.stream).json();
  }
  try { return JSON.parse(await readFile(path.join(directory(), "files", `${id}.json`), "utf8")); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") throw new StoreError("Arquivo não encontrado.", 404); throw error; }
}
