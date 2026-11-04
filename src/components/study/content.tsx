"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { z } from "zod";
import { readApiJson, sendStudyJson } from "@/src/lib/study-client";
import { ArrowRight, Check, FileText, Plus, Search, ImageIcon, Download, Trash2, Pencil, Layers, Paperclip } from "lucide-react";
import { subjects, topics, topicById, supportingLinks } from "@/src/data/curriculum";
import type { Material, StudyState } from "@/src/domain/study";
import { LessonContent, TopicSources, DisciplineReview } from "./lesson";
import { CourseSelect, Empty, Modal, TopicSelect, type SaveStudy } from "./shared";

export function Summaries({ state, save, saving, initialSubject, initialTopic, onCards, onQuiz }: { state: StudyState; save: SaveStudy; saving: boolean; initialSubject: string; initialTopic?: string; onCards: (topicId: string) => void; onQuiz: (subject: string) => void }) {
  const [subject, setSubject] = useState(initialTopic ? topicById.get(initialTopic)!.subjectId : initialSubject === "all" ? "PES300" : initialSubject);
  const [selected, setSelected] = useState(initialTopic ?? `${subject}-S1`);
  const [search, setSearch] = useState("");
  const filtered = topics.filter((t) => (subject === "all" || t.subjectId === subject) && `${t.title} ${t.summary.join(" ")} ${JSON.stringify(t.lesson ?? {})}`.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")));
  const topic = filtered.find((t) => t.id === selected) ?? filtered[0];
  const complete = topic && state.completedTopics.includes(topic.id);
  return <>
    <div className="s-page-intro"><div><span className="s-overline">ENTENDA O ESSENCIAL</span><h1>Resumos por semana</h1><p>Leia, refaça o exemplo e tente explicar sem olhar.</p></div></div>
    <div className="s-toolbar"><CourseSelect value={subject} onChange={(value) => { setSubject(value); setSelected(`${value}-S1`); }} /><label className="s-search"><Search size={18} /><input aria-label="Buscar nos resumos" placeholder="Buscar um conceito..." value={search} onChange={(e) => setSearch(e.target.value)} /></label></div>
    <DisciplineReview subjectId={subject} onTopic={(id) => { setSearch(""); setSubject(id.split("-")[0]); setSelected(id); }} onQuiz={onQuiz} />
    <div className="s-summary-layout"><nav className="s-week-list" aria-label="Semanas da disciplina">{filtered.map((t) => <button key={t.id} className={topic?.id === t.id ? "active" : ""} onClick={() => setSelected(t.id)}><span>{t.subjectId} · SEMANA {t.week}{state.completedTopics.includes(t.id) && <Check size={15} />}</span><strong>{t.title}</strong></button>)}</nav>
      {!topic ? <Empty title="Nenhum resumo encontrado"><p>Tente outro termo ou disciplina.</p></Empty> : <article className="s-lesson" key={topic.id}>
        <div className="s-lesson-head"><span className="s-pill">{topic.subjectId} · SEMANA {topic.week}</span><span className="s-muted">{topic.minutes} min com prática</span></div><h2>{topic.title}</h2>
        <div className="s-source-note">{topic.lesson ? "Estudo autoral baseado nas páginas e PDFs oficiais consultados no AVA. Veja a cobertura e as pendências nas fontes." : "Revisão autoral inicial do 3º bimestre, baseada no roteiro enviado. Conteúdo anterior preservado."}</div>
        <h3>O que você precisa entender</h3><ol className="s-concepts">{topic.summary.map((paragraph, i) => <li key={paragraph}><span>{String(i + 1).padStart(2, "0")}</span><p>{paragraph}</p></li>)}</ol>
        {topic.lesson ? <LessonContent topic={topic} /> : <><h3>Veja na prática</h3><pre className="s-example">{topic.example}</pre></>}<div className="s-pitfall"><strong>Atenção a esta diferença</strong><p>{topic.pitfall}</p></div>
        <details className="s-recall"><summary>Teste de memória: {topic.cards[0].question}</summary><p>{topic.cards[0].answer}</p></details>
        <div className="s-lesson-actions"><button disabled={saving} className={`s-button ${complete ? "secondary" : "primary"}`} onClick={() => void save({ ...state, completedTopics: complete ? state.completedTopics.filter((id) => id !== topic.id) : [...state.completedTopics, topic.id] })}><Check size={17} />{complete ? "Revisado · desfazer" : "Marcar como revisado"}</button><button className="s-button secondary" onClick={() => onCards(topic.id)}><Layers size={17} />Praticar cartões</button><button className="s-text-button" onClick={() => onQuiz(topic.subjectId)}>Simulado da matéria<ArrowRight size={16} /></button></div>
        {state.materials.some((m) => m.topicId === topic.id) && <section className="s-attached-notes"><h3>Seus materiais desta semana</h3>{state.materials.filter((m) => m.topicId === topic.id).map((m) => <details key={m.id}><summary>{m.title}</summary><p className="s-preserve">{m.text}</p>{m.fileId && <a href={`/api/study/files/${m.fileId}`} target="_blank" rel="noreferrer">Abrir {m.fileName}</a>}</details>)}</section>}
        {topic.lesson ? <TopicSources topic={topic} /> : <details className="s-sources"><summary>Origem e materiais de apoio</summary><p>{subjects.find((s) => s.id === topic.subjectId)!.source}</p><p>Os anexos enviados são os roteiros do curso, não os capítulos dos livros. Exemplos e questões deste app são autorais e introdutórios; não são questões oficiais nem previsão da prova.</p>{supportingLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.name} ↗</a>)}</details>}
      </article>}
    </div>
  </>;
}

