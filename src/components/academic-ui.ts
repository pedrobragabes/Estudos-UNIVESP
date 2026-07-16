import type { Activity } from "@/src/domain/academic";

export const kindLabels: Record<Activity["kind"], string> = {
  assignment: "Atividade",
  exam: "Prova",
  project: "Projeto",
  reading: "Leitura",
  other: "Outro",
};

export const statusLabels: Record<Activity["status"], string> = {
  pending: "Pendente",
  in_progress: "Em andamento",
  done: "Concluída",
};

export const disciplineColors = [
  "#5b5bd6",
  "#0f9f8f",
  "#e06c47",
  "#a855a7",
  "#2f80c9",
  "#ca8a04",
] as const;

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function toDateTimeLocal(value?: string) {
  const date = value ? new Date(value) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function daysUntil(value: string, now = new Date()) {
  const due = new Date(value);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(due.getFullYear(), due.getMonth(), due.getDate()).getTime();
  return Math.round((target - start) / 86_400_000);
}

export function dueLabel(activity: Activity) {
  if (activity.status === "done") return "Concluída";
  const days = daysUntil(activity.dueAt);
  if (days < 0) return `${Math.abs(days)}d em atraso`;
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  return `Em ${days} dias`;
}
