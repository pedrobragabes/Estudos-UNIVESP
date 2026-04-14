import { useState, useEffect } from "react";
import { FLASHCARDS } from "../../data/flashcards";
import { QUIZ_BANK } from "../../data/quiz";
import { useKeyboard } from "../../hooks/useKeyboard";
import { buildQuiz, buildExam, difficultyLabel, difficultyColor } from "../../lib/utils";

const MODES = { QUIZ: "quiz", EXAM: "exam" };

function QuizResult({ mode, subjectKey, answers, questions, onRepeat, onStudy, onMenu }) {
  const correct = answers.filter((a) => a.ok).length;
  const total = questions.length;
  const percent = Math.round((correct / total) * 100);
  const subject = subjectKey ? FLASHCARDS[subjectKey] : null;

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 8 }}>{percent >= 70 ? "🎉" : percent >= 40 ? "💪" : "📚"}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700 }}>{correct}/{total}</div>
      <div style={{ fontSize: 14, color: percent >= 70 ? "#86efac" : "#94a3b8", marginBottom: 4 }}>{percent}%</div>
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 18 }}>
        {percent >= 70 ? "Meta de aprovacao atingida!" : "Revisa os flashcards e tenta de novo."}
      </div>

      {mode === MODES.EXAM && (
        <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 10, padding: 14, marginBottom: 14, textAlign: "left" }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Por materia:</div>
          {Object.entries(FLASHCARDS).map(([key, s]) => {
            const subjectQuestions = questions.map((q, i) => ({ ...q, answerIndex: i })).filter((q) => q.subj === key);
            const subjectCorrect = subjectQuestions.filter((q) => answers[q.answerIndex]?.ok).length;
            return subjectQuestions.length > 0 ? (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12 }}>{s.icon} {s.name}</span>
                <span style={{ fontSize: 12, color: subjectCorrect >= Math.ceil(subjectQuestions.length * 0.7) ? "#86efac" : "#fca5a5", fontWeight: 600 }}>
                  {subjectCorrect}/{subjectQuestions.length}
                </span>
              </div>
            ) : null;
          })}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        {mode === MODES.EXAM ? (
          <button className="b" onClick={onRepeat} style={{ flex: 1, background: "rgba(239,68,68,.2)", color: "#fca5a5", padding: "12px 0", fontSize: 13 }}>Nova Prova</button>
        ) : (
          <>
            <button className="b" onClick={onRepeat} style={{ flex: 1, background: `${subject?.color}20`, color: subject?.color, padding: "12px 0", fontSize: 13 }}>Repetir</button>
            <button className="b" onClick={onStudy} style={{ flex: 1, background: "rgba(255,255,255,.05)", color: "#94a3b8", padding: "12px 0", fontSize: 13 }}>Cards</button>
          </>
        )}
        <button className="b" onClick={onMenu} style={{ flex: 1, background: "rgba(255,255,255,.05)", color: "#94a3b8", padding: "12px 0", fontSize: 13 }}>Menu</button>
      </div>
    </div>
  );
}

