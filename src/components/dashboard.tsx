"use client";

import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  GraduationCap,
  Plus,
  TrendingUp,
} from "lucide-react";
import type { AcademicSnapshot, Activity, Discipline } from "@/src/domain/academic";
import {
  getActivityProgress,
  getDisciplineSummaries,
  getGradeAverage,
  getUpcomingActivities,
  isOverdue,
} from "@/src/domain/academic";
import { dueLabel, formatDateTime, kindLabels } from "./academic-ui";

type DashboardProps = {
  snapshot: AcademicSnapshot;
  onCreateActivity: () => void;
  onCreateDiscipline: () => void;
  onEditActivity: (activity: Activity) => void;
  onOpenActivities: () => void;
  onOpenDisciplines: () => void;
};

export function Dashboard({
  snapshot,
  onCreateActivity,
  onCreateDiscipline,
  onEditActivity,
  onOpenActivities,
  onOpenDisciplines,
}: DashboardProps) {
  const { activities, disciplines } = snapshot;
  const progress = getActivityProgress(activities);
  const average = getGradeAverage(activities);
  const overdue = activities.filter((activity) => isOverdue(activity)).length;
  const pending = activities.filter((activity) => activity.status !== "done").length;
  const upcoming = getUpcomingActivities(activities, 5);
  const summaries = getDisciplineSummaries(snapshot);

  if (disciplines.length === 0) {
    return (
      <section className="empty-onboarding" aria-labelledby="welcome-title">
        <div className="empty-visual" aria-hidden="true">
          <BookOpen size={42} />
        </div>
        <p className="eyebrow">Seu semestre começa aqui</p>
        <h2 id="welcome-title">Organize a UNIVESP sem carregar o passado.</h2>
        <p>
          Cadastre as disciplinas atuais e concentre atividades, notas, prazos e progresso
          em um painel simples.
        </p>
        <button className="button primary" type="button" onClick={onCreateDiscipline}>
          <Plus size={18} aria-hidden="true" />
          Adicionar primeira disciplina
        </button>
      </section>
    );
  }

  return (
    <div className="dashboard-grid">
      <section className="metric-grid" aria-label="Resumo acadêmico">
        <MetricCard
          label="Progresso geral"
          value={`${progress}%`}
          detail={`${activities.length - pending} de ${activities.length} concluídas`}
          icon={<TrendingUp size={20} />}
          tone="violet"
        />
        <MetricCard
          label="Média registrada"
          value={average === null ? "—" : average.toFixed(1)}
          detail={average === null ? "Adicione suas notas" : "Escala de 0 a 10"}
          icon={<GraduationCap size={20} />}
          tone="teal"
        />
        <MetricCard
          label="Pendências"
          value={String(pending)}
          detail={overdue > 0 ? `${overdue} em atraso` : "Tudo dentro do prazo"}
          icon={overdue > 0 ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
          tone={overdue > 0 ? "orange" : "blue"}
        />
      </section>

      <section className="panel upcoming-panel" aria-labelledby="upcoming-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Prioridades</p>
            <h2 id="upcoming-title">Próximos prazos</h2>
          </div>
          <button className="text-button" type="button" onClick={onOpenActivities}>
            Ver todas <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>

        {upcoming.length === 0 ? (
          <div className="inline-empty">
            <CheckCircle2 size={24} aria-hidden="true" />
            <div><strong>Nenhuma pendência.</strong><span>Você está em dia com este período.</span></div>
          </div>
        ) : (
          <div className="upcoming-list">
            {upcoming.map((activity) => (
              <ActivityRow
                key={activity.id}
                activity={activity}
                discipline={disciplines.find((item) => item.id === activity.disciplineId)}
                onEdit={() => onEditActivity(activity)}
              />
            ))}
          </div>
        )}

        <button className="add-row" type="button" onClick={onCreateActivity}>
          <Plus size={17} aria-hidden="true" /> Adicionar atividade
        </button>
      </section>

      <section className="panel disciplines-panel" aria-labelledby="disciplines-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Visão por matéria</p>
            <h2 id="disciplines-title">Disciplinas</h2>
          </div>
          <button className="text-button" type="button" onClick={onOpenDisciplines}>
            Gerenciar <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="discipline-summary-list">
          {summaries.map((discipline) => (
            <article className="discipline-summary" key={discipline.id}>
              <div className="discipline-mark" style={{ background: discipline.color }} aria-hidden="true" />
              <div className="discipline-summary-main">
                <div className="discipline-summary-title">
                  <div><h3>{discipline.name}</h3><span>{discipline.code || discipline.term}</span></div>
                  <strong>{discipline.progress}%</strong>
                </div>
                <div className="progress-track" aria-label={`${discipline.progress}% concluído`}>
                  <span style={{ width: `${discipline.progress}%`, background: discipline.color }} />
                </div>
                <div className="discipline-meta">
                  <span>{discipline.completedActivities}/{discipline.totalActivities} atividades</span>
                  <span>Média {discipline.average === null ? "—" : discipline.average.toFixed(1)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  tone: "violet" | "teal" | "orange" | "blue";
}) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-icon" aria-hidden="true">{icon}</div>
      <div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
    </article>
  );
}

function ActivityRow({
  activity,
  discipline,
  onEdit,
}: {
  activity: Activity;
  discipline?: Discipline;
  onEdit: () => void;
}) {
  const late = isOverdue(activity);
  return (
    <button className="activity-row" type="button" onClick={onEdit}>
      <span className="date-tile"><CalendarClock size={17} aria-hidden="true" /><small>{formatDateTime(activity.dueAt)}</small></span>
      <span className="activity-copy">
        <strong>{activity.title}</strong>
        <span><i style={{ background: discipline?.color }} />{discipline?.name ?? "Disciplina"} · {kindLabels[activity.kind]}</span>
      </span>
      <span className={`due-chip ${late ? "late" : ""}`}>{dueLabel(activity)}</span>
    </button>
  );
}
