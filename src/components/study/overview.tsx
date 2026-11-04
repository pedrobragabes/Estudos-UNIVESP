"use client";

import { ArrowRight, BookOpen, Check, Clock3, Layers, ListChecks, Target, CalendarDays } from "lucide-react";
import { currentSubjects as subjects, currentTopics as topics, allCards, allQuestions, currentSubjectIds, legacySubjects } from "@/src/data/curriculum";
import { buildPlan, daysUntil, isDue, mistakeIds, scoreAttempt, type StudyState } from "@/src/domain/study";
import { formatDate } from "./shared";
import type { StudyView } from "./study-app";

export function Overview({ state, navigate, openTopic }: { state: StudyState; navigate: (view: StudyView, subject?: string) => void; openTopic: (id: string) => void }) {
  const days = daysUntil(state.examDate);
  const plan = buildPlan(topics, state);
  const today = plan[0];
  const reviewBlock = Math.floor((today?.topics.length ? today.reviewMinutes : 30) / 2);
  const pending = topics.find((t) => !state.completedTopics.includes(t.id));
  const next = today?.topics[0] ?? pending;
  const due = [...allCards, ...state.customCards].filter((c) => currentSubjectIds.includes(c.topicId.split("-")[0])).filter((c) => isDue(state.reviews[c.id])).length;
  const currentQuestions = topics.flatMap((t) => t.questions);
  const mistakes = mistakeIds(state.attempts, currentQuestions).length;
  const last = state.attempts.filter((a) => a.questionIds.some((id) => currentQuestions.some((q) => q.id === id))).at(-1);
  return <>
    <div className="s-page-intro"><div><span className="s-overline">SEU PLANO, UM DIA DE CADA VEZ</span><h1>Vamos começar.</h1><p>Três matérias. Um próximo passo possível.</p></div><span className="s-date-chip"><CalendarDays size={17} />Prova · {formatDate(state.examDate)}</span></div>
    <div className="s-overview-top">
      <section className="s-focus-panel">
        <div className="s-focus-top"><span className="s-pill"><span className="s-status-dot" /> FOCO DE HOJE</span><span><Clock3 size={16} />{state.dailyMinutes} min disponíveis</span></div>
        <div className="s-focus-main"><span className="s-muted">{next ? `${next.subjectId} · Semana ${next.week}` : "Revisão final"}</span><h2>{next ? next.title : "Consolide o que você aprendeu."}</h2><p>{next ? "Leia o resumo, explique com suas palavras e teste o que ficou." : "Reveja os cartões e refaça as questões em que teve dificuldade."}</p></div>
        <div className="s-focus-bottom"><button className="s-button primary" onClick={() => next ? openTopic(next.id) : navigate("quiz")}>{state.completedTopics.length ? "Continuar estudando" : "Começar pelo resumo"}<ArrowRight size={18} /></button><span>{next ? `${next.minutes} min · leitura e prática` : "Simulado misto"}</span></div>
      </section>
      <section className="s-countdown"><div className="s-overline">ATÉ A PROVA</div><div className="s-big-number">{Math.max(0, days).toString().padStart(2, "0")}<span>dias</span></div><p>{days > 0 ? `${Math.round(days * state.dailyMinutes / 60)} horas no seu plano até ${formatDate(state.examDate)}.` : days === 0 ? "A prova é hoje. Priorize uma revisão leve." : "A data passou. Ajuste a próxima prova no plano."}</p><button className="s-text-button" onClick={() => navigate("plan")}>Ver meu plano<ArrowRight size={16} /></button></section>
    </div>
    <div className="s-metrics">
      <button onClick={() => navigate("summaries")}><span className="s-metric-icon purple"><BookOpen size={20} /></span><span><strong>{topics.filter((t) => state.completedTopics.includes(t.id)).length}<small> / {topics.length}</small></strong><span>semanas revisadas</span></span></button>
      <button onClick={() => navigate("cards")}><span className="s-metric-icon mint"><Layers size={20} /></span><span><strong>{due}</strong><span>cartões para revisar</span></span></button>
      <button onClick={() => navigate("quiz")}><span className="s-metric-icon peach"><Target size={20} /></span><span><strong>{last ? `${Math.round(scoreAttempt(last, allQuestions) / last.questionIds.length * 100)}%` : "—"}</strong><span>{last ? "no último simulado" : "faça seu primeiro simulado"}</span></span></button>
    </div>
    <div className="s-section-title"><h2>Suas disciplinas</h2><span>4º bimestre · 2026</span></div>
    <div className="s-course-grid">{subjects.map((s, i) => {
      const done = topics.filter((t) => t.subjectId === s.id && state.completedTopics.includes(t.id)).length;
      return <button className={`s-course-card course-${i}`} key={s.id} onClick={() => navigate("summaries", s.id)}>
        <div className="s-course-top"><span>{s.id}</span><span className="s-course-symbol" aria-hidden="true">{i === 0 ? "{ }" : i === 1 ? "</>" : "01"}</span></div>
        <h3>{s.short}</h3><p>{s.label}</p><div className="s-course-progress"><span>{done} de 7 semanas revisadas</span><span>{Math.round(done / 7 * 100)}%</span></div><div className="s-track"><span style={{ width: `${done / 7 * 100}%`, background: s.color }} /></div><div className="s-course-bottom">Estudar matéria<ArrowRight size={17} /></div>
      </button>;
    })}</div>
    <details className="s-panel s-archive"><summary>Acervo anterior · 3º bimestre de 2026</summary><p>Conteúdos e registros anteriores preservados. Selecione uma disciplina para consultar resumos, cartões e simulados.</p>{legacySubjects.map((s) => <button className="s-button secondary" key={s.id} onClick={() => navigate("summaries", s.id)}>{s.id} · {s.short}</button>)}</details>
    <div className="s-bottom-grid">
      <section className="s-panel"><div className="s-section-title"><h2>Roteiro de hoje</h2><ListChecks size={19} /></div><div className="s-checklist"><div><span>01</span><p><strong>Revisão ativa</strong><small>{reviewBlock} min · tente lembrar antes de revelar os cartões</small></p><button className="s-icon-button" onClick={() => navigate("cards")} aria-label="Abrir flashcards"><ArrowRight size={18} /></button></div><div><span>02</span><p><strong>{today?.topics.length ? today.topics.map((t) => `${t.subjectId} S${t.week}`).join(" + ") : "Revisar pontos de dificuldade"}</strong><small>{today?.topics.length ? `${today.topics.reduce((sum, t) => sum + t.minutes, 0)} min estimados · resumo e exemplos` : "Use o caderno de erros para escolher o foco"}</small></p><button className="s-icon-button" onClick={() => next ? openTopic(next.id) : navigate("quiz")} aria-label="Abrir conteúdo do dia"><ArrowRight size={18} /></button></div><div><span>03</span><p><strong>Teste sem consultar</strong><small>{reviewBlock} min · responda e entenda os erros</small></p><button className="s-icon-button" onClick={() => navigate("quiz")} aria-label="Abrir simulados"><ArrowRight size={18} /></button></div></div>{today?.overloaded && <p className="s-warning">O conteúdo estimado de hoje ultrapassa seu tempo. Veja os ajustes no plano.</p>}</section>
      <section className="s-panel s-learning-note"><span className="s-note-icon"><Check size={20} /></span><h2>Seu progresso começa aqui.</h2><p>Os percentuais do AVA não são uma medida de aprendizado. Aqui, você registra o que revisou e acompanha seus acertos.</p><button className="s-text-button" onClick={() => navigate("quiz")}>{mistakes ? `Revisar ${mistakes} questões com erro` : "Descobrir o que já sei"}<ArrowRight size={16} /></button></section>
    </div>
  </>;
}

