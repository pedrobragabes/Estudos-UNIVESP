export async function readApiJson(response: Response): Promise<unknown> {
  const value: unknown = await response.json();
  if (!response.ok) {
    const error = value && typeof value === "object" && "error" in value && typeof value.error === "string" ? value.error : "Não foi possível concluir a operação.";
    throw new Error(error);
  }
  return value;
}
export async function sendStudyJson(url: string, method: string, value: unknown) {
  let body = JSON.stringify(value);
  if (process.env.NEXT_PUBLIC_STUDY_CLOUD === "1" && new Blob([body]).size > 3 * 1024 * 1024) {
    const { upload } = await import("@vercel/blob/client");
    const result = await upload(`transfers/${crypto.randomUUID()}.json`, new Blob([body], { type: "application/json" }), { access: "private", handleUploadUrl: "/api/study/transfer", multipart: true, contentType: "application/json" });
    body = JSON.stringify({ transfer: result.pathname });
  }
  return fetch(url, { method, headers: { "Content-Type": "application/json" }, body });
}
