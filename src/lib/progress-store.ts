// In-memory store for demo purposes.
// In production, replace with a database (Supabase, Prisma, etc.)

export interface WorkoutEntry {
  id: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  notes: string;
}

export interface WeeklyCheckin {
  id: string;
  week: number;
  weight: number;
  bodyFat: number | null;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  notes: string;
  createdAt: string;
}

export interface ClientProgress {
  userId: string;
  workouts: WorkoutEntry[];
  checkins: WeeklyCheckin[];
  goals: {
    targetWeight: number | null;
    weeklyWorkouts: number;
    programWeeks: number;
  };
}

const store = new Map<string, ClientProgress>();

function getOrCreate(userId: string): ClientProgress {
  if (!store.has(userId)) {
    store.set(userId, {
      userId,
      workouts: [],
      checkins: [],
      goals: {
        targetWeight: null,
        weeklyWorkouts: 4,
        programWeeks: 12,
      },
    });
  }
  return store.get(userId)!;
}

export function getProgress(userId: string): ClientProgress {
  return getOrCreate(userId);
}

export function addWorkout(
  userId: string,
  workout: Omit<WorkoutEntry, "id">
): WorkoutEntry {
  const progress = getOrCreate(userId);
  const entry: WorkoutEntry = {
    ...workout,
    id: crypto.randomUUID(),
  };
  progress.workouts.push(entry);
  return entry;
}

export function addCheckin(
  userId: string,
  checkin: Omit<WeeklyCheckin, "id" | "createdAt">
): WeeklyCheckin {
  const progress = getOrCreate(userId);
  const entry: WeeklyCheckin = {
    ...checkin,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  progress.checkins.push(entry);
  return entry;
}

export function updateGoals(
  userId: string,
  goals: Partial<ClientProgress["goals"]>
) {
  const progress = getOrCreate(userId);
  progress.goals = { ...progress.goals, ...goals };
  return progress.goals;
}

export function deleteWorkout(userId: string, workoutId: string): boolean {
  const progress = getOrCreate(userId);
  const idx = progress.workouts.findIndex((w) => w.id === workoutId);
  if (idx === -1) return false;
  progress.workouts.splice(idx, 1);
  return true;
}
