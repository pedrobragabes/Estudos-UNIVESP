import { FLASHCARDS } from "../../data/flashcards";
import { QUIZ_BANK } from "../../data/quiz";

function WeakTopics({ stats, onReview }) {
  const weak = [];
  Object.entries(QUIZ_BANK).forEach(([subjectKey, bank]) => {
    const byTopic = {};
    bank.forEach((q, i) => {
      const entry = stats[`q-${subjectKey}-${i}`];
      if (!entry) return;
      if (!byTopic[q.topic]) byTopic[q.topic] = { c: 0, w: 0 };
      byTopic[q.topic].c += entry.c;
      byTopic[q.topic].w += entry.w;
    });
    Object.entries(byTopic).forEach(([topic, ts]) => {
      const total = ts.c + ts.w;
      if (total >= 2) {
        const acc = Math.round((ts.c / total) * 100);
        if (acc < 70)
          weak.push({ subjectKey, topic, acc, color: FLASHCARDS[subjectKey].color, icon: FLASHCARDS[subjectKey].icon });
      }
    });
  });
  weak.sort((a, b) => a.acc - b.acc);
  if (!weak.length) return null;

  return (
    <div style={{ background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 12, padding: 14, marginBottom: 12 }}>
      <div style={{ fontSize: 12, color: "#f87171", fontWeight: 600, marginBottom: 8 }}>Pontos Fracos — Revisar!</div>
      {weak.slice(0, 5).map(({ subjectKey, topic, acc, color, icon }) => (
        <div key={`${subjectKey}-${topic}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{icon} {topic}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 600 }}>{acc}%</span>
            <button className="b" onClick={() => onReview(subjectKey, topic)} style={{ fontSize: 10, padding: "2px 8px", background: `${color}20`, color, border: `1px solid ${color}30` }}>
              Revisar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SubjectCard({ subjectKey, subject, subjectStats, onStudy, onQuiz }) {
  const { attempted, correct, percent } = subjectStats;
  return (
    <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: 16, borderLeft: `3px solid ${subject.color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: 18, marginRight: 8 }}>{subject.icon}</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600 }}>{subject.name}</span>
          <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>{subject.cards.length} cards / {QUIZ_BANK[subjectKey].length} quiz</span>
        </div>
        {attempted > 0 && (
          <span className="tg" style={{ background: `${subject.color}22`, color: subject.color }}>{percent}%</span>
        )}
      </div>
      {attempted > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div className="pb"><div className="pf" style={{ width: `${percent}%`, background: subject.color }} /></div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{correct}/{attempted} acertos</div>
        </div>
      )}
      <div style={{ display: "flex", gap: 6 }}>
        <button className="b" onClick={() => onStudy(subjectKey)} style={{ flex: 1, background: `${subject.color}15`, color: subject.color, padding: "9px 0", fontSize: 12 }}>Cards</button>
        <button className="b" onClick={() => onQuiz(subjectKey, "normal")} style={{ flex: 1, background: `${subject.color}15`, color: subject.color, padding: "9px 0", fontSize: 12 }}>Normal</button>
        <button className="b" onClick={() => onQuiz(subjectKey, "hard")} style={{ flex: 1, background: `${subject.color}25`, color: subject.color, padding: "9px 0", fontSize: 12, fontWeight: 600 }}>Dificil</button>
      </div>
    </div>
  );
}

export function HomeView({ stats, getSubjectStats, daysLeft, onStudy, onQuiz, onExam, onTutor, onFormulas, onReset, onReview }) {
  return (
    <div>
      <button className="b" onClick={onExam} style={{ width: "100%", marginBottom: 8, background: "linear-gradient(135deg,rgba(239,68,68,.2),rgba(245,158,11,.2))", border: "1px solid rgba(239,68,68,.3)", color: "#fca5a5", padding: "14px 0", fontSize: 14, fontWeight: 600 }}>
        SIMULADO PROVA - 15 questoes mistas
      </button>
      <button className="b" onClick={onTutor} style={{ width: "100%", marginBottom: 6, background: "linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.12))", border: "1px solid rgba(99,102,241,.25)", color: "#a5b4fc", padding: "11px 0", fontSize: 13, fontWeight: 500 }}>
        Tutor IA &mdash; tire duvidas sobre qualquer topico
      </button>
      <button className="b" onClick={onFormulas} style={{ width: "100%", marginBottom: 12, background: "linear-gradient(135deg,rgba(245,158,11,.1),rgba(234,179,8,.07))", border: "1px solid rgba(245,158,11,.2)", color: "#fbbf24", padding: "11px 0", fontSize: 13, fontWeight: 500 }}>
        Folha de Formulas &mdash; apoio de COM150
      </button>

      <WeakTopics stats={stats} onReview={onReview} />

      <div style={{ display: "grid", gap: 12 }}>
        {Object.entries(FLASHCARDS).map(([key, subject]) => (
          <SubjectCard
            key={key}
            subjectKey={key}
            subject={subject}
            subjectStats={getSubjectStats(key, QUIZ_BANK[key])}
            onStudy={onStudy}
            onQuiz={onQuiz}
          />
        ))}
      </div>
    </div>
  );
}
