import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createSession, validSession, SESSION_COOKIE, SESSION_SECONDS } from "@/src/lib/study-auth";
import { proxy } from "@/proxy";

afterEach(() => vi.unstubAllEnvs());
describe("temporary password protection", () => {
  it("rejects forged, expired and old-password cookies", () => {
    const now = 1800000000000;
    const token = createSession("test-password", now);
    expect(validSession(token, "test-password", now)).toBe(true);
    expect(validSession(token + "x", "test-password", now)).toBe(false);
    expect(validSession(token, "new-password", now)).toBe(false);
    expect(validSession(token, "test-password", now + SESSION_SECONDS * 1000)).toBe(false);
    expect(validSession(undefined, "test-password", now)).toBe(false);
  });
  it("fails closed on Vercel without a configured password", async () => {
    vi.stubEnv("VERCEL", "1"); vi.stubEnv("STUDY_PASSWORD", "");
    expect((await proxy(new NextRequest("https://study.example/"))).status).toBe(503);
  });
  it("protects pages, backup, files and legacy API routes", async () => {
    vi.stubEnv("STUDY_PASSWORD", "test-password");
    for (const route of ["/", "/organizador", "/api/study", "/api/study/backup", "/api/study/files/id", "/api/activities"]) {
      const response = await proxy(new NextRequest(`https://study.example${route}`));
      expect(response.status).toBe(route.startsWith("/api/") ? 401 : 307);
    }
  });
  it("accepts the correct password and sets a protected session cookie", async () => {
    vi.stubEnv("STUDY_PASSWORD", "test-password");
    const login = (password: string, origin = "https://study.example") => proxy(new NextRequest("https://study.example/login", { method: "POST", headers: { origin, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ password }) }));
    expect((await login("wrong")).status).toBe(401);
    expect((await login("test-password", "https://other.example")).status).toBe(403);
    const response = await login("test-password");
    expect(response.status).toBe(303);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("Secure");
    const token = response.cookies.get(SESSION_COOKIE)!.value;
    const allowed = await proxy(new NextRequest("https://study.example/api/study", { headers: { cookie: `${SESSION_COOKIE}=${token}` } }));
    expect(allowed.headers.get("x-middleware-next")).toBe("1");
    expect(allowed.headers.get("Cache-Control")).toBe("private, no-store");
  });
});
