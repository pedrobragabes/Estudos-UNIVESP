import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { assertSameOrigin, studyError } from "@/src/lib/study-http";
import { StoreError } from "@/src/lib/study-store";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const body = await request.json() as HandleUploadBody;
    if (body.type !== "blob.generate-client-token") throw new StoreError("Transferência inválida.", 400);
    return NextResponse.json(await handleUpload({ request, body, onBeforeGenerateToken: async (pathname) => {
      if (!/^transfers\/[0-9a-f-]{36}\.json$/.test(pathname)) throw new StoreError("Transferência inválida.", 400);
      return { allowedContentTypes: ["application/json"], maximumSizeInBytes: 150 * 1024 * 1024, addRandomSuffix: false, allowOverwrite: false, validUntil: Date.now() + 15 * 60 * 1000 };
    } }));
  } catch (error) { return studyError(error); }
}
