import type { Lesson, SubjectId, Topic } from "@/src/domain/study";

export type WeekInput = Lesson & {
  title: string; summary: string[]; pitfall: string;
  cards: [string, string][];
  quiz: [string, string, string, string, string, string][];
};
export function week(subjectId: SubjectId, number: number, input: WeekInput): Topic {
  const id = `${subjectId}-S${number}`;
  const source = `Autoral · AVA UNIVESP ${subjectId}, semana ${number}, 2026S2B2. Fontes e pendências na seção de rastreabilidade.`;
  return { id, subjectId, week: number, title: input.title, minutes: subjectId === "COM230" && number === 7 ? 150 : 90,
    summary: input.summary, pitfall: input.pitfall, source,
    example: input.practice[0].steps.join("\n"),
    lesson: { objectives: input.objectives, sections: input.sections, formulas: input.formulas, practice: input.practice, review: input.review, readingNotes: input.readingNotes },
    cards: input.cards.map(([question, answer], i) => ({id:`${id}-c${i+1}`, topicId:id, question, answer, source})),
    questions: input.quiz.map(([prompt, correct, a, b, c, explanation], i) => ({id:`${id}-q${i+1}`,topicId:id,prompt,options:[correct,a,b,c],correct:0,explanation})),
  };
}
