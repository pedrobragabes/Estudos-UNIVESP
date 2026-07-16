import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Dados inválidos.",
        issues: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  console.error(error);
  return NextResponse.json(
    { error: "Não foi possível concluir a operação." },
    { status: 500 },
  );
}

export async function parseJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new ZodError([
      {
        code: "custom",
        path: [],
        message: "O corpo da requisição deve ser JSON válido.",
      },
    ]);
  }
}
