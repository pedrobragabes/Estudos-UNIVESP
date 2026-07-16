"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type {
  Activity,
  CreateActivityInput,
  CreateDisciplineInput,
  Discipline,
} from "@/src/domain/academic";
import {
  disciplineColors,
  kindLabels,
  statusLabels,
  toDateTimeLocal,
} from "./academic-ui";

type ModalProps = {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({ title, description, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <header className="modal-header">
          <div>
            <h2 id="modal-title">{title}</h2>
            <p id="modal-description">{description}</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar">
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}

type DisciplineFormProps = {
  discipline?: Discipline;
  currentTerm: string;
  onClose: () => void;
  onSave: (input: CreateDisciplineInput) => Promise<void>;
};

export function DisciplineForm({ discipline, currentTerm, onClose, onSave }: DisciplineFormProps) {
  const [name, setName] = useState(discipline?.name ?? "");
  const [code, setCode] = useState(discipline?.code ?? "");
  const [term, setTerm] = useState(discipline?.term ?? currentTerm);
  const [color, setColor] = useState(discipline?.color ?? disciplineColors[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({ name, code, term, color });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar.");
      setSaving(false);
    }
  }

  return (
    <Modal
      title={discipline ? "Editar disciplina" : "Nova disciplina"}
      description="Cadastre apenas as disciplinas do período atual."
      onClose={onClose}
    >
      <form className="form-grid" onSubmit={submit}>
        <label className="field field-wide">
          <span>Nome da disciplina</span>
          <input autoFocus required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Engenharia de Software" />
        </label>
        <label className="field">
          <span>Código</span>
          <input maxLength={20} value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ex.: COM200" />
        </label>
        <label className="field">
          <span>Período</span>
          <input required value={term} onChange={(event) => setTerm(event.target.value)} placeholder="2026.2" />
        </label>
        <fieldset className="color-field field-wide">
          <legend>Cor</legend>
          <div className="color-options">
            {disciplineColors.map((option) => (
              <label key={option} className="color-option" style={{ "--option-color": option } as React.CSSProperties}>
                <input type="radio" name="color" value={option} checked={color === option} onChange={() => setColor(option)} />
                <span aria-hidden="true" />
                <span className="sr-only">Cor {option}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {error && <p className="form-error field-wide" role="alert">{error}</p>}
        <div className="modal-actions field-wide">
          <button className="button secondary" type="button" onClick={onClose}>Cancelar</button>
          <button className="button primary" type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar disciplina"}</button>
        </div>
      </form>
    </Modal>
  );
}

type ActivityFormProps = {
  activity?: Activity;
  disciplines: Discipline[];
  onClose: () => void;
  onSave: (input: CreateActivityInput) => Promise<void>;
};

export function ActivityForm({ activity, disciplines, onClose, onSave }: ActivityFormProps) {
  const [disciplineId, setDisciplineId] = useState(activity?.disciplineId ?? disciplines[0]?.id ?? "");
  const [title, setTitle] = useState(activity?.title ?? "");
  const [kind, setKind] = useState<Activity["kind"]>(activity?.kind ?? "assignment");
  const [dueAt, setDueAt] = useState(toDateTimeLocal(activity?.dueAt));
  const [status, setStatus] = useState<Activity["status"]>(activity?.status ?? "pending");
  const [weight, setWeight] = useState(activity?.weight?.toString() ?? "");
  const [grade, setGrade] = useState(activity?.grade?.toString() ?? "");
  const [notes, setNotes] = useState(activity?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave({
        disciplineId,
        title,
        kind,
        dueAt: new Date(dueAt).toISOString(),
        status,
        weight: weight === "" ? null : Number(weight),
        grade: grade === "" ? null : Number(grade),
        notes,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar.");
      setSaving(false);
    }
  }

  return (
    <Modal
      title={activity ? "Editar atividade" : "Nova atividade"}
      description="Registre a entrega, o prazo e a nota em um único lugar."
      onClose={onClose}
    >
      <form className="form-grid" onSubmit={submit}>
        <label className="field field-wide">
          <span>Título</span>
          <input autoFocus required minLength={2} maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Projeto Integrador — Entrega 1" />
        </label>
        <label className="field">
          <span>Disciplina</span>
          <select required value={disciplineId} onChange={(event) => setDisciplineId(event.target.value)}>
            {disciplines.map((discipline) => <option key={discipline.id} value={discipline.id}>{discipline.name}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Tipo</span>
          <select value={kind} onChange={(event) => setKind(event.target.value as Activity["kind"])}>
            {Object.entries(kindLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Prazo</span>
          <input required type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} />
        </label>
        <label className="field">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as Activity["status"])}>
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Peso (%)</span>
          <input type="number" min="0" max="100" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} placeholder="Opcional" />
        </label>
        <label className="field">
          <span>Nota (0–10)</span>
          <input type="number" min="0" max="10" step="0.1" value={grade} onChange={(event) => setGrade(event.target.value)} placeholder="Opcional" />
        </label>
        <label className="field field-wide">
          <span>Observações</span>
          <textarea maxLength={1000} rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Links, instruções ou lembretes importantes" />
        </label>
        {error && <p className="form-error field-wide" role="alert">{error}</p>}
        <div className="modal-actions field-wide">
          <button className="button secondary" type="button" onClick={onClose}>Cancelar</button>
          <button className="button primary" type="submit" disabled={saving}>{saving ? "Salvando…" : "Salvar atividade"}</button>
        </div>
      </form>
    </Modal>
  );
}
