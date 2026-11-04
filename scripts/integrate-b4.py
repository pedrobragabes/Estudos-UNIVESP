from pathlib import Path
root=Path(__file__).resolve().parents[1]
def edit(name, pairs):
    p=root/name;s=p.read_text(encoding='utf8')
    for old,new in pairs:
        if old not in s:raise ValueError(f'Missing expected text in {name}: {old[:80]}')
        s=s.replace(old,new)
    p.write_text(s,encoding='utf8')
edit('src/components/study/content.tsx',[
 ('import { CourseSelect,','import { LessonContent, TopicSources } from "./lesson";\nimport { CourseSelect,'),
 ('initialSubject === "all" ? "COM160"','initialSubject === "all" ? "PES300"'),
 ('material?.topicId ?? "COM160-S1"','material?.topicId ?? "PES300-S1"'),
 ('t.subjectId === subject && `${t.title} ${t.summary.join(" ")}`','(subject === "all" || t.subjectId === subject) && `${t.title} ${t.summary.join(" ")} ${JSON.stringify(t.lesson ?? {})}`'),
 ('<CourseSelect all={false}', '<CourseSelect'),
 ('<span>SEMANA {t.week}', '<span>{t.subjectId} · SEMANA {t.week}'),
 ('<div className="s-source-note">Revisão autoral inicial, baseada nos temas do roteiro enviado. Aulas e textos completos ainda não incorporados.</div>','<div className="s-source-note">{topic.lesson ? "Estudo autoral baseado nas páginas e PDFs oficiais consultados no AVA. Veja a cobertura e as pendências nas fontes." : "Revisão autoral inicial do 3º bimestre, baseada no roteiro enviado. Conteúdo anterior preservado."}</div>'),
 ('<h3>Veja na prática</h3><pre className="s-example">{topic.example}</pre>', '{topic.lesson ? <LessonContent topic={topic} /> : <><h3>Veja na prática</h3><pre className="s-example">{topic.example}</pre></>}'),
 ('<details className="s-sources"><summary>Origem e materiais de apoio</summary>', '{topic.lesson ? <TopicSources topic={topic} /> : <details className="s-sources"><summary>Origem e materiais de apoio</summary>'),
 ('{link.name} ↗</a>)}</details>', '{link.name} ↗</a>)}</details>}'),
])
edit('src/components/study/shared.tsx',[
 ('import { subjects, topics }','import { subjects, topics, currentSubjectIds }'),
 ('Todas as disciplinas</option>','4º bimestre · todas</option>'),
 ('{subjects.map((s) => <option key={s.id} value={s.id}>{s.id} · {s.short}</option>)}','{[true, false].map((current) => <optgroup key={String(current)} label={current ? "4º bimestre · 2026" : "Acervo anterior · 3º bimestre"}>{subjects.filter((s) => currentSubjectIds.includes(s.id) === current).map((s) => <option key={s.id} value={s.id}>{s.id} · {s.short}</option>)}</optgroup>)}'),
])
edit('src/components/study/flashcards.tsx',[
 ('allCards, topicById, topics','allCards, topicById, topics, currentSubjectIds'),
 ('initialTopic ?? "COM160-S1"','initialTopic ?? "PES300-S1"'),
 ('subject === "all" || c.topicId.startsWith(subject)','subject === "all" ? currentSubjectIds.includes(c.topicId.split("-")[0]) : c.topicId.startsWith(subject)'),
 ('subject === "all" || t.subjectId === subject','subject === "all" ? currentSubjectIds.includes(t.subjectId) : t.subjectId === subject'),
])
edit('src/components/study/quiz.tsx',[
 ('topics, subjects }','topics, subjects, currentTopics, currentSubjectIds }'),
 ('subject === "all" || q.topicId.startsWith(subject)','subject === "all" ? currentSubjectIds.includes(q.topicId.split("-")[0]) : q.topicId.startsWith(subject)'),
 ('buildQuiz(topics, subject,','buildQuiz(subject === "all" ? currentTopics : topics, subject,'),
 ('<option value={42}>','<option value={100}>'),
 ('Treino introdutório baseado nos temas enviados.','Treino autoral com base nos temas e materiais consultados; a cobertura está detalhada nas fontes.'),
])
edit('src/components/study/overview.tsx',[
 ('subjects, topics, allCards, allQuestions','currentSubjects as subjects, currentTopics as topics, allCards, allQuestions, currentSubjectIds, legacySubjects'),
 ('[...allCards, ...state.customCards].filter((c) => isDue', '[...allCards, ...state.customCards].filter((c) => currentSubjectIds.includes(c.topicId.split("-")[0])).filter((c) => isDue'),
 ('{state.completedTopics.length}<small> / 21</small>', '{topics.filter((t) => state.completedTopics.includes(t.id)).length}<small> / {topics.length}</small>'),
 ('3º bimestre · 2026','4º bimestre · 2026'),
 ('    <div className="s-bottom-grid">','    <details className="s-panel s-archive"><summary>Acervo anterior · 3º bimestre de 2026</summary><p>Conteúdos e registros anteriores preservados. Selecione uma disciplina para consultar resumos, cartões e simulados.</p>{legacySubjects.map((s) => <button className="s-button secondary" key={s.id} onClick={() => navigate("summaries", s.id)}>{s.id} · {s.short}</button>)}</details>\n    <div className="s-bottom-grid">'),
])
edit('src/components/study/study-app.tsx',[
 ('import { Quiz } from "./quiz";', 'import { Quiz } from "./quiz";\nimport { SourcesView } from "./lesson";'),
 ('| "materials";', '| "materials" | "sources";'),
 ('  { id: "materials", label:', '  { id: "sources", label: "Fontes e cobertura", icon: BookOpen },\n  { id: "materials", label:'),
 ('3º bimestre de 2026','4º bimestre de 2026'),
 ('          {view === "overview"', '          {view === "sources" && <SourcesView />}\n          {view === "overview"'),
])
edit('app/layout.tsx',[( 'import "./study.css";', 'import "./study.css";\nimport "katex/dist/katex.min.css";\nimport "highlight.js/styles/github-dark.css";')])
print('Integrated current curriculum; legacy content and persistent state preserved.')
