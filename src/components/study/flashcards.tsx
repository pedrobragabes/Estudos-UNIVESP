"use client";

import { useState, type FormEvent } from "react";
import { Layers, Plus, RotateCcw, Check, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { allCards, topicById, topics, currentSubjectIds } from "@/src/data/curriculum";
import { isDue, scheduleReview, type Card, type Review, type StudyState } from "@/src/domain/study";
import { CourseSelect, Empty, Modal, TopicSelect, type SaveStudy } from "./shared";

export function CardForm({ card, initialTopic, source, state, save, onClose }: { card?: Card; initialTopic?: string; source?: string; state: StudyState; save: SaveStudy; onClose: () => void }) {
  const [topicId, setTopic] = useState(card?.topicId ?? initialTopic ?? "PES300-S1");
  const [question, setQuestion] = useState(card?.question ?? ""); const [answer, setAnswer] = useState(card?.answer ?? "");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true);
    const next = { id: card?.id ?? crypto.randomUUID(), topicId, question: question.trim(), answer: answer.trim(), source: card?.source ?? source ?? "Cartão pessoal" };
    if (await save({ ...state, customCards: card ? state.customCards.map((c) => c.id === card.id ? next : c) : [...state.customCards, next] })) onClose();
    setBusy(false);
  }
  return <Modal title={card ? "Editar cartão" : "Criar flashcard"} onClose={() => { if (!busy) onClose(); }}><form className="s-form" onSubmit={(e) => void submit(e)}><fieldset disabled={busy}><TopicSelect value={topicId} onChange={setTopic} /><label className="s-field">Pergunta<input autoFocus required maxLength={2000} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Uma pergunta específica, que faça você lembrar" /></label><label className="s-field">Resposta<textarea required rows={6} maxLength={10000} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Resposta curta, com um exemplo se ajudar" /></label>{source && <p className="s-muted">Origem: {source}</p>}<div className="s-form-actions"><button type="button" className="s-button secondary" onClick={onClose}>Cancelar</button><button className="s-button primary" type="submit" disabled={!question.trim() || !answer.trim()}>{busy ? "Salvando..." : "Salvar cartão"}</button></div></fieldset></form></Modal>;
}