async function uploadFile(file: File): Promise<{ id: string; name: string }> {
  if (file.size > 8 * 1024 * 1024) throw new Error("O limite por arquivo é 8 MB.");
  const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1]); reader.onerror = () => reject(new Error("Não foi possível ler o arquivo.")); reader.readAsDataURL(file); });
  const response = await sendStudyJson("/api/study/files", "POST", { name: file.name, type: file.type || (file.name.endsWith(".txt") ? "text/plain" : ""), data });
  return z.object({ id: z.string().uuid(), name: z.string() }).parse(await readApiJson(response));
}
export function MaterialForm({ material, state, save, onClose }: { material?: Material; state: StudyState; save: SaveStudy; onClose: () => void }) {
  const [topicId, setTopic] = useState(material?.topicId ?? "PES300-S1");
  const [title, setTitle] = useState(material?.title ?? "");
  const [text, setText] = useState(material?.text ?? "");
  const [file, setFile] = useState<File>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [attachment, setAttachment] = useState<{ id: string; name: string }>();
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (!text.trim() && !file && !material?.fileId) throw new Error("Escreva uma anotação ou anexe um arquivo.");
      const uploaded = attachment ?? (file ? await uploadFile(file) : undefined);
      if (uploaded) setAttachment(uploaded);
      const next: Material = { id: material?.id ?? crypto.randomUUID(), topicId, title: title.trim(), text: text.trim(), createdAt: material?.createdAt ?? new Date().toISOString(), fileId: uploaded?.id ?? material?.fileId, fileName: uploaded?.name ?? material?.fileName };
      if (await save({ ...state, materials: material ? state.materials.map((m) => m.id === material.id ? next : m) : [...state.materials, next] })) onClose();
      else setError("O material não foi salvo. Confira a mensagem do painel e tente novamente.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível guardar o material."); }
    finally { setBusy(false); }
  }
  return <Modal title={material ? "Editar material" : "Adicionar material"} onClose={() => { if (!busy) onClose(); }}><form className="s-form" onSubmit={(e) => void submit(e)}><fieldset disabled={busy}>
    <TopicSelect value={topicId} onChange={setTopic} /><label className="s-field">Título<input required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Aula 4 — colisões em tabelas hash" /></label>
    <label className="s-upload"><Paperclip size={23} /><strong>{file?.name ?? material?.fileName ?? "Anexar um print ou material"}</strong><span>PNG, JPG, WebP, PDF ou TXT · até 8 MB</span><input type="file" accept="image/png,image/jpeg,image/webp,application/pdf,text/plain" onChange={(e) => { setFile(e.target.files?.[0]); setAttachment(undefined); }} /></label>
    <label className="s-field">Conteúdo e anotações<textarea rows={7} maxLength={80000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Cole o texto da aula, um resumo ou suas dúvidas..." /></label><p className="s-muted">O anexo fica guardado como referência. A leitura de imagens e a geração de conteúdo por IA não são automáticas nesta versão. Use “Criar cartão” para registrar pergunta e resposta.</p>
    {error && <p role="alert" className="s-warning">{error}</p>}<div className="s-form-actions"><button type="button" className="s-button secondary" onClick={onClose}>Cancelar</button><button className="s-button primary" type="submit">{busy ? "Salvando..." : "Salvar material"}</button></div>
  </fieldset></form></Modal>;
}

