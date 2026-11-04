import { describe, expect, it } from "vitest";
// Historical scenarios continue to exercise the unchanged third-bimester bank.
import { allCards, allQuestions, topics } from "@/src/data/legacy-curriculum";
import { buildPlan, buildQuiz, daysUntil, initialStudyState as currentInitialStudyState, isDue, mistakeIds, scheduleReview, scoreAttempt, studySchema, type Attempt } from "@/src/domain/study";
const initialStudyState = { ...currentInitialStudyState, examDate: "2026-09-17" };

describe("study curriculum", () => {
  it("covers all 21 weeks with unique, complete study material", () => {
    expect(topics).toHaveLength(21); expect(allCards).toHaveLength(63); expect(allQuestions).toHaveLength(42);
    expect(new Set(allCards.map((c) => c.id)).size).toBe(allCards.length);
    expect(new Set(allQuestions.map((q) => q.id)).size).toBe(allQuestions.length);
    for (const subject of ["COM160", "COM200", "COM210"]) expect(topics.filter((t) => t.subjectId === subject).map((t) => t.week)).toEqual([1,2,3,4,5,6,7]);
    for (const q of allQuestions) { expect(q.options).toHaveLength(4); expect(new Set(q.options).size).toBe(4); expect(q.options[q.correct]).toBeTruthy(); }
  });
});
describe("exam plan", () => {
  it("counts calendar days without timezone shifts and handles the exam day", () => {
    expect(daysUntil("2026-09-17", "2026-09-04")).toBe(13);
    expect(buildPlan(topics, initialStudyState, "2026-09-17")).toEqual([]);
    expect(buildPlan(topics, initialStudyState, "2026-09-18")).toEqual([]);
    expect(daysUntil("2027-01-01", "2026-12-31")).toBe(1);
  });
  it("keeps every pending topic, preserves prerequisites and reserves the final two days", () => {
    const state = { ...initialStudyState, completedTopics: ["COM160-S1"] };
    const plan = buildPlan(topics, state, "2026-09-04");
    const sequence = plan.flatMap((day) => day.topics);
    expect(sequence).toHaveLength(20); expect(new Set(sequence.map((t) => t.id)).size).toBe(20);
    expect(sequence.some((t) => t.id === "COM160-S1")).toBe(false);
    for (const subject of ["COM160", "COM200", "COM210"]) { const weeks = sequence.filter((t) => t.subjectId === subject).map((t) => t.week); expect(weeks).toEqual([...weeks].sort((a, b) => a - b)); }
    expect(plan.slice(-2).map((d) => d.kind)).toEqual(["review", "review"]);
    expect(plan.at(-1)?.date).toBe("2026-09-16");
  });
  it("warns about overload instead of dropping topics when time is short", () => {
    const plan = buildPlan(topics, { ...initialStudyState, dailyMinutes: 30 }, "2026-09-16");
    expect(plan).toHaveLength(1); expect(plan[0].topics).toHaveLength(21); expect(plan[0].overloaded).toBe(true);
  });
  it("fits the initial plan into two hours a day without dropping review", () => {
    const plan = buildPlan(topics, initialStudyState, "2026-09-04");
    expect(plan.every((day) => day.minutes <= 120 && day.reviewMinutes >= 10)).toBe(true);
  });
  it("rejects impossible calendar dates", () => { expect(studySchema.safeParse({ ...initialStudyState, examDate: "2026-02-31" }).success).toBe(false); });
});
describe("spaced review", () => {
  const now = new Date("2026-09-04T15:00:00Z");
  it("returns forgotten cards in ten minutes and grows intervals only for recall", () => {
    const first = scheduleReview(undefined, "again", now);
    expect(first.due).toBe("2026-09-04T15:10:00.000Z"); expect(isDue(first, now)).toBe(false);
    expect(isDue(first, new Date("2026-09-04T15:10:00Z"))).toBe(true);
    const good = scheduleReview(first, "good", now); expect(good.interval).toBe(2);
    expect(scheduleReview(good, "good", now).interval).toBe(4);
    expect(scheduleReview(good, "hard", now).interval).toBe(1);
  });
});
describe("quiz grading and error notebook", () => {
  it("balances mixed exams, shuffles options and preserves the canonical correct answer", () => {
    const quiz = buildQuiz(topics, "all", 15, [], () => 0.37);
    expect(quiz).toHaveLength(15); expect(new Set(quiz.map((q) => q.id)).size).toBe(15);
    for (const subject of ["COM160", "COM200", "COM210"]) expect(quiz.filter((q) => q.topicId.startsWith(subject))).toHaveLength(5);
    for (const q of quiz) { const original = allQuestions.find((item) => item.id === q.id)!; expect(q.options[q.correct]).toBe(original.options[original.correct]); }
    const attempt: Attempt = { id: "test", date: "2026-09-04T15:00:00Z", durationSeconds: 123, questionIds: quiz.map((q) => q.id), answers: quiz.map((q) => allQuestions.find((item) => item.id === q.id)!.options.indexOf(q.options[q.correct])) };
    expect(scoreAttempt(attempt, allQuestions)).toBe(15);
  });
  it("counts blanks as errors and removes mistakes only after a later correct answer", () => {
    const q = allQuestions[0];
    const first: Attempt = { id: "one", date: "2026-09-04T15:00:00Z", durationSeconds: 10, questionIds: [q.id], answers: [null] };
    expect(scoreAttempt(first, allQuestions)).toBe(0); expect(mistakeIds([first], allQuestions)).toEqual([q.id]);
    const second = { ...first, id: "two", date: "2026-09-05T15:00:00Z", answers: [q.correct] };
    expect(mistakeIds([second, first], allQuestions)).toEqual([]);
    expect(buildQuiz(topics, "all", 15, [q.id])).toHaveLength(1);
  });
});
