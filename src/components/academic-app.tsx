"use client";

import { useCallback, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import type {
  AcademicSnapshot,
  Activity,
  CreateActivityInput,
  CreateDisciplineInput,
  Discipline,
} from "@/src/domain/academic";
import { getCurrentTerm } from "@/src/domain/academic";
import { ActivitiesView } from "./activities-view";
import { Dashboard } from "./dashboard";
import { DisciplinesView } from "./disciplines-view";
import { ActivityForm, DisciplineForm } from "./forms";

type View = "dashboard" | "activities" | "disciplines";
type ModalState =
  | { type: "discipline"; item?: Discipline }
  | { type: "activity"; item?: Activity }
  | null;

const navigation: Array<{ id: View; label: string; icon: React.ReactNode }> = [
  { id: "dashboard", label: "Visão geral", icon: <LayoutDashboard size={19} /> },
  { id: "activities", label: "Atividades", icon: <CalendarDays size={19} /> },
  { id: "disciplines", label: "Disciplinas", icon: <BookOpen size={19} /> },
];

export function AcademicApp({ initialSnapshot }: { initialSnapshot: AcademicSnapshot }) {
  const [snapshot, setSnapshot] = useState<AcademicSnapshot | null>(initialSnapshot);
  const [view, setView] = useState<View>("dashboard");
  const [modal, setModal] = useState<ModalState>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Activity["status"]>("all");
  const [disciplineFilter, setDisciplineFilter] = useState("all");
  const currentTerm = getCurrentTerm();

  const loadSnapshot = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/overview", { cache: "no-store" });
      const body = (await response.json()) as AcademicSnapshot & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Não foi possível carregar seus dados.");
      setSnapshot(body);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível carregar seus dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function request(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown) {
    const response = await fetch(path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? "Não foi possível concluir a operação.");
    }
  }

  async function saveDiscipline(input: CreateDisciplineInput) {
    await request(
      modal?.type === "discipline" && modal.item ? `/api/disciplines/${modal.item.id}` : "/api/disciplines",
      modal?.type === "discipline" && modal.item ? "PATCH" : "POST",
      input,
    );
    setModal(null);
    await loadSnapshot();
  }

  async function saveActivity(input: CreateActivityInput) {
    await request(
      modal?.type === "activity" && modal.item ? `/api/activities/${modal.item.id}` : "/api/activities",
      modal?.type === "activity" && modal.item ? "PATCH" : "POST",
      input,
    );
    setModal(null);
    await loadSnapshot();
  }

  async function toggleActivity(activity: Activity) {
    await request(`/api/activities/${activity.id}`, "PATCH", {
      status: activity.status === "done" ? "pending" : "done",
    });
    await loadSnapshot();
  }

  async function deleteActivity(activity: Activity) {
    if (!window.confirm(`Excluir a atividade “${activity.title}”?`)) return;
    await request(`/api/activities/${activity.id}`, "DELETE");
    await loadSnapshot();
  }

  async function deleteDiscipline(discipline: Discipline) {
    if (!window.confirm(`Excluir “${discipline.name}” e todas as atividades vinculadas?`)) return;
    await request(`/api/disciplines/${discipline.id}`, "DELETE");
    await loadSnapshot();
  }

  function navigate(next: View) {
    setView(next);
    setMobileMenu(false);
  }

  const canCreateActivity = Boolean(snapshot?.disciplines.length);
  const activeTitle = navigation.find((item) => item.id === view)?.label ?? "Visão geral";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <div className="brand"><span><GraduationCap size={24} aria-hidden="true" /></span><div><strong>Estudos</strong><small>UNIVESP</small></div></div>
        <button className="sidebar-close" type="button" onClick={() => setMobileMenu(false)} aria-label="Fechar menu"><X size={21} /></button>
        <nav aria-label="Navegação principal">
          {navigation.map((item) => (
            <button key={item.id} className={view === item.id ? "active" : ""} type="button" onClick={() => navigate(item.id)} aria-current={view === item.id ? "page" : undefined}><span aria-hidden="true">{item.icon}</span>{item.label}</button>
          ))}
        </nav>
        <div className="semester-card"><span>Período atual</span><strong>{currentTerm}</strong><small>{snapshot?.disciplines.length ?? 0} disciplinas ativas</small></div>
        <p className="sidebar-footer">Um semestre de cada vez.</p>
      </aside>
      {mobileMenu && <button className="sidebar-backdrop" type="button" onClick={() => setMobileMenu(false)} aria-label="Fechar menu" />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-title"><button className="mobile-menu-button" type="button" onClick={() => setMobileMenu(true)} aria-label="Abrir menu"><Menu size={22} /></button><div><span>Período {currentTerm}</span><h1>{activeTitle}</h1></div></div>
          <button className="button primary" type="button" onClick={() => canCreateActivity ? setModal({ type: "activity" }) : setModal({ type: "discipline" })}><Plus size={18} aria-hidden="true" />{canCreateActivity ? "Nova atividade" : "Nova disciplina"}</button>
        </header>

        <div className="content-area">
          {loading && <LoadingState />}
          {!loading && error && <ErrorState message={error} onRetry={loadSnapshot} />}
          {!loading && !error && snapshot && view === "dashboard" && (
            <Dashboard snapshot={snapshot} onCreateActivity={() => setModal({ type: "activity" })} onCreateDiscipline={() => setModal({ type: "discipline" })} onEditActivity={(item) => setModal({ type: "activity", item })} onOpenActivities={() => navigate("activities")} onOpenDisciplines={() => navigate("disciplines")} />
          )}
          {!loading && !error && snapshot && view === "activities" && (
            <ActivitiesView snapshot={snapshot} search={search} status={statusFilter} disciplineId={disciplineFilter} onSearchChange={setSearch} onStatusChange={setStatusFilter} onDisciplineChange={setDisciplineFilter} onCreate={() => setModal({ type: "activity" })} onEdit={(item) => setModal({ type: "activity", item })} onToggle={(item) => void toggleActivity(item)} onDelete={(item) => void deleteActivity(item)} />
          )}
          {!loading && !error && snapshot && view === "disciplines" && (
            <DisciplinesView snapshot={snapshot} onCreate={() => setModal({ type: "discipline" })} onEdit={(item) => setModal({ type: "discipline", item })} onDelete={(item) => void deleteDiscipline(item)} />
          )}
        </div>
      </main>

      {modal?.type === "discipline" && <DisciplineForm key={modal.item?.id ?? "new-discipline"} discipline={modal.item} currentTerm={currentTerm} onClose={() => setModal(null)} onSave={saveDiscipline} />}
      {modal?.type === "activity" && snapshot && <ActivityForm key={modal.item?.id ?? "new-activity"} activity={modal.item} disciplines={snapshot.disciplines} onClose={() => setModal(null)} onSave={saveActivity} />}
    </div>
  );
}

function LoadingState() {
  return <div className="loading-state" aria-busy="true" aria-label="Carregando dados acadêmicos"><div className="skeleton skeleton-heading" /><div className="skeleton-grid"><div className="skeleton" /><div className="skeleton" /><div className="skeleton" /></div><div className="skeleton skeleton-panel" /></div>;
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => Promise<void> }) {
  return <section className="panel error-state" role="alert"><RefreshCw size={28} aria-hidden="true" /><h2>Não foi possível abrir seu painel</h2><p>{message}</p><button className="button primary" type="button" onClick={() => void onRetry()}><RefreshCw size={17} aria-hidden="true" />Tentar novamente</button></section>;
}
