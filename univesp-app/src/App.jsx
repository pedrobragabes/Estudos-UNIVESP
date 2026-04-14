import { useState } from "react";
import { useStats } from "./hooks/useStats";
import { HomeView } from "./features/home/HomeView";
import { FlashcardView } from "./features/flashcards/FlashcardView";
import { QuizView } from "./features/quiz/QuizView";
import GeminiTutor from "./GeminiTutor";
import FormulaSheet from "./FormulaSheet";

const MODES = {
  MENU: "menu",
  STUDY: "study",
  QUIZ: "quiz",
  EXAM: "exam",
  AI_TUTOR: "ai_tutor",
  FORMULAS: "formulas",
};

export default function App() {
  const [mode, setMode] = useState(MODES.MENU);
  const [prevMode, setPrevMode] = useState(MODES.MENU);
  const [subjectKey, setSubjectKey] = useState(null);
  const [difficulty, setDifficulty] = useState("normal");
  const [tutorQuestion, setTutorQuestion] = useState("");
  const [tutorSubject, setTutorSubject] = useState("com150");

  const { stats, mark, reset, getSubjectStats } = useStats();

  const daysLeft = Math.max(0, Math.ceil((new Date("2026-03-26") - new Date()) / 86400000));

  const goMenu = () => setMode(MODES.MENU);

  const goStudy = (key) => {
    setSubjectKey(key);
    setMode(MODES.STUDY);
  };

  const goQuiz = (key, diff) => {
    setSubjectKey(key);
    setDifficulty(diff);
    setMode(MODES.QUIZ);
  };

  const goExam = () => {
    setSubjectKey(null);
    setMode(MODES.EXAM);
  };

  const openTutor = (question, subj) => {
    setTutorQuestion(question || "");
    setTutorSubject(subj || subjectKey || "com150");
    setPrevMode(mode);
    setMode(MODES.AI_TUTOR);
  };

  const openFormulas = () => {
    setPrevMode(mode);
    setMode(MODES.FORMULAS);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0a0a0f,#111827,#0a0a0f)", color: "#e2e8f0", fontFamily: "var(--font-mono)", padding: 16, boxSizing: "border-box" }}>
      {/* Top bar */}
      <div style={{ maxWidth: 680, margin: "0 auto", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {mode !== MODES.MENU && (
              <button className="b" onClick={goMenu} style={{ background: "rgba(255,255,255,.08)", color: "#94a3b8", padding: "6px 12px", fontSize: 12 }}>
                &larr; Menu
              </button>
            )}
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>
              UNIVESP <span style={{ color: "#6366f1" }}>Study</span>
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {mode === MODES.MENU && (
              <button className="b" onClick={reset} style={{ background: "rgba(255,255,255,.05)", color: "#64748b", padding: "4px 8px", fontSize: 10 }}>Zerar</button>
            )}
            <div style={{ background: daysLeft <= 1 ? "rgba(239,68,68,.2)" : "rgba(245,158,11,.2)", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: daysLeft <= 1 ? "#fca5a5" : "#fcd34d" }}>
              {daysLeft === 0 ? "HOJE!" : `${daysLeft}d`}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {mode === MODES.MENU && (
          <HomeView
            stats={stats}
            getSubjectStats={getSubjectStats}
            daysLeft={daysLeft}
            onStudy={goStudy}
            onQuiz={goQuiz}
            onExam={goExam}
            onTutor={() => openTutor("", "com150")}
            onFormulas={openFormulas}
            onReset={reset}
            onReview={(key, topic) => { goStudy(key); }}
          />
        )}

        {mode === MODES.STUDY && subjectKey && (
          <FlashcardView
            subjectKey={subjectKey}
            stats={stats}
            mark={mark}
            onBack={goMenu}
            onAskTutor={openTutor}
          />
        )}

        {(mode === MODES.QUIZ || mode === MODES.EXAM) && (
          <QuizView
            mode={mode}
            subjectKey={subjectKey}
            difficulty={difficulty}
            mark={mark}
            onBack={goMenu}
            onAskTutor={openTutor}
            onStudy={() => goStudy(subjectKey)}
          />
        )}

        {mode === MODES.AI_TUTOR && (
          <GeminiTutor
            subject={tutorSubject}
            initialQuestion={tutorQuestion}
            onBack={() => setMode(prevMode)}
          />
        )}

        {mode === MODES.FORMULAS && (
          <FormulaSheet onBack={() => setMode(prevMode)} />
        )}
      </div>
    </div>
  );
}
