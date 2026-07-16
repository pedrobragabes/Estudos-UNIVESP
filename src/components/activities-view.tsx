"use client";

import { Check, Edit3, Filter, Plus, Search, Trash2 } from "lucide-react";
import type { AcademicSnapshot, Activity } from "@/src/domain/academic";
import { isOverdue } from "@/src/domain/academic";
import { dueLabel, formatDateTime, kindLabels, statusLabels } from "./academic-ui";

type ActivitiesViewProps = {
  snapshot: AcademicSnapshot;
  search: string;
  status: "all" | Activity["status"];
  disciplineId: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "all" | Activity["status"]) => void;
  onDisciplineChange: (value: string) => void;
  onCreate: () => void;
  onEdit: (activity: Activity) => void;
  onToggle: (activity: Activity) => void;
  onDelete: (activity: Activity) => void;
};

export function ActivitiesView(props: ActivitiesViewProps) {
  const {
    snapshot,
    search,
    status,
    disciplineId,
    onSearchChange,
    onStatusChange,
    onDisciplineChange,
    onCreate,
    onEdit,
    onToggle,
    onDelete,
  } = props;

  const activities = snapshot.activities.filter((activity) => {
    const matchesSearch = activity.title.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"));
    const matchesStatus = status === "all" || activity.status === status;
    const matchesDiscipline = disciplineId === "all" || activity.disciplineId === disciplineId;
    return matchesSearch && matchesStatus && matchesDiscipline;
  });

  return (
    <section aria-labelledby="activities-title">
      <div className="page-heading">
        <div><p className="eyebrow">Agenda acadêmica</p><h2 id="activities-title">Atividades</h2><p>Acompanhe entregas, avaliações e leituras do período.</p></div>
        <button className="button primary" type="button" onClick={onCreate} disabled={snapshot.disciplines.length === 0}><Plus size={18} aria-hidden="true" />Nova atividade</button>
      </div>

      <div className="filter-bar">
        <label className="search-field"><Search size={18} aria-hidden="true" /><span className="sr-only">Buscar atividades</span><input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Buscar atividade" /></label>
        <label className="filter-field"><Filter size={17} aria-hidden="true" /><span className="sr-only">Filtrar por status</span><select value={status} onChange={(event) => onStatusChange(event.target.value as ActivitiesViewProps["status"])}><option value="all">Todos os status</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="filter-field"><span className="sr-only">Filtrar por disciplina</span><select value={disciplineId} onChange={(event) => onDisciplineChange(event.target.value)}><option value="all">Todas as disciplinas</option>{snapshot.disciplines.map((discipline) => <option key={discipline.id} value={discipline.id}>{discipline.name}</option>)}</select></label>
      </div>

      {activities.length === 0 ? (
        <div className="panel empty-list"><Search size={28} aria-hidden="true" /><h3>Nenhuma atividade encontrada</h3><p>Ajuste os filtros ou adicione uma nova atividade.</p></div>
      ) : (
        <div className="activity-card-list">
          {activities.map((activity) => {
            const discipline = snapshot.disciplines.find((item) => item.id === activity.disciplineId);
            return (
              <article className={`activity-card ${activity.status === "done" ? "completed" : ""}`} key={activity.id}>
                <button className="check-button" type="button" onClick={() => onToggle(activity)} aria-label={activity.status === "done" ? `Reabrir ${activity.title}` : `Concluir ${activity.title}`}><Check size={18} aria-hidden="true" /></button>
                <div className="activity-card-main">
                  <div className="activity-card-title"><h3>{activity.title}</h3><span className={`status-badge ${activity.status}`}>{statusLabels[activity.status]}</span></div>
                  <div className="activity-card-meta"><span><i style={{ background: discipline?.color }} />{discipline?.name}</span><span>{kindLabels[activity.kind]}</span><time dateTime={activity.dueAt}>{formatDateTime(activity.dueAt)}</time></div>
                  {activity.notes && <p>{activity.notes}</p>}
                </div>
                <div className="activity-values">
                  <span className={`due-chip ${isOverdue(activity) ? "late" : ""}`}>{dueLabel(activity)}</span>
                  <span><small>Nota</small><strong>{activity.grade === null ? "—" : activity.grade.toFixed(1)}</strong></span>
                  <span><small>Peso</small><strong>{activity.weight === null ? "—" : `${activity.weight}%`}</strong></span>
                </div>
                <div className="card-actions">
                  <button className="icon-button" type="button" onClick={() => onEdit(activity)} aria-label={`Editar ${activity.title}`}><Edit3 size={17} aria-hidden="true" /></button>
                  <button className="icon-button danger" type="button" onClick={() => onDelete(activity)} aria-label={`Excluir ${activity.title}`}><Trash2 size={17} aria-hidden="true" /></button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
