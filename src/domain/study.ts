import { z } from "zod";

export const subjectIds = ["COM160", "COM200", "COM210", "PES300", "ADM200", "COM230"] as const;
export type SubjectId = (typeof subjectIds)[number];
export type Card = { id: string; topicId: string; question: string; answer: string; source: string };
export type Question = { id: string; topicId: string; prompt: string; options: string[]; correct: number; explanation: string };
export type Lesson = {
  objectives: string[];
  sections: { title: string; body: string[]; code?: string }[];
  formulas: { tex: string; meaning: string }[];
  practice: { prompt: string; steps: string[] }[];
  review: string[];
  readingNotes?: string[];
};
export type Topic = {
  id: string; subjectId: SubjectId; week: number; title: string; minutes: number;
  summary: string[]; example: string; pitfall: string; source: string;
  cards: Card[]; questions: Question[];
  lesson?: Lesson;
};

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((s) => {
  const d = new Date(`${s}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}, "Data inválida");
const idSchema = z.string().min(1).max(100).regex(/^[\w-]+$/);
const text = (max: number) => z.string().trim().min(1).max(max);
export const cardSchema = z.object({ id: idSchema, topicId: idSchema, question: text(2000), answer: text(10000), source: text(300) });
export const materialSchema = z.object({
  id: idSchema, topicId: idSchema, title: text(200), text: z.string().max(80000),
  fileId: z.string().uuid().optional(), fileName: z.string().max(250).optional(),
  createdAt: z.string().datetime(),
});
export type Material = z.infer<typeof materialSchema>;
export const reviewSchema = z.object({ due: z.string().datetime(), interval: z.number().int().min(0).max(60), repetitions: z.number().int().min(0).max(100000), lastRating: z.enum(["again", "hard", "good"]) });
export type Review = z.infer<typeof reviewSchema>;
export const attemptSchema = z.object({
  id: idSchema, date: z.string().datetime(), questionIds: z.array(idSchema).min(1).max(100),
  answers: z.array(z.number().int().min(0).max(9).nullable()).max(100),
  durationSeconds: z.number().int().min(0).max(86400),
}).refine((a) => a.questionIds.length === a.answers.length, "Respostas incompletas");
export type Attempt = z.infer<typeof attemptSchema>;
export const studySchema = z.object({
  version: z.literal(1), revision: z.number().int().nonnegative(),
  examDate: dateSchema, dailyMinutes: z.number().int().min(30).max(480),
  completedTopics: z.array(idSchema).max(1000),
  reviews: z.record(idSchema, reviewSchema),
  customCards: z.array(cardSchema).max(3000),
  materials: z.array(materialSchema).max(1000),
  attempts: z.array(attemptSchema).max(1000),
});
export type StudyState = z.infer<typeof studySchema>;
export const initialStudyState: StudyState = { version: 1, revision: 0, examDate: "2026-11-12", dailyMinutes: 120, completedTopics: [], reviews: {}, customCards: [], materials: [], attempts: [] };

export function localDate(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
export function daysUntil(date: string, today = localDate()): number {
  return Math.round((Date.parse(`${date}T12:00:00Z`) - Date.parse(`${today}T12:00:00Z`)) / 86400000);
}
export function addDays(date: string, days: number) {
  return new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
}
export function scheduleReview(previous: Review | undefined, rating: Review["lastRating"], now = new Date()): Review {
  const interval = rating === "again" ? 0 : rating === "hard" ? 1 : Math.min(60, Math.max(2, (previous?.interval ?? 0) * 2));
  return { interval, repetitions: (previous?.repetitions ?? 0) + 1, lastRating: rating, due: new Date(now.getTime() + (rating === "again" ? 10 * 60000 : interval * 86400000)).toISOString() };
}
export function isDue(review: Review | undefined, now = new Date()) { return !review || Date.parse(review.due) <= now.getTime(); }
export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}

export function buildQuiz(topics: Topic[], subject: string, count: number, mistakes: string[] = [], random = Math.random): Question[] {
  const pool = topics.filter((t) => subject === "all" || t.subjectId === subject).flatMap((t) => t.questions).filter((q) => !mistakes.length || mistakes.includes(q.id));
  // Round-robin prevents a mixed exam from accidentally omitting a subject.
  const groups = subjectIds.map((id) => shuffle(pool.filter((q) => q.topicId.startsWith(id)), random));
  const result: Question[] = [];
  while (result.length < count && groups.some((g) => g.length)) {
    for (const group of shuffle(groups, random)) { const q = group.pop(); if (q && result.length < count) result.push(q); }
  }
  return shuffle(result, random).map((q) => {
    const indices = shuffle(q.options.map((_, i) => i), random);
    return { ...q, options: indices.map((i) => q.options[i]), correct: indices.indexOf(q.correct) };
  });
}
export function scoreAttempt(attempt: Attempt, questions: Question[]) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  return attempt.questionIds.reduce((score, id, i) => score + (byId.has(id) && attempt.answers[i] === byId.get(id)!.correct ? 1 : 0), 0);
}
export function mistakeIds(attempts: Attempt[], questions: Question[]) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const latest = new Map<string, boolean>();
  for (const attempt of [...attempts].sort((a, b) => a.date.localeCompare(b.date))) {
    attempt.questionIds.forEach((id, i) => { if (byId.has(id)) latest.set(id, attempt.answers[i] !== byId.get(id)!.correct); });
  }
  return [...latest].filter(([, wrong]) => wrong).map(([id]) => id);
}
export type PlanDay = { date: string; kind: "learn" | "review"; topics: Topic[]; minutes: number; reviewMinutes: number; overloaded: boolean };
export function buildPlan(topics: Topic[], state: StudyState, today = localDate()): PlanDay[] {
  const remainingDays = Math.max(0, Math.min(90, daysUntil(state.examDate, today)));
  if (!remainingDays) return [];
  const pending = topics.filter((t) => !state.completedTopics.includes(t.id));
  const learningDays = Math.max(1, remainingDays - Math.min(2, remainingDays - 1));
  const days: PlanDay[] = Array.from({ length: remainingDays }, (_, i) => ({ date: addDays(today, i), kind: i < learningDays ? "learn" : "review", topics: [], minutes: 0, reviewMinutes: 30, overloaded: false }));
  // Interleave subjects, preserving prerequisite order within each discipline.
  const ordered = [...pending].sort((a, b) => a.week - b.week || a.subjectId.localeCompare(b.subjectId));
  ordered.forEach((topic, index) => {
    // Keep the interleaved sequence chronological so a later week never
    // appears on an earlier day than its prerequisites.
    const day = days[Math.min(learningDays - 1, Math.floor(index * learningDays / ordered.length))];
    day.topics.push(topic); day.minutes += topic.minutes;
  });
  return days.map((day) => {
    const reviewMinutes = Math.min(30, Math.max(10, state.dailyMinutes - day.minutes));
    return { ...day, kind: day.topics.length ? "learn" : "review", minutes: day.topics.length ? day.minutes + reviewMinutes : state.dailyMinutes, reviewMinutes: day.topics.length ? reviewMinutes : state.dailyMinutes, overloaded: day.topics.length > 0 && day.minutes + reviewMinutes > state.dailyMinutes };
  });
}
