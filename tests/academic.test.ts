import { describe, expect, it } from "vitest";
import type { Activity, Discipline } from "@/src/domain/academic";
import {
  getActivityProgress,
  getCurrentTerm,
  getDisciplineSummaries,
  getGradeAverage,
  getUpcomingActivities,
  isOverdue,
} from "@/src/domain/academic";

const discipline: Discipline = {
  id: "discipline-1",
  name: "Engenharia de Software",
  code: "COM200",
  color: "#5b5bd6",
  term: "2026.2",
  createdAt: "2026-07-01T12:00:00.000Z",
  updatedAt: "2026-07-01T12:00:00.000Z",
};

function activity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: crypto.randomUUID(),
    disciplineId: discipline.id,
    title: "Atividade",
    kind: "assignment",
    dueAt: "2026-07-20T20:00:00.000Z",
    status: "pending",
    weight: null,
    grade: null,
    notes: "",
    createdAt: "2026-07-01T12:00:00.000Z",
    updatedAt: "2026-07-01T12:00:00.000Z",
    ...overrides,
  };
}

describe("academic metrics", () => {
  it("calculates completion progress", () => {
    expect(getActivityProgress([activity({ status: "done" }), activity()])).toBe(50);
    expect(getActivityProgress([])).toBe(0);
  });

  it("calculates weighted grades when every grade has a weight", () => {
    const result = getGradeAverage([
      activity({ grade: 8, weight: 40 }),
      activity({ grade: 6, weight: 60 }),
    ]);
    expect(result).toBe(6.8);
  });

  it("falls back to a simple average when weights are incomplete", () => {
    const result = getGradeAverage([
      activity({ grade: 8, weight: 40 }),
      activity({ grade: 6, weight: null }),
    ]);
    expect(result).toBe(7);
  });

  it("derives discipline summaries without duplicating state", () => {
    const summaries = getDisciplineSummaries({
      disciplines: [discipline],
      activities: [activity({ status: "done", grade: 9 })],
    });
    expect(summaries[0]).toMatchObject({
      totalActivities: 1,
      completedActivities: 1,
      progress: 100,
      average: 9,
    });
  });
});

describe("deadlines", () => {
  it("does not mark completed work as overdue", () => {
    const now = new Date("2026-07-16T12:00:00.000Z");
    expect(isOverdue(activity({ dueAt: "2026-07-15T12:00:00.000Z" }), now)).toBe(true);
    expect(isOverdue(activity({ dueAt: "2026-07-15T12:00:00.000Z", status: "done" }), now)).toBe(false);
  });

  it("orders upcoming activities by deadline", () => {
    const later = activity({ id: "later", dueAt: "2026-08-10T12:00:00.000Z" });
    const sooner = activity({ id: "sooner", dueAt: "2026-07-20T12:00:00.000Z" });
    expect(getUpcomingActivities([later, sooner]).map((item) => item.id)).toEqual(["sooner", "later"]);
  });

  it("uses the correct UNIVESP semester label", () => {
    expect(getCurrentTerm(new Date("2026-02-10T12:00:00.000Z"))).toBe("2026.1");
    expect(getCurrentTerm(new Date("2026-08-10T12:00:00.000Z"))).toBe("2026.2");
  });
});
