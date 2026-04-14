import { useState, useCallback } from "react";

const STORAGE_KEY = "univesp-stats-v5";

function loadStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistStats(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {}
}

export function useStats() {
  const [stats, setStats] = useState(loadStats);

  const mark = useCallback((key, correct) => {
    setStats((prev) => {
      const entry = prev[key] || { c: 0, w: 0 };
      const next = {
        ...prev,
        [key]: {
          c: entry.c + (correct ? 1 : 0),
          w: entry.w + (correct ? 0 : 1),
        },
      };
      persistStats(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    if (confirm("Zerar todas as estatisticas?")) {
      const empty = {};
      setStats(empty);
      persistStats(empty);
    }
  }, []);

  const getSubjectStats = useCallback(
    (subjectKey, quizBank) => {
      let attempted = 0;
      let correct = 0;
      quizBank.forEach((_, i) => {
        const entry = stats[`q-${subjectKey}-${i}`];
        if (entry) {
          attempted += entry.c + entry.w;
          correct += entry.c;
        }
      });
      return {
        total: quizBank.length,
        attempted,
        correct,
        percent: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
      };
    },
    [stats]
  );

  return { stats, mark, reset, getSubjectStats };
}
