import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { initialStudyState } from "@/src/domain/study";
import { readStudy, validateStudy, withStudyLock, writeStudy, saveAttachment, readAttachment } from "@/src/lib/study-store";
import { assertSameOrigin } from "@/src/lib/study-http";
import { GET as exportBackup, POST as restoreBackup } from "@/app/api/study/backup/route";
import { GET as getFile } from "@/app/api/study/files/[id]/route";

let temporary = "";
const originalDirectory = process.env.STUDY_DATA_DIR;
beforeAll(async () => { temporary = await mkdtemp(path.join(tmpdir(), "univesp-store-test-")); process.env.STUDY_DATA_DIR = temporary; });
afterAll(async () => {
  if (originalDirectory === undefined) delete process.env.STUDY_DATA_DIR; else process.env.STUDY_DATA_DIR = originalDirectory;
  const resolved = path.resolve(temporary);
  if (resolved.startsWith(path.resolve(tmpdir()) + path.sep + "univesp-store-test-")) await rm(resolved, { recursive: true, force: true });
});
describe("durable local study storage", () => {
  it("starts empty without inheriting AVA completion percentages", async () => { expect(await readStudy()).toEqual(initialStudyState); });
  it("persists a write and rejects a stale tab without losing the newer data", async () => {
    const next = await withStudyLock(() => writeStudy({ ...initialStudyState, completedTopics: ["COM160-S1"] }, 0));
    expect(next.revision).toBe(1);
    await expect(withStudyLock(() => writeStudy({ ...initialStudyState, examDate: "2026-10-01" }, 0))).rejects.toMatchObject({ status: 409 });
    expect((await readStudy()).completedTopics).toEqual(["COM160-S1"]);
  });
  it("serializes competing writes and survives a rejected write", async () => {
    const current = await readStudy();
    const results = await Promise.allSettled([withStudyLock(() => writeStudy({ ...current, dailyMinutes: 90 }, current.revision)), withStudyLock(() => writeStudy({ ...current, dailyMinutes: 60 }, current.revision))]);
    expect(results.map((r) => r.status)).toEqual(["fulfilled", "rejected"]);
    const latest = await readStudy(); expect(latest.dailyMinutes).toBe(90);
    expect((await withStudyLock(() => writeStudy({ ...latest, dailyMinutes: 120 }, latest.revision))).dailyMinutes).toBe(120);
  });
  it("rejects unknown topics, duplicate cards and missing attachments", async () => {
    expect(() => validateStudy({ ...initialStudyState, completedTopics: ["OTHER-S1"] })).toThrow();
    const card = { id: "custom", topicId: "COM160-S1", question: "Q", answer: "A", source: "Pessoal" };
    expect(() => validateStudy({ ...initialStudyState, customCards: [card, card] })).toThrow();
    const current = await readStudy();
    await expect(withStudyLock(() => writeStudy({ ...current, materials: [{ id: "material", topicId: "COM160-S1", title: "Teste", text: "", createdAt: "2026-09-04T15:00:00Z", fileId: "12345678-1234-4234-8234-123456789abc" }] }, current.revision))).rejects.toMatchObject({ status: 404 });
    expect((await readStudy()).materials).toHaveLength(0);
  });
  it("round-trips attachment bytes and refuses forged formats and traversal", async () => {
    const file = { id: "12345678-1234-4234-8234-123456789abc", name: "anotação.txt", type: "text/plain", data: Buffer.from("Olá, memória!").toString("base64") };
    await saveAttachment(file); expect(await readAttachment(file.id)).toEqual(file);
    await expect(saveAttachment({ ...file, type: "image/png" })).rejects.toMatchObject({ status: 400 });
    await expect(readAttachment("../../state.json")).rejects.toMatchObject({ status: 400 });
  });
  it("refuses writes from another origin", () => {
    expect(() => assertSameOrigin(new Request("http://localhost:3000/api/study", { headers: { host: "localhost:3000", origin: "https://example.com" } }))).toThrow();
    expect(() => assertSameOrigin(new Request("http://localhost:3000/api/study", { headers: { host: "localhost:3000", origin: "http://localhost:3000" } }))).not.toThrow();
  });
  it("exports and restores a complete backup, including attachment bytes", async () => {
    const current = await readStudy();
    await withStudyLock(() => writeStudy({ ...current, customCards: [{ id: "my-card", topicId: "COM160-S1", question: "O que é um vetor?", answer: "Uma sequência de elementos contíguos.", source: "Pessoal" }], materials: [{ id: "my-note", topicId: "COM160-S1", title: "Anotação", text: "Minha revisão", createdAt: "2026-09-04T15:00:00Z", fileId: "12345678-1234-4234-8234-123456789abc", fileName: "anotação.txt" }] }, current.revision));
    const exported = await exportBackup(); expect(exported.status).toBe(200);
    const backup = JSON.parse(await exported.text());
    expect(backup.files).toHaveLength(1);
    const before = await readStudy();
    const response = await restoreBackup(new Request("http://localhost:3000/api/study/backup", { method: "POST", headers: { host: "localhost:3000", origin: "http://localhost:3000", "Content-Type": "application/json" }, body: JSON.stringify({ backup, revision: before.revision }) }));
    expect(response.status).toBe(200);
    const restored = await readStudy();
    expect(restored.customCards[0].question).toBe("O que é um vetor?");
    expect(restored.materials[0].fileId).not.toBe(before.materials[0].fileId);
    const file = await getFile(new Request("http://localhost:3000"), { params: Promise.resolve({ id: restored.materials[0].fileId! }) });
    expect(await file.text()).toBe("Olá, memória!");
    expect(file.headers.get("Content-Disposition")).toContain("attachment");
    expect(file.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });
  it("rejects an incomplete backup without changing current data", async () => {
    const before = await readStudy();
    const response = await restoreBackup(new Request("http://localhost:3000/api/study/backup", { method: "POST", headers: { host: "localhost:3000", origin: "http://localhost:3000", "Content-Type": "application/json" }, body: JSON.stringify({ revision: before.revision, backup: { format: "univesp-study-backup-v1", state: before, files: [] } }) }));
    expect(response.status).toBe(400);
    expect(await readStudy()).toEqual(before);
  });
});
