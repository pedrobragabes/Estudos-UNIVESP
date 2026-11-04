"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { BookOpen, CalendarDays, Check, ChevronRight, Download, FolderOpen, GraduationCap, LayoutDashboard, Layers, Menu, Settings2, Target, Upload, X, RefreshCw } from "lucide-react";
import { studySchema, type Card, type Material, type StudyState } from "@/src/domain/study";
import { Overview, Plan } from "./overview";
import { Materials, MaterialForm, Summaries } from "./content";
import { CardForm, Flashcards } from "./flashcards";
import { Quiz } from "./quiz";
import { SourcesView } from "./lesson";
import { Modal } from "./shared";
import { readApiJson, sendStudyJson } from "@/src/lib/study-client";

export type StudyView = "overview" | "plan" | "summaries" | "cards" | "quiz" | "materials" | "sources";
const navigation = [
  { id: "overview", label: "Meu painel", icon: LayoutDashboard },
  { id: "plan", label: "Plano de estudo", icon: CalendarDays },
  { id: "summaries", label: "Resumos", icon: BookOpen },
  { id: "cards", label: "Flashcards", icon: Layers },
  { id: "quiz", label: "Simulados", icon: Target },
  { id: "sources", label: "Fontes e cobertura", icon: BookOpen },
  { id: "materials", label: "Meus materiais", icon: FolderOpen },
] as const;
type Editor = { type: "material"; item?: Material } | { type: "card"; item?: Card; topicId?: string; source?: string } | { type: "settings" } | null;

