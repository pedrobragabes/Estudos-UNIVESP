"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, Target, RotateCcw } from "lucide-react";
import { allQuestions, topicById, topics, subjects, currentTopics, currentSubjectIds } from "@/src/data/curriculum";
import { buildQuiz, mistakeIds, scoreAttempt, type Attempt, type Question, type StudyState } from "@/src/domain/study";
import { CourseSelect, Empty, formatTime, Modal, type SaveStudy } from "./shared";

export function Quiz({ state, save, initialSubject, onActive, onTopic }: { state: StudyState; save: SaveStudy; initialSubject: string; onActive: (active: boolean) => void; onTopic: (id: string) => void }) {
  const [subject, setSubject] = useState(initialSubject);
  const [count, setCount] = useState(15); const [mode, setMode] = useState("all");
  const [session, setSession] = useState<{ questions: Question[]; start: number; deadline: number }>();
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [index, setIndex] = useState(0); const [remaining, setRemaining] = useState(0);
  const [result, setResult] = useState<Attempt>(); const [saved, setSaved] = useState(true); const [savingResult, setSavingResult] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const ending = useRef(false);
  const questionScope = allQuestions.filter((q) => subject === "all" ? currentSubjectIds.includes(q.topicId.split("-")[0]) : q.topicId.startsWith(subject));
  const errors = mistakeIds(state.attempts, questionScope);
  const available = allQuestions.filter((q) => (subject === "all" ? currentSubjectIds.includes(q.topicId.split("-")[0]) : q.topicId.startsWith(subject)) && (mode === "all" || errors.includes(q.id)));
  const active = Boolean(session && !result);
  const unsaved = active || Boolean(result && !saved);
  useEffect(() => { onActive(unsaved); return () => onActive(false); }, [unsaved, onActive]);
  useEffect(() => {
    if (!unsaved) return;
    const guard = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", guard); return () => window.removeEventListener("beforeunload", guard);
  }, [unsaved]);
  async function storeResult(attempt: Attempt) {
    setSavingResult(true);
    const ok = state.attempts.some((a) => a.id === attempt.id) || await save({ ...state, attempts: [...state.attempts, attempt] });
    setSaved(ok); setSavingResult(false);
  }
  async function finish() {
    if (!session || ending.current) return;
    ending.current = true;
    const attempt: Attempt = { id: crypto.randomUUID(), date: new Date().toISOString(), questionIds: session.questions.map((q) => q.id), answers: answers.map((answer, i) => answer === null ? null : allQuestions.find((q) => q.id === session.questions[i].id)!.options.indexOf(session.questions[i].options[answer])), durationSeconds: Math.min(86400, Math.max(0, Math.round((Math.min(Date.now(), session.deadline) - session.start) / 1000))) };
    setConfirmEnd(false); setResult(attempt); setSaved(false); await storeResult(attempt);
  }
  const expire = useEffectEvent(() => { void finish(); });
  useEffect(() => {
    if (!active || !session) return;
    const timer = window.setInterval(() => { const left = Math.max(0, Math.ceil((session.deadline - Date.now()) / 1000)); setRemaining(left); if (!left) expire(); }, 500);
    return () => window.clearInterval(timer);
  }, [active, session]);
  function start() {
    const questions = buildQuiz(subject === "all" ? currentTopics : topics, subject, Math.min(count, available.length), mode === "errors" ? errors : []);
    if (!questions.length) return;
    ending.current = false; setResult(undefined); setSaved(true); setIndex(0); setAnswers(questions.map(() => null)); setRemaining(questions.length * 120);
    const now = Date.now(); setSession({ questions, start: now, deadline: now + questions.length * 120000 });
  }
  function reset() { setSession(undefined); setResult(undefined); ending.current = false; }
  if (result) return <>
    <div className="s-page-intro"><div><span className="s-overline">CORREÇÃO COMENTADA</span><h1>Transforme erros em revisão.</h1></div><button disabled={savingResult || !saved} className="s-button secondary" onClick={reset}>Voltar aos simulados</button></div>
    {!saved && <div className="s-warning" role="status">{savingResult ? "Salvando seu resultado..." : <>O resultado ainda não foi salvo. Mantenha esta página aberta.<button className="s-button secondary" onClick={() => void storeResult(result)}>Tentar salvar novamente</button></>}</div>}
    <QuizResult attempt={result} onTopic={onTopic} />
  </>;
  if (session) {
    const q = session.questions[index]; const answered = answers.filter((a) => a !== null).length;
    return <>
      <div className="s-page-intro"><div><span className="s-overline">TREINO SEM CONSULTA</span><h1>Simulado em andamento</h1></div><span className={`s-timer ${remaining < 60 ? "urgent" : ""}`} role="timer" aria-label="Tempo restante"><Clock3 size={19} />{formatTime(remaining)}</span></div>
      <div className="s-quiz-layout"><article className="s-question-panel"><div className="s-session-bar"><span className="s-pill">{q.topicId.replace("-", " · ")}</span><span>Questão {index + 1} de {session.questions.length}</span></div><h2>{q.prompt}</h2><fieldset className="s-options"><legend className="sr-only">Escolha uma resposta</legend>{q.options.map((option, i) => <label key={i} className={answers[index] === i ? "selected" : ""}><input type="radio" name={`question-${q.id}`} checked={answers[index] === i} onChange={() => setAnswers((old) => old.map((value, n) => n === index ? i : value))} /><span>{String.fromCharCode(65 + i)}</span><p>{option}</p></label>)}</fieldset><div className="s-quiz-controls"><button className="s-button secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}><ArrowLeft size={16} />Anterior</button>{index < session.questions.length - 1 ? <button className="s-button primary" onClick={() => setIndex(index + 1)}>Próxima<ArrowRight size={17} /></button> : <button className="s-button primary" onClick={() => setConfirmEnd(true)}>Finalizar simulado<Check size={17} /></button>}</div></article>
        <aside className="s-panel s-question-map"><h2>Suas respostas</h2><p>{answered} de {session.questions.length} respondidas</p><nav aria-label="Navegar entre questões">{session.questions.map((item, i) => <button aria-label={`Questão ${i + 1}${answers[i] !== null ? ", respondida" : ", em branco"}`} aria-current={i === index ? "step" : undefined} className={`${answers[i] !== null ? "answered" : ""} ${i === index ? "current" : ""}`} key={item.id} onClick={() => setIndex(i)}>{i + 1}</button>)}</nav><p>Você pode voltar e alterar respostas antes de finalizar. O tempo encerra o treino automaticamente.</p><button className="s-text-button" onClick={() => setConfirmEnd(true)}>Finalizar agora<ArrowRight size={15} /></button></aside>
      </div>
      {confirmEnd && <Modal title="Finalizar simulado?" onClose={() => setConfirmEnd(false)}><p>{answered === session.questions.length ? "Todas as questões foram respondidas. A correção será exibida em seguida." : `Você deixou ${session.questions.length - answered} questões em branco. Elas serão contadas como erro.`}</p><div className="s-form-actions"><button className="s-button secondary" onClick={() => setConfirmEnd(false)}>Continuar respondendo</button><button className="s-button primary" onClick={() => void finish()}>Finalizar e corrigir</button></div></Modal>}
    </>;
  }
  return <>
    <div className="s-page-intro"><div><span className="s-overline">PRATIQUE ANTES DA PROVA</span><h1>Simulados</h1><p>Teste sua compreensão e descubra onde concentrar a revisão.</p></div><span className="s-date-chip">{allQuestions.length} questões autorais</span></div>
    <div className="s-quiz-setup"><section className="s-panel"><h2>Monte seu treino</h2><CourseSelect allLabel="4º bimestre · todas" value={subject} onChange={setSubject} /><div className="s-segmented"><button aria-pressed={mode === "all"} className={mode === "all" ? "active" : ""} onClick={() => setMode("all")}>Todas as questões</button><button aria-pressed={mode === "errors"} className={mode === "errors" ? "active" : ""} onClick={() => setMode("errors")}>Caderno de erros · {errors.length}</button></div><label className="s-field">Quantidade de questões<select value={count} onChange={(e) => setCount(Number(e.target.value))}><option value={5}>5 questões</option><option value={10}>10 questões</option><option value={15}>15 questões</option><option value={100}>Banco completo do filtro</option></select></label><div className="s-quiz-summary"><span><Target size={19} />{Math.min(count, available.length)} questões disponíveis</span><span><Clock3 size={19} />{Math.min(count, available.length) * 2} min de treino</span></div><p className="s-muted">Questões e alternativas são embaralhadas. No treino misto, as disciplinas são distribuídas de forma equilibrada.</p><button className="s-button primary" disabled={!available.length} onClick={start}>Iniciar simulado<ArrowRight size={18} /></button>{!available.length && <p>{mode === "errors" ? "Nenhum erro pendente neste filtro. Selecione todas as questões para praticar." : "Nenhuma questão disponível."}</p>}</section><section className="s-panel s-quiz-guidance"><span className="s-study-icon"><Target size={27} /></span><h2>O erro mostra o próximo passo.</h2><p>Responda sem consultar o resumo. Ao terminar, leia a explicação e volte à semana correspondente.</p><div className="s-info">Treino autoral com base nos temas e materiais consultados; a cobertura está detalhada nas fontes. As perguntas e o limite de tempo são deste aplicativo; não representam o formato oficial da avaliação.</div><p>Uma questão sai do caderno de erros quando você a acerta em uma tentativa posterior.</p></section></div>
    <div className="s-section-title"><h2>Histórico de tentativas</h2><span>{state.attempts.length} realizadas</span></div>
    {!state.attempts.length ? <Empty title="Seu primeiro resultado aparece aqui."><p>Comece com 5 questões para ter um diagnóstico inicial.</p></Empty> : <div className="s-history">{[...state.attempts].reverse().map((attempt) => <button className="s-panel" key={attempt.id} onClick={() => { setResult(attempt); setSaved(true); }}><span><strong>{new Date(attempt.date).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</strong><small>{attempt.questionIds.length} questões · {formatTime(attempt.durationSeconds)}</small></span><span>{scoreAttempt(attempt, allQuestions)} / {attempt.questionIds.length} acertos</span><ArrowRight size={18} /></button>)}</div>}
  </>;
}
function QuizResult({ attempt, onTopic }: { attempt: Attempt; onTopic: (id: string) => void }) {
  const correct = scoreAttempt(attempt, allQuestions);
  return <>
    <section className="s-result-summary"><strong>{Math.round(correct / attempt.questionIds.length * 100)}<small>%</small></strong><div><h2>{correct} de {attempt.questionIds.length} acertos</h2><p>{formatTime(attempt.durationSeconds)} de prática · {new Date(attempt.date).toLocaleDateString("pt-BR")}</p></div><div className="s-result-subjects">{subjects.map((s) => { const ids = attempt.questionIds.map((id, i) => ({ q: allQuestions.find((q) => q.id === id), answer: attempt.answers[i] })).filter(({ q }) => q?.topicId.startsWith(s.id)); return ids.length > 0 && <span key={s.id}>{s.id}<strong>{ids.filter(({ q, answer }) => q?.correct === answer).length}/{ids.length}</strong></span>; })}</div></section>
    <div className="s-corrections">{attempt.questionIds.map((id, i) => {
      const q = allQuestions.find((q) => q.id === id); if (!q) return null;
      const right = attempt.answers[i] === q.correct;
      return <article key={id} className={`s-panel s-correction ${right ? "correct" : "wrong"}`}><div className="s-session-bar"><span>{q.topicId.replace("-", " · ")}</span><strong>{right ? "Acertou" : attempt.answers[i] === null ? "Em branco" : "Revisar"}</strong></div><h3>{i + 1}. {q.prompt}</h3>{!right && <p className="s-your-answer">Sua resposta: {attempt.answers[i] === null ? "Não respondida" : q.options[attempt.answers[i]!]}</p>}<p className="s-right-answer"><Check size={17} />{q.options[q.correct]}</p><p>{q.explanation}</p><button className="s-text-button" onClick={() => onTopic(q.topicId)}><RotateCcw size={15} />Revisar: {topicById.get(q.topicId)?.title}</button></article>;
    })}</div>
  </>;
}