export function QuizView({ mode, subjectKey, difficulty, mark, onBack, onAskTutor, onStudy }) {
  const isExam = mode === MODES.EXAM;
  const [questions] = useState(() =>
    isExam ? buildExam(FLASHCARDS, QUIZ_BANK) : buildQuiz(subjectKey, QUIZ_BANK, difficulty)
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [timerVal, setTimerVal] = useState(90);
  const [repeatKey, setRepeatKey] = useState(0);

  const question = questions[questionIndex];
  const subjectColor = isExam ? "#ef4444" : FLASHCARDS[subjectKey]?.color || "#6366f1";
  const questionSubjectColor = question
    ? (FLASHCARDS[question.subj || subjectKey]?.color || "#6366f1")
    : subjectColor;

  // Timer: reset when question changes
  useEffect(() => {
    if (done || selectedIndex !== null) return;
    setTimerVal(90);
    const id = setInterval(() => setTimerVal((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [questionIndex, done, selectedIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-submit on timer expiry
  useEffect(() => {
    if (timerVal !== 0 || done || selectedIndex !== null || !question) return;
    const wrongIndex = question.opts.findIndex((_, i) => i !== question.correctIndex);
    answerQuestion(wrongIndex >= 0 ? wrongIndex : 0);
  }, [timerVal]); // eslint-disable-line react-hooks/exhaustive-deps

  const answerQuestion = (index) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    const ok = index === question.correctIndex;
    const statKey = `q-${question.subj || subjectKey}-${question.qi}`;
    mark(statKey, ok);
    setAnswers((prev) => [...prev, { sel: index, ok }]);
  };

  const nextQuestion = () => {
    if (questionIndex + 1 >= questions.length) {
      setDone(true);
    } else {
      setQuestionIndex(questionIndex + 1);
      setSelectedIndex(null);
    }
  };

  const repeat = () => {
    setQuestionIndex(0);
    setSelectedIndex(null);
    setAnswers([]);
    setDone(false);
    setTimerVal(90);
    setRepeatKey((k) => k + 1);
  };

  useKeyboard((e) => {
    if (done || questions.length === 0) return;
    if (["1", "2", "3", "4"].includes(e.key) && selectedIndex === null) {
      const idx = parseInt(e.key) - 1;
      if (idx < question.opts.length) answerQuestion(idx);
    } else if (e.key === "Enter" && selectedIndex !== null) {
      nextQuestion();
    }
  });

  if (done) {
    return (
      <QuizResult
        mode={mode}
        subjectKey={subjectKey}
        answers={answers}
        questions={questions}
        onRepeat={repeat}
        onStudy={onStudy}
        onMenu={onBack}
      />
    );
  }

  return (
    <div key={repeatKey}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, minWidth: 34, color: timerVal > 60 ? "#22c55e" : timerVal > 30 ? "#f59e0b" : "#ef4444" }}>{timerVal}s</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{questionIndex + 1}/{questions.length}</span>
          {isExam && question.subj && (
            <span className="tg" style={{ background: `${questionSubjectColor}22`, color: questionSubjectColor }}>
              {FLASHCARDS[question.subj]?.icon} {FLASHCARDS[question.subj]?.name}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <span className="tg" style={{ background: "rgba(255,255,255,.06)", color: "#94a3b8" }}>{question.topic}</span>
          <span className="tg" style={{ background: `${difficultyColor(question.difficulty)}22`, color: difficultyColor(question.difficulty) }}>
            {difficultyLabel(question.difficulty)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="pb" style={{ marginBottom: 12 }}>
        <div className="pf" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%`, background: subjectColor }} />
      </div>

      {/* Question */}
      <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: 20, marginBottom: 12 }}>
        {question.context && (
          <div style={{ fontSize: 12, color: "#94a3b8", background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.18)", borderRadius: 8, padding: "10px 14px", marginBottom: 14, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
            <span style={{ fontSize: 10, color: "#818cf8", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Dado</span>
            {question.context}
          </div>
        )}
        <div style={{ fontSize: 14, lineHeight: 1.6 }}>{question.q}</div>
      </div>

      {/* Options */}
      {question.opts.map((option, i) => {
        let cls = "ob";
        if (selectedIndex !== null) {
          if (i === question.correctIndex) cls += " ok";
          else if (i === selectedIndex) cls += " no";
        }
        return (
          <button key={i} className={cls} disabled={selectedIndex !== null} onClick={() => answerQuestion(i)}>
            <span style={{ fontWeight: 700, marginRight: 10, opacity: 0.5 }}>{String.fromCharCode(65 + i)}</span>
            {option}
          </button>
        );
      })}

      {/* Ask tutor on wrong answer */}
      {selectedIndex !== null && selectedIndex !== question.correctIndex && (
        <button className="b" onClick={() => onAskTutor(`Por que errei? Questao: "${question.q}" | Eu respondi: "${question.opts[selectedIndex]}" | Resposta correta: "${question.correct}". Explica o conceito de forma clara.`, question.subj || subjectKey)}
          style={{ width: "100%", marginTop: 8, background: "rgba(99,102,241,.08)", color: "#818cf8", padding: "9px 0", fontSize: 12, border: "1px solid rgba(99,102,241,.18)" }}>
          Por que errei? &mdash; Perguntar ao Tutor IA
        </button>
      )}

      {selectedIndex !== null && (
        <button className="b" onClick={nextQuestion} style={{ width: "100%", marginTop: 6, background: isExam ? "rgba(239,68,68,.2)" : `${subjectColor}25`, color: isExam ? "#fca5a5" : subjectColor, padding: "12px 0", fontSize: 13 }}>
          {questionIndex + 1 >= questions.length ? "Ver Resultado" : "Proxima"}
        </button>
      )}

      <div style={{ fontSize: 10, color: "#334155", textAlign: "center", marginTop: 6 }}>1/2/3/4=responder &middot; Enter=proxima</div>
    </div>
  );
}