export function StudyApp() {
  const [state, setState] = useState<StudyState | null>(null);
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const [saving, setSaving] = useState(false); const savingRef = useRef(false);
  const [view, setView] = useState<StudyView>("overview"); const [subject, setSubject] = useState("all");
  const [topic, setTopic] = useState<string>(); const [viewKey, setViewKey] = useState(0);
  const [mobile, setMobile] = useState(false); const [editor, setEditor] = useState<Editor>(null);
  const [activeQuiz, setActiveQuiz] = useState(false);
  function load() {
    return fetch("/api/study", { cache: "no-store" }).then(readApiJson)
      .then((result) => setState(studySchema.parse(result)))
      .catch((cause: unknown) => setError(cause instanceof Error ? cause.message : "Não foi possível carregar os dados."))
      .finally(() => setLoading(false));
  }
  useEffect(() => { void load(); }, []);
  useEffect(() => {
    if (!saving) return;
    const guard = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", guard); return () => window.removeEventListener("beforeunload", guard);
  }, [saving]);
  async function save(next: StudyState): Promise<boolean> {
    if (savingRef.current) return false;
    savingRef.current = true; setSaving(true); setError("");
    try {
      const response = await sendStudyJson("/api/study", "PUT", next);
      const result = await readApiJson(response);
      setState(studySchema.parse(result)); return true;
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível salvar. Tente novamente."); return false; }
    finally { savingRef.current = false; setSaving(false); }
  }
  function navigate(next: StudyView, nextSubject = "all", nextTopic?: string) {
    if (savingRef.current) return;
    if (activeQuiz && !window.confirm("Sair do simulado? As respostas desta tentativa ainda não foram salvas.")) return;
    setView(next); setSubject(nextSubject); setTopic(nextTopic); setViewKey((key) => key + 1); setMobile(false);
  }
  function openTopic(id: string) { navigate("summaries", id.split("-")[0], id); }
  return <div className="study-app">
    <a className="s-skip" href="#study-main">Ir para o conteúdo</a>
    <aside className={`s-sidebar ${mobile ? "open" : ""}`}>
      <Link href="/" className="s-brand" aria-label="Estudos UNIVESP, início"><span><GraduationCap size={25} /></span><div><strong>estudos<span>.</span></strong><small>UNIVESP</small></div></Link>
      <button className="s-close-menu s-icon-button" onClick={() => setMobile(false)} aria-label="Fechar menu"><X size={20} /></button>
      <div className="s-sidebar-label">SEU ESPAÇO DE ESTUDO</div><nav aria-label="Navegação principal">{navigation.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? "active" : ""} aria-current={view === id ? "page" : undefined} onClick={() => navigate(id)}><Icon size={19} /><span>{label}</span>{id === "materials" && state && state.materials.length > 0 && <small>{state.materials.length}</small>}</button>)}</nav>
      <div className="s-sidebar-bottom"><div className="s-period"><span className="s-status-dot" /><span>4º bimestre de 2026</span><small>Engenharia da Computação</small></div><button className="s-settings-button" disabled={!state || activeQuiz} onClick={() => setEditor({ type: "settings" })}><Settings2 size={18} />Preferências e backup</button><Link className="s-legacy-link" href="/organizador">Organizador de notas e prazos<ChevronRight size={14} /></Link><div className="s-profile"><span>EU</span><div><strong>Meu espaço pessoal</strong><small>{process.env.NEXT_PUBLIC_STUDY_CLOUD === "1" ? "Dados salvos na nuvem" : "Dados salvos neste computador"}</small></div></div></div>
    </aside>
    {mobile && <button className="s-backdrop" aria-label="Fechar menu" onClick={() => setMobile(false)} />}
    <div className="s-workspace"><header className="s-topbar"><div><button className="s-mobile-toggle s-icon-button" aria-label="Abrir menu" onClick={() => setMobile(true)}><Menu size={22} /></button><span>Engenharia da Computação</span><ChevronRight size={14} /><strong>{navigation.find((n) => n.id === view)?.label}</strong></div><div><span className="s-save-status" role="status">{saving ? <><RefreshCw size={14} />Salvando...</> : state ? <><Check size={14} />Salvo localmente</> : ""}</span><span className="s-avatar" aria-label="Espaço pessoal">EU</span></div></header>
      <main id="study-main" className="s-main" tabIndex={-1}>
        {error && <div className="s-error" role="alert"><span>{error}</span><button className="s-button secondary" onClick={() => { if (!state || window.confirm("Recarregar os dados salvos? Alterações não salvas desta tela podem ser perdidas.")) { setEditor(null); setLoading(true); setError(""); void load(); } }}>Recarregar dados</button></div>}
        {loading ? <div className="s-loading" role="status"><GraduationCap size={35} /><p>Abrindo seu espaço de estudo...</p></div> : state && <>
          {view === "sources" && <SourcesView />}
          {view === "overview" && <Overview state={state} navigate={navigate} openTopic={openTopic} />}
          {view === "plan" && <Plan state={state} onSettings={() => setEditor({ type: "settings" })} openTopic={openTopic} />}
          {view === "summaries" && <Summaries key={viewKey} state={state} save={save} saving={saving} initialSubject={subject} initialTopic={topic} onCards={(id) => navigate("cards", id.split("-")[0], id)} onQuiz={(s) => navigate("quiz", s)} />}
          {view === "cards" && <Flashcards key={viewKey} state={state} save={save} saving={saving} initialSubject={subject} initialTopic={topic} onAdd={() => setEditor({ type: "card", topicId: topic })} onEdit={(item) => setEditor({ type: "card", item })} />}
          {view === "quiz" && <Quiz key={viewKey} state={state} save={save} initialSubject={subject} onActive={setActiveQuiz} onTopic={openTopic} />}
          {view === "materials" && <Materials state={state} save={save} saving={saving} onAdd={() => setEditor({ type: "material" })} onEdit={(item) => setEditor({ type: "material", item })} onCard={(m) => setEditor({ type: "card", topicId: m.topicId, source: `Material pessoal: ${m.title}` })} />}
          <footer className="s-footer"><span>Feito para estudar, um conceito por vez.</span><span>Projeto pessoal · sem vínculo oficial com a UNIVESP</span></footer>
        </>}
      </main>
    </div>
    {state && editor?.type === "material" && <MaterialForm material={editor.item} state={state} save={save} onClose={() => setEditor(null)} />}
    {state && editor?.type === "card" && <CardForm card={editor.item} initialTopic={editor.topicId} source={editor.source} state={state} save={save} onClose={() => setEditor(null)} />}
    {state && editor?.type === "settings" && <Settings state={state} save={save} onRestored={(next) => { setState(next); setError(""); setEditor(null); navigate("overview"); }} onClose={() => setEditor(null)} />}
  </div>;
}