export function Materials({ state, save, saving, onAdd, onEdit, onCard }: { state: StudyState; save: SaveStudy; saving: boolean; onAdd: () => void; onEdit: (material: Material) => void; onCard: (material: Material) => void }) {
  const [subject, setSubject] = useState("all"); const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<Material>();
  const materials = state.materials.filter((m) => (subject === "all" || m.topicId.startsWith(subject)) && `${m.title} ${m.text}`.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")));
  return <>
    <div className="s-page-intro"><div><span className="s-overline">SEU CONTEÚDO, ORGANIZADO</span><h1>Materiais de estudo</h1><p>Reúna prints, textos e anotações na semana certa.</p></div><button className="s-button primary" onClick={onAdd}><Plus size={18} />Adicionar material</button></div>
    <div className="s-toolbar"><CourseSelect value={subject} onChange={setSubject} /><label className="s-search"><Search size={18} /><input aria-label="Buscar materiais" placeholder="Buscar nos seus materiais..." value={search} onChange={(e) => setSearch(e.target.value)} /></label></div>
    {!materials.length ? <Empty title={state.materials.length ? "Nenhum material encontrado" : "Seu próximo print entra aqui."}><p>{state.materials.length ? "Experimente outra disciplina ou termo de busca." : "Escolha a matéria e a semana, anexe o conteúdo e registre suas anotações. Depois transforme o que importa em cartões."}</p><button className="s-button secondary" onClick={onAdd}><Plus size={17} />Adicionar meu primeiro material</button></Empty> : <div className="s-material-grid">{materials.map((m) => {
      const image = m.fileName && /\.(png|jpe?g|webp)$/i.test(m.fileName);
      return <article className="s-panel s-material-card" key={m.id}>{image && m.fileId && <a href={`/api/study/files/${m.fileId}`} target="_blank" rel="noreferrer"><Image unoptimized width={800} height={400} src={`/api/study/files/${m.fileId}`} alt={m.title} loading="lazy" /></a>}<span className="s-material-meta">{image ? <ImageIcon size={17} /> : <FileText size={17} />}{m.topicId.replace("-", " · ")}</span><h2>{m.title}</h2><p className="s-muted">{topicById.get(m.topicId)?.title}</p>{m.text && <details><summary>Ler anotações</summary><p className="s-preserve">{m.text}</p></details>}{m.fileId && <a className="s-text-button" href={`/api/study/files/${m.fileId}`} target="_blank" rel="noreferrer"><Download size={16} />Abrir arquivo</a>}<div className="s-material-actions"><button className="s-text-button" onClick={() => onCard(m)}><Plus size={16} />Criar cartão</button><button className="s-icon-button" onClick={() => onEdit(m)} aria-label={`Editar ${m.title}`}><Pencil size={16} /></button><button className="s-icon-button" onClick={() => setDeleting(m)} aria-label={`Excluir ${m.title}`}><Trash2 size={16} /></button></div></article>;
    })}</div>}
    {deleting && <Modal title="Excluir material?" onClose={() => setDeleting(undefined)}><p>“{deleting.title}” será removido dos materiais. Os cartões que você criou a partir dele serão mantidos.</p><div className="s-form-actions"><button className="s-button secondary" onClick={() => setDeleting(undefined)}>Cancelar</button><button disabled={saving} className="s-button danger" onClick={async () => { if (await save({ ...state, materials: state.materials.filter((m) => m.id !== deleting.id) })) setDeleting(undefined); }}>Excluir material</button></div></Modal>}
  </>;
}
