import { afterEach, describe, expect, it, vi } from "vitest";
import { initialStudyState } from "@/src/domain/study";
const blob = vi.hoisted(() => ({ get: vi.fn(), head: vi.fn(), put: vi.fn(), list: vi.fn() }));
vi.mock("@vercel/blob", () => ({ ...blob, BlobNotFoundError: class extends Error {}, BlobPreconditionFailedError: class extends Error {} }));
import { BlobNotFoundError, BlobPreconditionFailedError } from "@vercel/blob";
import { readStudy, writeStudy, readAttachment } from "@/src/lib/study-store";
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
describe("private cloud study storage", () => {
  it("starts empty and creates the first state without overwriting a racing writer", async () => {
    vi.stubEnv("VERCEL", "1"); blob.get.mockResolvedValue(null); blob.put.mockResolvedValue({});
    blob.head.mockRejectedValue(new BlobNotFoundError());
    expect(await readStudy()).toEqual(initialStudyState);
    await writeStudy(initialStudyState, 0);
    expect(blob.put).toHaveBeenCalledWith("study/state.json", expect.any(String), expect.objectContaining({ access: "private", allowOverwrite: false }));
    blob.put.mockRejectedValue(new Error("Blob already exists"));
    await expect(writeStudy(initialStudyState, 0)).rejects.toMatchObject({ status: 409 });
  });
  it("uses uncached reads and atomic ETag checks across server instances", async () => {
    vi.stubEnv("VERCEL", "1");
    blob.head.mockResolvedValue({etag: '"revision-four"'});
    blob.get.mockImplementation(async () => ({ statusCode: 200, stream: new Blob([JSON.stringify({ ...initialStudyState, revision: 4 })]).stream(), blob: { etag: 'W/"revision-four"' } }));
    blob.put.mockResolvedValue({});
    expect((await writeStudy({ ...initialStudyState, dailyMinutes: 90 }, 4)).revision).toBe(5);
    expect(blob.get).toHaveBeenCalledWith("study/state.json", { access: "private", useCache: false });
    expect(blob.head.mock.invocationCallOrder[0]).toBeLessThan(blob.get.mock.invocationCallOrder[0]);
    expect(blob.put).toHaveBeenCalledWith("study/state.json", expect.any(String), expect.objectContaining({ access: "private", ifMatch: '"revision-four"' }));
    blob.put.mockRejectedValue(new BlobPreconditionFailedError());
    await expect(writeStudy(initialStudyState, 4)).rejects.toMatchObject({ status: 409 });
    await expect(writeStudy(initialStudyState, 3)).rejects.toMatchObject({ status: 409 });
  });
  it("does not interpret missing attachment data as an empty file", async () => {
    vi.stubEnv("VERCEL", "1"); blob.get.mockResolvedValue(null);
    await expect(readAttachment("12345678-1234-4234-8234-123456789abc")).rejects.toMatchObject({ status: 404 });
  });
});
