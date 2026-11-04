"use client";
import { useState } from "react";
import katex from "katex";
import hljs from "highlight.js/lib/core";
import java from "highlight.js/lib/languages/java";
import type { Topic } from "@/src/domain/study";
import sourceData from "@/src/data/ava-sources.json";
import audit from "@/src/data/ava-audit.json";
import { currentSubjects, currentTopics } from "@/src/data/curriculum";
hljs.registerLanguage("java", java);
const labels: Record<string, string> = { verified: "Conteúdo consultado", partial: "Análise parcial", pending: "Conteúdo pendente", excluded: "Administrativo" };
export function CodeBlock({ code }: { code: string }) {
  return <pre className="s-java"><code className="hljs language-java" dangerouslySetInnerHTML={{ __html: hljs.highlight(code, { language: "java" }).value }} /></pre>;
}
export function LessonContent({ topic }: { topic: Topic }) {
  const lesson = topic.lesson;
  if (!lesson) return null;
  return <section className="s-deep-lesson" aria-label="Estudo aprofundado">
    <h3>Objetivos de aprendizagem</h3><ul>{lesson.objectives.map((s) => <li key={s}>{s}</li>)}</ul>
    <p className="s-source-note">Explicações, exemplos e exercícios autorais, orientados pelas páginas oficiais, leituras da biblioteca e transcrições disponíveis. A cobertura e os limites de cada fonte estão identificados abaixo.</p>
    {lesson.sections.map((s) => <section key={s.title}><h3>{s.title}</h3>{s.body.map((p) => <p key={p}>{p}</p>)}{s.code && <CodeBlock code={s.code} />}</section>)}
    {lesson.formulas.length > 0 && <section><h3>Fórmulas e condições de uso</h3>{lesson.formulas.map((f) => <figure className="s-formula" key={f.tex}><div dangerouslySetInnerHTML={{ __html: katex.renderToString(f.tex, { displayMode: true, throwOnError: false, trust: false, output: "htmlAndMathml" }) }} /><figcaption>{f.meaning}</figcaption></figure>)}</section>}
    <section><h3>Prática com resolução comentada</h3><p>Tente resolver antes de abrir a resposta. Exercícios originais; não são respostas de atividades do AVA.</p>{lesson.practice.map((p, i) => <details className="s-practice" key={p.prompt}><summary>{i + 1}. {p.prompt}</summary><ol>{p.steps.map((s) => <li key={s}>{s}</li>)}</ol></details>)}</section>
    <section><h3>Revisão para a prova</h3><ul>{lesson.review.map((s) => <li key={s}>{s}</li>)}</ul><p>Explique cada ponto sem consultar. Use flashcards para recuperação ativa e o simulado para localizar dificuldades.</p></section>
    {lesson.readingNotes?.length ? <details className="s-reading-notes"><summary>Notas críticas sobre as fontes</summary>{lesson.readingNotes.map((s) => <p key={s}>{s}</p>)}</details> : null}
  </section>;
}
export function TopicSources({ topic }: { topic: Topic }) {
  const own = sourceData.filter((s) => s.subjectId === topic.subjectId && s.week === topic.week);
  const revision = sourceData.filter((s) => s.subjectId === topic.subjectId && s.section === "Revisão");
  return <details className="s-sources"><summary>Fontes, cobertura e pendências · {own.length} recursos</summary><p>{topic.subjectId} · semana {topic.week} · {topic.title}. Coleta em 02–03/11/2026. Recursos da semana verificados; consulte os limites de análise em cada registro. O progresso de aprendizagem é registrado separadamente.</p><SourceList items={own} /><details><summary>Revisão oficial da disciplina</summary><SourceList items={revision} /></details>
    {topic.subjectId === "COM230" && topic.week === 4 && <p>Complemento técnico: <a href="https://docs.oracle.com/javase/tutorial/java/generics/inheritance.html" target="_blank" rel="noreferrer">Oracle · generics e subtipos</a>.</p>}
    {topic.subjectId === "PES300" && topic.week === 5 && <p>Conferência complementar: <a href="https://www.itl.nist.gov/div898/handbook/apr/section1/apr165.htm" target="_blank" rel="noreferrer">NIST · distribuição gama</a>.</p>}
  </details>;
}
function SourceList({ items }: { items: typeof sourceData }) {
  return <ul className="s-source-list">{items.map((s) => <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a><span className={`s-source-status status-${s.status}`}>{s.kind} · {labels[s.status]}</span><p>{s.note}</p></li>)}</ul>;
}
export function SourcesView() {
  const [subject, setSubject] = useState("all");
  const [status, setStatus] = useState("all");
  const items = sourceData.filter((s) => (subject === "all" || s.subjectId === subject) && (status === "all" || s.status === status));
  return <><div className="s-page-intro"><div><span className="s-overline">ACERVO DO 4º BIMESTRE · 2026</span><h1>Fontes e cobertura</h1><p>O que foi consultado e o que ainda precisa de análise.</p></div></div>
    <div className="s-info">Três disciplinas · {audit.weeks} semanas e 3 seções de revisão verificadas · {audit.resourcesVisited} de {audit.resourcesIdentified} recursos visitados no AVA. As 3 pesquisas administrativas foram apenas identificadas. {audit.pdfs} PDFs tiveram texto extraído ({audit.pdfPages} páginas). Foram recuperadas {audit.transcripts} transcrições de {audit.videos} vídeos, além de trechos dos leitores da biblioteca. Extração textual não equivale à conferência visual integral.</div>
    <p className="s-warning">Limites de cobertura: um livro sem acesso, páginas ausentes ou vazias em alguns leitores, três vídeos complementares sem legendas, gravações das lives e revisão visual integral de figuras. Versões alternativas de acessibilidade não foram analisadas separadamente. Atividades foram verificadas sem iniciar ou enviar tentativas. Fóruns foram consultados sem esgotar respostas paginadas.</p>
    <div className="s-toolbar"><label className="s-filter"><span>Disciplina</span><select value={subject} onChange={(e) => setSubject(e.target.value)}><option value="all">Todas do 4º bimestre</option>{currentSubjects.map((s) => <option key={s.id} value={s.id}>{s.id} · {s.short}</option>)}</select></label><label className="s-filter"><span>Status de análise</span><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">Todos os status</option>{Object.entries(labels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label></div>
    <p>{items.length} registros no filtro. Um mesmo arquivo pode ser referenciado por mais de uma semana.</p><section className="s-panel"><SourceList items={items} /></section>
  </>;
}
export function DisciplineReview({ subjectId, onTopic, onQuiz }: { subjectId: string; onTopic: (id: string) => void; onQuiz: (subject: string) => void }) {
  const chosen = currentSubjects.filter((s) => subjectId === "all" || s.id === subjectId);
  if (!chosen.length) return null;
  return <details className="s-panel s-discipline-review"><summary>Revisão geral por disciplina · roteiro para a prova</summary>{chosen.map((s) => <section key={s.id}><h2>{s.id} · {s.short}</h2><p>Percorra os pontos abaixo sem consultar. Depois, resolva os exercícios da semana e use um simulado para conferir compreensão. Este roteiro é autoral e não prevê questões oficiais.</p>{currentTopics.filter((t) => t.subjectId === s.id).map((t) => <details className="s-practice" key={t.id}><summary>Semana {t.week} · {t.title}</summary><ul>{t.lesson!.review.map((r) => <li key={r}>{r}</li>)}</ul><p><strong>Erro para evitar:</strong> {t.pitfall}</p><button className="s-button secondary" onClick={() => onTopic(t.id)}>Abrir estudo desta semana</button></details>)}<button className="s-button primary" onClick={() => onQuiz(s.id)}>Treinar simulado de {s.id}</button></section>)}</details>;
}
