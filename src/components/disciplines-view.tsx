"use client";

import { BookOpen, Edit3, Plus, Trash2 } from "lucide-react";
import type { AcademicSnapshot, Discipline } from "@/src/domain/academic";
import { getDisciplineSummaries } from "@/src/domain/academic";

type DisciplinesViewProps = {
  snapshot: AcademicSnapshot;
  onCreate: () => void;
  onEdit: (discipline: Discipline) => void;
  onDelete: (discipline: Discipline) => void;
};

export function DisciplinesView({ snapshot, onCreate, onEdit, onDelete }: DisciplinesViewProps) {
  const summaries = getDisciplineSummaries(snapshot);

  return (
    <section aria-labelledby="disciplines-page-title">
      <div className="page-heading">
        <div><p className="eyebrow">Seu período</p><h2 id="disciplines-page-title">Disciplinas</h2><p>Uma visão limpa das matérias que você realmente está cursando.</p></div>
        <button className="button primary" type="button" onClick={onCreate}><Plus size={18} aria-hidden="true" />Nova disciplina</button>
      </div>

      {summaries.length === 0 ? (
        <div className="panel empty-list"><BookOpen size={30} aria-hidden="true" /><h3>Nenhuma disciplina cadastrada</h3><p>Comece pelo período atual e deixe os semestres antigos para trás.</p><button className="button primary" type="button" onClick={onCreate}>Adicionar disciplina</button></div>
      ) : (
        <div className="discipline-card-grid">
          {summaries.map((discipline) => (
            <article className="discipline-card" key={discipline.id} style={{ "--discipline-color": discipline.color } as React.CSSProperties}>
              <header><span className="discipline-icon"><BookOpen size={20} aria-hidden="true" /></span><div className="card-actions"><button className="icon-button" type="button" onClick={() => onEdit(discipline)} aria-label={`Editar ${discipline.name}`}><Edit3 size={17} aria-hidden="true" /></button><button className="icon-button danger" type="button" onClick={() => onDelete(discipline)} aria-label={`Excluir ${discipline.name}`}><Trash2 size={17} aria-hidden="true" /></button></div></header>
              <div className="discipline-card-copy"><span>{discipline.code || "Sem código"} · {discipline.term}</span><h3>{discipline.name}</h3></div>
              <div className="discipline-stat-row"><div><small>Progresso</small><strong>{discipline.progress}%</strong></div><div><small>Média</small><strong>{discipline.average === null ? "—" : discipline.average.toFixed(1)}</strong></div><div><small>Atividades</small><strong>{discipline.totalActivities}</strong></div></div>
              <div className="progress-track" aria-label={`${discipline.progress}% concluído`}><span style={{ width: `${discipline.progress}%` }} /></div>
              <p>{discipline.completedActivities} de {discipline.totalActivities} atividades concluídas</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
