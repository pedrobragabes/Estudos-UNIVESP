import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { StoreError } from "./study-store";
import { get, del } from "@vercel/blob";

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).host !== request.headers.get("host")) throw new StoreError("Abra o aplicativo neste endereço para salvar alterações.", 403);
}
export async function readLimitedJson(request: Request, limit = 10 * 1024 * 1024) {
  if (Number(request.headers.get("content-length") ?? 0) > limit) throw new StoreError("O arquivo é grande demais.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new StoreError("Conteúdo vazio.", 400);
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > limit) { await reader.cancel(); throw new StoreError("O arquivo é grande demais.", 413); } chunks.push(value); }
  let value;
  try { value = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new StoreError("JSON inválido.", 400); }
  if (process.env.VERCEL && typeof value?.transfer === "string") {
    if (!/^transfers\/[0-9a-f-]{36}\.json$/.test(value.transfer)) throw new StoreError("Transferência inválida.", 400);
    const result = await get(value.transfer, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) throw new StoreError("Transferência não encontrada. Tente novamente.", 400);
    try {
      if (result.blob.size > limit) throw new StoreError("O arquivo é grande demais.", 413);
      return await new Response(result.stream).json();
    } finally { await del(value.transfer); }
  }
  return value;
}
export function studyError(error: unknown) {
  if (error instanceof StoreError) return NextResponse.json({ error: error.message }, { status: error.status });
  if (error instanceof ZodError) return NextResponse.json({ error: "Dados inválidos. Confira o formato e os campos do arquivo." }, { status: 400 });
  console.error("Study storage failure", error instanceof Error ? error.name : "Unknown error");
  return NextResponse.json({ error: "Não foi possível acessar seus dados. Eles não foram substituídos. Tente novamente ou restaure um backup." }, { status: 500 });
}