function Settings({ state, save, onRestored, onClose }: { state: StudyState; save: (next: StudyState) => Promise<boolean>; onRestored: (state: StudyState) => void; onClose: () => void }) {
  const [date, setDate] = useState(state.examDate); const [minutes, setMinutes] = useState(state.dailyMinutes);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const [backup, setBackup] = useState<{ format: string; state: StudyState; files: unknown[] }>();
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); if (await save({ ...state, examDate: date, dailyMinutes: minutes })) onClose(); setBusy(false); }
  async function exportBackup() {
    setBusy(true); setError("");
    try { const response = await fetch("/api/study/backup"); if (!response.ok) await readApiJson(response); const url = URL.createObjectURL(await response.blob()); const link = document.createElement("a"); link.href = url; link.download = `estudos-univesp-${new Date().toISOString().slice(0, 10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível exportar."); } finally { setBusy(false); }
  }
  async function readBackup(file?: File) {
    setError(""); setBackup(undefined); if (!file) return;
    try { if (file.size > 150 * 1024 * 1024) throw new Error("O limite de backup é 150 MB."); const input = JSON.parse(await file.text()); if (input.format !== "univesp-study-backup-v1" || !Array.isArray(input.files)) throw new Error("Este arquivo não é um backup compatível."); setBackup({ format: input.format, state: studySchema.parse(input.state), files: input.files }); }
    catch { setError("Arquivo inválido. Selecione um backup JSON exportado por este aplicativo, de até 150 MB."); }
  }
  async function restore() {
    setBusy(true); setError("");
    try { const response = await sendStudyJson("/api/study/backup", "POST", { backup, revision: state.revision }); onRestored(studySchema.parse(await readApiJson(response))); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível restaurar."); } finally { setBusy(false); }
  }
  return <Modal title="Preferências e backup" onClose={() => { if (!busy) onClose(); }}><form className="s-form" onSubmit={(e) => void submit(e)}><fieldset disabled={busy}><div className="s-field-row"><label className="s-field">Data da prova<input type="date" required value={date} onChange={(e) => setDate(e.target.value)} /></label><label className="s-field">Minutos por dia<input type="number" required min={30} max={480} step={1} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} /></label></div><button className="s-button primary" type="submit">Salvar preferências<Check size={16} /></button></fieldset></form>
    <section className="s-backup"><h3>Uma cópia de segurança dos seus estudos</h3><p>Inclui progresso, cartões pessoais, anotações, resultados e todos os anexos. {process.env.NEXT_PUBLIC_STUDY_CLOUD === "1" ? "Os dados ficam salvos na sua conta, mesmo se você limpar o navegador ou trocar de computador." : "Os dados ficam no computador que está executando o app, mesmo se você limpar o navegador."}</p><div className="s-form-actions"><button className="s-button secondary" disabled={busy} onClick={() => void exportBackup()}><Download size={17} />Exportar backup</button><label className={`s-button secondary ${busy ? "disabled" : ""}`}><Upload size={17} />Importar backup<input className="sr-only" type="file" disabled={busy} accept="application/json,.json" onChange={(e) => void readBackup(e.target.files?.[0])} /></label></div>
    {backup && <div className="s-restore-confirm"><strong>Restaurar esta cópia?</strong><p>{backup.state.completedTopics.length} semanas revisadas · {backup.state.customCards.length} cartões pessoais · {backup.state.materials.length} materiais · {backup.state.attempts.length} simulados.</p><p>Isso substitui seus registros atuais. Exporte uma cópia antes de continuar se quiser preservá-los.</p><button className="s-button danger" disabled={busy} onClick={() => void restore()}>Restaurar e substituir dados</button><button className="s-text-button" disabled={busy} onClick={() => setBackup(undefined)}>Cancelar importação</button></div>}
    {busy && <p role="status">Processando...</p>}{error && <p className="s-warning" role="alert">{error}</p>}</section>
  </Modal>;
}
