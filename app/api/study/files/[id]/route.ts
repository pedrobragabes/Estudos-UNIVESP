import { readAttachment } from "@/src/lib/study-store";
import { studyError } from "@/src/lib/study-http";
export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const file = await readAttachment((await params).id);
    return new Response(new Blob([Buffer.from(file.data, "base64")]).stream(), { headers: {
      "Content-Type": file.type, "Content-Disposition": `${file.type.startsWith("image/") ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; sandbox",
    } });
  } catch (error) { return studyError(error); }
}
