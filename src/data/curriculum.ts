import { subjects as legacySubjects, topics as legacyTopics, supportingLinks } from "./legacy-curriculum";
import { statisticsTopics } from "./b4/statistics";
import { innovationTopics } from "./b4/innovation";
import { javaTopics } from "./b4/java";
import { advancedJavaTopics } from "./b4/java-advanced";
import { withReadingAdditions } from "./b4/reading-additions";
export { legacySubjects, legacyTopics, supportingLinks };
export const currentSubjects = [
  { id: "PES300", name: "Estatística e Probabilidade", short: "Estatística e Probabilidade", color: "#b1a0ff", label: "Dados, modelos e inferência", focus: "Interprete antes de calcular.", source: "AVA UNIVESP · PES300 · turma 003 · 2026S2B2. Coleta em 02–03/11/2026; leituras e transcrições consultadas, com limites documentados nas fontes." },
  { id: "ADM200", name: "Gestão da Inovação e Desenvolvimento de Produtos", short: "Gestão da Inovação", color: "#79d4bd", label: "Estratégia, produtos e negócios", focus: "Relacione modelos e decisões.", source: "AVA UNIVESP · ADM200 · turma 003 · 2026S2B2. Coleta em 02–03/11/2026; leituras e transcrições consultadas, com limites documentados nas fontes." },
  { id: "COM230", name: "Programação Orientada a Objetos", short: "Programação Orientada a Objetos", color: "#f5bc76", label: "Java, abstração e implementação", focus: "Preveja, execute e explique.", source: "AVA UNIVESP · COM230 · turma 003 · 2026S2B2. Coleta em 02–03/11/2026; leituras e transcrições consultadas, com limites documentados nas fontes." },
] as const;
export const currentTopics = [...statisticsTopics, ...innovationTopics, ...javaTopics, ...advancedJavaTopics].map(withReadingAdditions);
export const subjects = [...currentSubjects, ...legacySubjects];
export const topics = [...currentTopics, ...legacyTopics];
export const currentSubjectIds: readonly string[] = currentSubjects.map((s) => s.id);
export const allCards = topics.flatMap((t) => t.cards);
export const allQuestions = topics.flatMap((t) => t.questions);
export const topicById = new Map(topics.map((t) => [t.id, t]));
