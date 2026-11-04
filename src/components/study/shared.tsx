"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X, ArrowRight } from "lucide-react";
import { subjects, topics, currentSubjectIds } from "@/src/data/curriculum";
import type { StudyState } from "@/src/domain/study";

export type SaveStudy = (next: StudyState) => Promise<boolean>;
export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} className="s-dialog" aria-labelledby="dialog-title" onCancel={onClose}>
    <div className="s-dialog-heading"><h2 id="dialog-title">{title}</h2><button className="s-icon-button" onClick={onClose} aria-label="Fechar janela"><X size={20} /></button></div>{children}
  </dialog>;
}
export function CourseSelect({ value, onChange, all = true, allLabel = "Todas as disciplinas" }: { value: string; onChange: (value: string) => void; all?: boolean; allLabel?: string }) {
  return <label className="s-filter"><span>Disciplina</span><select value={value} onChange={(e) => onChange(e.target.value)}>{all && <option value="all">{allLabel}</option>}{[true, false].map((current) => <optgroup key={String(current)} label={current ? "4º bimestre · 2026" : "Acervo anterior · 3º bimestre"}>{subjects.filter((s) => currentSubjectIds.includes(s.id) === current).map((s) => <option key={s.id} value={s.id}>{s.id} · {s.short}</option>)}</optgroup>)}</select></label>;
}
export function TopicSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <label className="s-field">Matéria e semana<select value={value} onChange={(e) => onChange(e.target.value)}>{subjects.map((s) => <optgroup key={s.id} label={s.name}>{topics.filter((t) => t.subjectId === s.id).map((t) => <option key={t.id} value={t.id}>S{t.week} · {t.title}</option>)}</optgroup>)}</select></label>;
}
export function Empty({ title, children }: { title: string; children?: ReactNode }) { return <div className="s-empty"><h3>{title}</h3>{children}</div>; }
export function NextButton({ children, onClick }: { children: ReactNode; onClick: () => void }) { return <button className="s-button primary" onClick={onClick}>{children}<ArrowRight size={17} /></button>; }
export function formatDate(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }); }
export function formatTime(seconds: number) { return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`; }
