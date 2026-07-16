import { z } from "zod";

export const activityKinds = [
  "assignment",
  "exam",
  "project",
  "reading",
  "other",
] as const;

export const activityStatuses = ["pending", "in_progress", "done"] as const;

export const disciplineSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(80),
  code: z.string().trim().max(20),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  term: z.string().trim().min(3).max(20),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const activitySchema = z.object({
  id: z.string().min(1),
  disciplineId: z.string().min(1),
  title: z.string().trim().min(2).max(120),
  kind: z.enum(activityKinds),
  dueAt: z.string().datetime({ offset: true }),
  status: z.enum(activityStatuses),
  weight: z.number().min(0).max(100).nullable(),
  grade: z.number().min(0).max(10).nullable(),
  notes: z.string().trim().max(1000),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createDisciplineSchema = disciplineSchema.pick({
  name: true,
  code: true,
  color: true,
  term: true,
});

export const updateDisciplineSchema = createDisciplineSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Informe ao menos um campo para atualizar.",
);

export const createActivitySchema = activitySchema.pick({
  disciplineId: true,
  title: true,
  kind: true,
  dueAt: true,
  status: true,
  weight: true,
  grade: true,
  notes: true,
});

export const updateActivitySchema = createActivitySchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Informe ao menos um campo para atualizar.",
);

export type Discipline = z.infer<typeof disciplineSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type CreateDisciplineInput = z.infer<typeof createDisciplineSchema>;
export type UpdateDisciplineInput = z.infer<typeof updateDisciplineSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;

export type AcademicSnapshot = {
  disciplines: Discipline[];
  activities: Activity[];
};

export type DisciplineSummary = Discipline & {
  totalActivities: number;
  completedActivities: number;
  progress: number;
  average: number | null;
};

export function getActivityProgress(activities: Activity[]) {
  if (activities.length === 0) return 0;
  const completed = activities.filter((activity) => activity.status === "done").length;
  return Math.round((completed / activities.length) * 100);
}

export function getGradeAverage(activities: Activity[]) {
  const graded = activities.filter(
    (activity): activity is Activity & { grade: number } => activity.grade !== null,
  );

  if (graded.length === 0) return null;

  const withWeight = graded.filter(
    (activity): activity is Activity & { grade: number; weight: number } =>
      activity.weight !== null && activity.weight > 0,
  );

  if (withWeight.length === graded.length) {
    const totalWeight = withWeight.reduce((sum, activity) => sum + activity.weight, 0);
    if (totalWeight > 0) {
      return Number(
        (
          withWeight.reduce(
            (sum, activity) => sum + activity.grade * activity.weight,
            0,
          ) / totalWeight
        ).toFixed(1),
      );
    }
  }

  return Number(
    (graded.reduce((sum, activity) => sum + activity.grade, 0) / graded.length).toFixed(1),
  );
}

export function getDisciplineSummaries(snapshot: AcademicSnapshot): DisciplineSummary[] {
  return snapshot.disciplines.map((discipline) => {
    const activities = snapshot.activities.filter(
      (activity) => activity.disciplineId === discipline.id,
    );

    return {
      ...discipline,
      totalActivities: activities.length,
      completedActivities: activities.filter((activity) => activity.status === "done").length,
      progress: getActivityProgress(activities),
      average: getGradeAverage(activities),
    };
  });
}

export function isOverdue(activity: Activity, now = new Date()) {
  return activity.status !== "done" && new Date(activity.dueAt).getTime() < now.getTime();
}

export function getUpcomingActivities(activities: Activity[], limit = 5) {
  return [...activities]
    .filter((activity) => activity.status !== "done")
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, limit);
}

export function getCurrentTerm(date = new Date()) {
  return `${date.getFullYear()}.${date.getMonth() < 6 ? 1 : 2}`;
}
