"use client";

import { useState } from "react";
import type { WorkoutEntry } from "@/lib/progress-store";

const EXERCISES = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Pull-ups",
  "Lunges",
  "Leg Press",
  "Bicep Curls",
  "Tricep Dips",
  "Lat Pulldown",
  "Cable Rows",
  "Hip Thrust",
  "Romanian Deadlift",
  "Plank",
  "Other",
];

export default function WorkoutLog({
  workouts,
  onAdd,
  onDelete,
}: {
  workouts: WorkoutEntry[];
  onAdd: (data: Omit<WorkoutEntry, "id">) => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    exercise: EXERCISES[0],
    sets: 3,
    reps: 10,
    weight: 0,
    notes: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(form);
    setShowForm(false);
    setForm({
      date: new Date().toISOString().split("T")[0],
      exercise: EXERCISES[0],
      sets: 3,
      reps: 10,
      weight: 0,
      notes: "",
    });
  }

  const sorted = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Workout Log</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          {showForm ? "Cancel" : "+ Log Workout"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Exercise
              </label>
              <select
                value={form.exercise}
                onChange={(e) => setForm({ ...form, exercise: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {EXERCISES.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Sets
              </label>
              <input
                type="number"
                min={1}
                value={form.sets}
                onChange={(e) =>
                  setForm({ ...form, sets: parseInt(e.target.value) || 1 })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Reps
              </label>
              <input
                type="number"
                min={1}
                value={form.reps}
                onChange={(e) =>
                  setForm({ ...form, reps: parseInt(e.target.value) || 1 })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={form.weight}
                onChange={(e) =>
                  setForm({
                    ...form,
                    weight: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Notes
            </label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="How did it feel?"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Save Workout
          </button>
        </form>
      )}

      {sorted.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          No workouts logged yet. Start tracking!
        </p>
      ) : (
        <div className="space-y-2">
          {sorted.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900">
                    {w.exercise}
                  </span>
                  <span className="text-xs text-gray-400">{w.date}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {w.sets} sets x {w.reps} reps @ {w.weight}kg
                  {w.notes && ` — ${w.notes}`}
                </p>
              </div>
              <button
                onClick={() => onDelete(w.id)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
