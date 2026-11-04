import { NextRequest, NextResponse } from "next/server";
import { createSession, passwordMatches, SESSION_COOKIE, SESSION_SECONDS, validSession } from "./src/lib/study-auth";

function loginPage(error = false) {
  return new NextResponse(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Entrar • Estudos UNIVESP</title><style>*{box-sizing:border-box}body{margin:0;min-height:100dvh;display:grid;place-items:center;background:#0b1020;color:#f4f7fb;font:16px system-ui;padding:24px}main{width:100%;max-width:420px;padding:32px;background:#151d32;border:1px solid #33415f;border-radius:20px}h1{font-size:28px;margin:0 0 12px}p{color:#c5cfe3;line-height:1.5}label{display:block;margin:24px 0 8px}input,button{font:inherit;width:100%;padding:14px;border-radius:10px}input{background:#0b1020;color:white;border:1px solid #7383a4}button{margin-top:16px;background:#9bb9ff;color:#10182a;border:0;font-weight:700;cursor:pointer}input:focus-visible,button:focus-visible{outline:3px solid #cfddff;outline-offset:3px}.error{color:#ffb9b9}</style></head><body><main><h1>Estudos UNIVESP</h1><p>Digite a senha para abrir seu espaço de estudo.</p>${error ? '<p class="error" role="alert">Senha incorreta. Tente novamente.</p>' : ""}<form method="post" action="/login"><label for="password">Senha</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256" autofocus><button type="submit">Entrar</button></form></main></body></html>`, {
    status: error ? 401 : 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'", "X-Content-Type-Options": "nosniff" },
  });
}

export async function proxy(request: NextRequest) {
  const password = process.env.STUDY_PASSWORD;
  // Local development remains available; hosted deployments fail closed.
  if (!password) return process.env.VERCEL
    ? new NextResponse("Acesso ainda não configurado.", { status: 503, headers: { "Cache-Control": "no-store" } })
    : NextResponse.next();
  if (request.nextUrl.pathname === "/login") {
    if (request.method === "POST") {
      if (request.headers.get("origin") !== request.nextUrl.origin) return new NextResponse("Origem inválida.", { status: 403 });
      if (Number(request.headers.get("content-length") ?? 0) > 2048) return new NextResponse(null, { status: 413 });
      const reader = request.body?.getReader();
      if (!reader) return loginPage(true);
      const chunks: Uint8Array[] = []; let length = 0;
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        length += value.length;
        if (length > 2048) { await reader.cancel(); return new NextResponse(null, { status: 413 }); }
        chunks.push(value);
      }
      const candidate = new URLSearchParams(Buffer.concat(chunks).toString()).get("password") ?? "";
      if (!passwordMatches(candidate, password)) return loginPage(true);
      const response = NextResponse.redirect(new URL("/", request.url), 303);
      response.cookies.set(SESSION_COOKIE, createSession(password), { httpOnly: true, secure: request.nextUrl.protocol === "https:", sameSite: "lax", path: "/", maxAge: SESSION_SECONDS });
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
    return loginPage();
  }
  if (!validSession(request.cookies.get(SESSION_COOKIE)?.value, password)) {
    if (request.nextUrl.pathname.startsWith("/api/")) return NextResponse.json({ error: "Sessão encerrada. Abra a página inicial e entre novamente." }, { status: 401, headers: { "Cache-Control": "no-store" } });
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = { matcher: ["/:path*"] };