export function Flashcards({ state, save, saving, initialSubject, initialTopic, onAdd, onEdit }: { state: StudyState; save: SaveStudy; saving: boolean; initialSubject: string; initialTopic?: string; onAdd: () => void; onEdit: (card: Card) => void }) {
  const [subject, setSubject] = useState(initialTopic ? topicById.get(initialTopic)!.subjectId : initialSubject);
  const [topic, setTopic] = useState(initialTopic ?? "all");
  const [mode, setMode] = useState("due");
  const [session, setSession] = useState<Card[] | null>(null);
  const [deleting, setDeleting] = useState<Card>();
  const cards = [...allCards, ...state.customCards].filter((c) => (subject === "all" ? currentSubjectIds.includes(c.topicId.split("-")[0]) : c.topicId.startsWith(subject)) && (topic === "all" || c.topicId === topic) && (mode === "all" || (mode === "custom" ? state.customCards.some((custom) => custom.id === c.id) : isDue(state.reviews[c.id]))));
  return <>
    <div className="s-page-intro"><div><span className="s-overline">LEMBRAR É MELHOR QUE RELER</span><h1>Flashcards</h1><p>Tente responder antes de virar. Seja honesto com sua memória.</p></div><button className="s-button secondary" onClick={onAdd}><Plus size={17} />Criar cartão</button></div>
    {!session ? <>
      <div className="s-toolbar"><CourseSelect allLabel="4º bimestre · todas" value={subject} onChange={(value) => { setSubject(value); setTopic("all"); }} /><label className="s-filter"><span>Semana</span><select value={topic} onChange={(e) => setTopic(e.target.value)}><option value="all">Todas as semanas</option>{topics.filter((t) => subject === "all" ? currentSubjectIds.includes(t.subjectId) : t.subjectId === subject).map((t) => <option key={t.id} value={t.id}>{t.subjectId} · S{t.week} · {t.title}</option>)}</select></label></div>
      <div className="s-segmented" aria-label="Conjunto de cartões">{[["due", "Para revisar"], ["all", "Todos"], ["custom", "Meus cartões"]].map(([id, label]) => <button key={id} aria-pressed={mode === id} className={mode === id ? "active" : ""} onClick={() => setMode(id)}>{label}</button>)}</div>
      {cards.length ? <section className="s-card-start"><span className="s-study-icon"><Layers size={32} /></span><span className="s-overline">SESSÃO DE REVISÃO</span><h2>{cards.length} cartões esperando por você.</h2><p>Uma pergunta por vez. Os cartões esquecidos voltam em 10 minutos; os difíceis, amanhã; os lembrados, em pelo menos 2 dias.</p><button className="s-button primary" onClick={() => setSession(cards)}>Começar revisão<ArrowRight size={18} /></button><small>Cartões iniciais autorais · complementados pelos seus cartões</small></section> : <Empty title={mode === "due" ? "Tudo em dia neste filtro." : "Nenhum cartão neste filtro."}><p>{mode === "due" ? "Os cartões voltarão na próxima data de revisão. Você também pode praticar todos agora." : "Crie seu primeiro cartão ou escolha outra semana."}</p><button className="s-button secondary" onClick={() => mode === "due" ? setMode("all") : onAdd()}>{mode === "due" ? "Ver todos os cartões" : "Criar cartão"}</button></Empty>}
      {mode === "custom" && cards.length > 0 && <div className="s-custom-list">{cards.map((c) => <div className="s-panel" key={c.id}><div><span className="s-muted">{c.topicId.replace("-", " · ")}</span><h3>{c.question}</h3></div><button className="s-icon-button" onClick={() => onEdit(c)} aria-label={`Editar cartão: ${c.question}`}><Pencil size={17} /></button><button className="s-icon-button" onClick={() => setDeleting(c)} aria-label={`Excluir cartão: ${c.question}`}><Trash2 size={17} /></button></div>)}</div>}
    </> : <CardSession cards={session} state={state} save={save} saving={saving} onEnd={() => setSession(null)} />}
    {deleting && <Modal title="Excluir cartão?" onClose={() => setDeleting(undefined)}><p>A pergunta e seu histórico de revisão serão removidos.</p><div className="s-form-actions"><button className="s-button secondary" onClick={() => setDeleting(undefined)}>Cancelar</button><button className="s-button danger" disabled={saving} onClick={async () => { const reviews = { ...state.reviews }; delete reviews[deleting.id]; if (await save({ ...state, reviews, customCards: state.customCards.filter((c) => c.id !== deleting.id) })) setDeleting(undefined); }}>Excluir cartão</button></div></Modal>}
  </>;
}
function CardSession({ cards, state, save, saving, onEnd }: { cards: Card[]; state: StudyState; save: SaveStudy; saving: boolean; onEnd: () => void }) {
  const [index, setIndex] = useState(0); const [revealed, setRevealed] = useState(false);
  const card = cards[index];
  async function rate(rating: Review["lastRating"]) {
    if (await save({ ...state, reviews: { ...state.reviews, [card.id]: scheduleReview(state.reviews[card.id], rating) } })) { setRevealed(false); setIndex(index + 1); }
  }
  if (!card) return <Empty title="Sessão concluída."><p>Você revisou {cards.length} cartões. Suas próximas revisões estão agendadas.</p><button className="s-button primary" onClick={onEnd}>Voltar aos cartões<Check size={18} /></button></Empty>;
  return <div className="s-card-session"><div className="s-session-bar"><button className="s-text-button" disabled={saving} onClick={onEnd}>← Encerrar sessão</button><span>{index + 1} de {cards.length}</span></div><div className="s-track"><span style={{ width: `${index / cards.length * 100}%` }} /></div>
    <article className={`s-flashcard ${revealed ? "revealed" : ""}`}><span className="s-pill">{card.topicId.replace("-", " · ")}</span><span className="s-muted">{topicById.get(card.topicId)?.title}</span><h2>{card.question}</h2>{revealed ? <div className="s-card-answer"><span className="s-overline">RESPOSTA</span><p className="s-preserve">{card.answer}</p></div> : <button className="s-button primary" onClick={() => setRevealed(true)}><RotateCcw size={18} />Revelar resposta</button>}<small>{card.source}</small></article>
    {revealed && <div className="s-rating" aria-label="Como foi lembrar a resposta?"><button disabled={saving} onClick={() => void rate("again")}><strong>Não lembrei</strong><span>Rever em 10 min</span></button><button disabled={saving} onClick={() => void rate("hard")}><strong>Com dificuldade</strong><span>Rever amanhã</span></button><button disabled={saving} onClick={() => void rate("good")}><strong>Lembrei bem</strong><span>Rever em {Math.min(60, Math.max(2, (state.reviews[card.id]?.interval ?? 0) * 2))} dias</span></button></div>}
  </div>;
}