export function Plan({ state, onSettings, openTopic }: { state: StudyState; onSettings: () => void; openTopic: (id: string) => void }) {
  const plan = buildPlan(topics, state);
  const overloaded = plan.some((d) => d.overloaded);
  return <>
    <div className="s-page-intro"><div><span className="s-overline">ATÉ {formatDate(state.examDate).toUpperCase()}</span><h1>Um plano para a prova.</h1><p>{state.dailyMinutes} minutos por dia. O roteiro se ajusta às semanas que você conclui.</p></div><button className="s-button secondary" onClick={onSettings}>Ajustar data e tempo</button></div>
    <div className="s-info">Nos dias de conteúdo, reserve de 5 a 15 min para flashcards e de 5 a 15 min para questões, conforme o tempo restante após os resumos e exemplos. Os dois últimos dias, quando disponíveis, ficam para simulados e revisão de erros. Tempos são estimativas, não uma previsão de domínio.</div>
    {overloaded && <p className="s-warning">O conteúdo pendente não cabe integralmente no tempo disponível. Comece pelas maiores dificuldades e ajuste o tempo diário se puder. Nenhuma semana foi ocultada do plano.</p>}
    {!plan.length ? <div className="s-empty"><h2>{daysUntil(state.examDate) === 0 ? "Hoje é dia de prova." : "Escolha sua próxima data de prova."}</h2><p>Você pode continuar usando resumos, cartões e simulados.</p><button className="s-button secondary" onClick={onSettings}>Ajustar data</button></div> : <div className="s-plan-list">{plan.map((day, i) => <section className={`s-plan-day ${i === 0 ? "today" : ""}`} key={day.date}><div className="s-plan-date"><span>{i === 0 ? "HOJE" : new Date(`${day.date}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "short" })}</span><strong>{formatDate(day.date)}</strong></div><div><h2>{day.kind === "learn" ? "Aprender e praticar" : "Simulado e revisão de erros"}</h2>{day.topics.length ? <div className="s-plan-topics">{day.topics.map((t) => <button key={t.id} onClick={() => openTopic(t.id)}><span>{t.subjectId} · S{t.week}</span>{t.title}<ArrowRight size={15} /></button>)}</div> : <p>Faça um simulado misto, releia as explicações dos erros e revise os cartões. Na véspera, priorize uma revisão leve.</p>}<span className={day.overloaded ? "s-warning-text" : "s-muted"}>{day.minutes} min {day.overloaded ? "· acima do tempo diário" : "· incluindo revisão"}</span></div></section>)}</div>}
  </>;
}
