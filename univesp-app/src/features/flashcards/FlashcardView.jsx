import { useState } from "react";
import { FLASHCARDS } from "../../data/flashcards";
import { useKeyboard } from "../../hooks/useKeyboard";
import { difficultyLabel, difficultyColor } from "../../lib/utils";

function buildFilteredCards(subjectKey, stats, topicFilter, diffFilter) {
  return FLASHCARDS[subjectKey].cards
    .map((card, originalIndex) => ({ ...card, originalIndex }))
    .filter((card) => !topicFilter || card.topic === topicFilter)
    .filter((card) => {
      if (!diffFilter) return true;
      if (diffFilter === "wrong") {
        const entry = stats[`c-${subjectKey}-${card.originalIndex}`];
        return entry && entry.w > 0;
      }
      return card.difficulty === diffFilter;
    });
}

export function FlashcardView({ subjectKey, stats, mark, onBack, onAskTutor }) {
  const subject = FLASHCARDS[subjectKey];
  const topics = [...new Set(subject.cards.map((c) => c.topic))];

  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [topicFilter, setTopicFilter] = useState(null);
  const [diffFilter, setDiffFilter] = useState(null);

  const filteredCards = buildFilteredCards(subjectKey, stats, topicFilter, diffFilter);
  const currentCard = filteredCards[cardIndex];

  const resetPosition = () => { setCardIndex(0); setFlipped(false); };

  const selectTopic = (topic) => { setTopicFilter(topicFilter === topic ? null : topic); resetPosition(); };
  const selectDiff = (d) => { setDiffFilter(diffFilter === d ? null : d); resetPosition(); };

  const markCard = (correct) => {
    mark(`c-${subjectKey}-${currentCard.originalIndex}`, correct);
    setFlipped(false);
    setCardIndex((i) => Math.min(i + 1, filteredCards.length - 1));
  };

  const goTo = (index) => { setFlipped(false); setCardIndex(index); };

  useKeyboard((e) => {
    if (!currentCard) return;
    if (e.code === "Space") { e.preventDefault(); setFlipped((f) => !f); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(Math.max(0, cardIndex - 1)); }
    else if (e.key === "ArrowRight") { e.preventDefault(); goTo(Math.min(filteredCards.length - 1, cardIndex + 1)); }
    else if (e.key === "1" && flipped) markCard(false);
    else if (e.key === "2" && flipped) markCard(true);
  });

  return (
    <div>
      {/* Topic filters */}
      <div style={{ marginBottom: 4, display: "flex", flexWrap: "wrap", gap: 0 }}>
        <span className={`ch ${!topicFilter ? "a" : ""}`} onClick={() => { setTopicFilter(null); resetPosition(); }}>Todos</span>
        {topics.map((t) => (
          <span key={t} className={`ch ${topicFilter === t ? "a" : ""}`} onClick={() => selectTopic(t)}>{t}</span>
        ))}
      </div>

      {/* Difficulty filters */}
      <div style={{ marginBottom: 10, display: "flex", flexWrap: "wrap", gap: 0 }}>
        {[1, 2, 3].map((d) => (
          <span key={d} className={`ch ${diffFilter === d ? "a" : ""}`} style={{ color: diffFilter === d ? difficultyColor(d) : "inherit" }} onClick={() => selectDiff(d)}>
            {difficultyLabel(d)}
          </span>
        ))}
        <span className={`ch ${diffFilter === "wrong" ? "a" : ""}`} style={{ color: diffFilter === "wrong" ? "#ef4444" : "inherit" }} onClick={() => selectDiff("wrong")}>
          Errei
        </span>
      </div>

      {currentCard ? (
        <>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{cardIndex + 1}/{filteredCards.length}</span>
            <div style={{ display: "flex", gap: 4 }}>
              <span className="tg" style={{ background: "rgba(255,255,255,.06)", color: "#94a3b8" }}>{currentCard.topic}</span>
              <span className="tg" style={{ background: `${difficultyColor(currentCard.difficulty)}22`, color: difficultyColor(currentCard.difficulty) }}>
                {difficultyLabel(currentCard.difficulty)}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pb" style={{ marginBottom: 12 }}>
            <div className="pf" style={{ width: `${((cardIndex + 1) / filteredCards.length) * 100}%`, background: subject.color }} />
          </div>

          {/* Flip card */}
          <div className="cf" onClick={() => setFlipped(!flipped)} style={{ height: 260, marginBottom: 12 }}>
            <div className={`ci ${flipped ? "f" : ""}`} style={{ width: "100%", height: "100%" }}>
              <div className="cfs" style={{ background: "linear-gradient(135deg,rgba(255,255,255,.06),rgba(255,255,255,.02))", border: "1px solid rgba(255,255,255,.1)" }}>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Pergunta</div>
                <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{currentCard.q}</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 12 }}>toque para virar</div>
              </div>
              <div className="cbs" style={{ background: `linear-gradient(135deg,${subject.color}15,${subject.color}05)`, border: `1px solid ${subject.color}40` }}>
                <div style={{ fontSize: 10, color: subject.color, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Resposta</div>
                <div style={{ fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{currentCard.a}</div>
              </div>
            </div>
          </div>

          {/* Mark buttons */}
          {flipped && (
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <button className="b" onClick={() => markCard(false)} style={{ flex: 1, background: "rgba(239,68,68,.15)", color: "#fca5a5", padding: "11px 0", fontSize: 13 }}>Errei</button>
              <button className="b" onClick={() => markCard(true)} style={{ flex: 1, background: "rgba(34,197,94,.15)", color: "#86efac", padding: "11px 0", fontSize: 13 }}>Acertei</button>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 6 }}>
            <button className="b" disabled={cardIndex === 0} onClick={() => goTo(cardIndex - 1)} style={{ flex: 1, background: "rgba(255,255,255,.05)", color: cardIndex === 0 ? "#334155" : "#94a3b8", padding: "9px 0", fontSize: 12 }}>&larr;</button>
            <button className="b" onClick={() => goTo(Math.floor(Math.random() * filteredCards.length))} style={{ background: "rgba(255,255,255,.05)", color: "#94a3b8", padding: "9px 14px", fontSize: 12 }}>Aleatorio</button>
            <button className="b" disabled={cardIndex >= filteredCards.length - 1} onClick={() => goTo(cardIndex + 1)} style={{ flex: 1, background: "rgba(255,255,255,.05)", color: cardIndex >= filteredCards.length - 1 ? "#334155" : "#94a3b8", padding: "9px 0", fontSize: 12 }}>&rarr;</button>
          </div>

          <button className="b" onClick={() => onAskTutor(`Explica este conceito: ${currentCard.q}`, subjectKey)} style={{ width: "100%", marginTop: 8, background: "rgba(99,102,241,.08)", color: "#818cf8", padding: "8px 0", fontSize: 12, border: "1px solid rgba(99,102,241,.18)" }}>
            Nao entendi &mdash; Perguntar ao Tutor IA
          </button>
          <div style={{ fontSize: 10, color: "#334155", textAlign: "center", marginTop: 6 }}>
            Space=virar &middot; &larr;/&rarr;=navegar &middot; 1=Errei &middot; 2=Acertei
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: 40, color: "#475569", fontSize: 13 }}>Nenhum card com este filtro</div>
      )}
    </div>
  );
}
