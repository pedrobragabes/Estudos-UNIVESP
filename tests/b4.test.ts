import { describe, expect, it } from "vitest";
import katex from "katex";
import { currentTopics, currentSubjectIds, topics, allCards, allQuestions, legacyTopics } from "@/src/data/curriculum";
import { buildQuiz, initialStudyState, studySchema, scoreAttempt } from "@/src/domain/study";
import sources from "@/src/data/ava-sources.json";

describe("fourth bimester integration", () => {
  it("preserves historical IDs and adds seven weeks per current discipline", () => {
    expect(topics).toHaveLength(42);
    for (const old of legacyTopics) expect(topics.find((t) => t.id === old.id)).toEqual(old);
    for (const id of currentSubjectIds) expect(currentTopics.filter((t) => t.subjectId === id).map((t) => t.week)).toEqual([1,2,3,4,5,6,7]);
    for (const list of [topics, allCards, allQuestions]) expect(new Set(list.map((x) => x.id)).size).toBe(list.length);
  });
  it("keeps old personal state valid without converting AVA completion into learning", () => {
    const old = { ...initialStudyState, completedTopics: ["COM160-S1"], reviews: { "COM160-S1-c1": { due: "2026-09-17T00:00:00.000Z", interval: 2, repetitions: 1, lastRating: "good" as const } }, materials: [{id:"note",topicId:"COM210-S2",title:"Pessoal",text:"Preservar",createdAt:"2026-09-04T00:00:00.000Z"}] };
    expect(studySchema.parse(old)).toEqual(old);
    expect(currentTopics.every((t) => !old.completedTopics.includes(t.id))).toBe(true);
  });
  it("balances current mixed quizzes and preserves answer mappings", () => {
    const quiz = buildQuiz(currentTopics, "all", 15, [], () => 0.37);
    for (const id of currentSubjectIds) expect(quiz.filter((q) => q.topicId.startsWith(id))).toHaveLength(5);
    expect(quiz.every((q) => !q.topicId.startsWith("COM160"))).toBe(true);
    const attempt = {id:"b4",date:"2026-11-02T15:00:00.000Z",durationSeconds:10,questionIds:quiz.map((q) => q.id), answers:quiz.map((q) => allQuestions.find((original) => original.id === q.id)!.options.indexOf(q.options[q.correct]))};
    expect(scoreAttempt(attempt,allQuestions)).toBe(15);
    for (const q of allQuestions) expect(new Set(q.options).size).toBe(4);
  });
  it("has renderable formulas and traceable sources without credentials", () => {
    for (const topic of currentTopics) {
      expect(topic.lesson?.practice.length).toBeGreaterThanOrEqual(3);
      expect(sources.some((s) => s.subjectId === topic.subjectId && s.week === topic.week && s.status === "verified")).toBe(true);
      for (const f of topic.lesson?.formulas ?? []) expect(() => katex.renderToString(f.tex, {throwOnError:true, strict:"error",trust:false})).not.toThrow();
    }
    expect(JSON.stringify(sources)).not.toMatch(/sesskey=|[?&]code=|oauth|token=/i);
    expect(sources.filter((s) => s.kind === "quiz").every((s) => s.status === "partial")).toBe(true);
    expect(sources.some((s) => s.kind === "video" && s.status === "partial" && s.note.includes("Transcrição exportada"))).toBe(true);
    expect(sources.some((s) => s.kind === "lti" && s.status === "pending" && s.note.includes("recusou acesso"))).toBe(true);
  });
});
