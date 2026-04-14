export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const difficultyLabel = (d) =>
  d === 1 ? "Facil" : d === 2 ? "Medio" : "Dificil";

export const difficultyColor = (d) =>
  d === 1 ? "#22c55e" : d === 2 ? "#f59e0b" : "#ef4444";

export function buildQuiz(subjectKey, quizBank, difficulty) {
  let pool = [...quizBank[subjectKey]];
  if (difficulty === "hard") pool = pool.filter((q) => q.difficulty >= 2);
  if (pool.length < 4) pool = [...quizBank[subjectKey]];
  const count = difficulty === "hard" ? 12 : 8;
  const wrongsPerQ = difficulty === "hard" ? 4 : 3;
  return shuffle(pool)
    .slice(0, Math.min(count, pool.length))
    .map((q, qi) => {
      const opts = shuffle([q.correct, ...shuffle(q.wrongs).slice(0, wrongsPerQ)]);
      return { ...q, opts, correctIndex: opts.indexOf(q.correct), qi };
    });
}

export function buildExam(flashcards, quizBank) {
  const all = [];
  Object.entries(quizBank).forEach(([subj, bank]) =>
    bank.forEach((q) => all.push({ ...q, subj }))
  );
  return shuffle(all)
    .slice(0, 15)
    .map((q, qi) => {
      const opts = shuffle([q.correct, ...shuffle(q.wrongs).slice(0, 4)]);
      return { ...q, opts, correctIndex: opts.indexOf(q.correct), qi };
    });
}
