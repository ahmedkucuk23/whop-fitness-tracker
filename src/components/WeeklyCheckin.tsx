"use client";

import { useState } from "react";
import type { WeeklyCheckin as WeeklyCheckinType } from "@/lib/progress-store";

export default function WeeklyCheckin({
  checkins,
  onAdd,
}: {
  checkins: WeeklyCheckinType[];
  onAdd: (data: Omit<WeeklyCheckinType, "id" | "createdAt">) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const nextWeek = checkins.length + 1;
  const [form, setForm] = useState({
    week: nextWeek,
    weight: 0,
    bodyFat: null as number | null,
    energyLevel: 3 as 1 | 2 | 3 | 4 | 5,
    sleepQuality: 3 as 1 | 2 | 3 | 4 | 5,
    notes: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(form);
    setShowForm(false);
    setForm({
      week: nextWeek + 1,
      weight: 0,
      bodyFat: null,
      energyLevel: 3,
      sleepQuality: 3,
      notes: "",
    });
  }

  const ratingEmoji = (val: number) => {
    const map: Record<number, string> = {
      1: "😫",
      2: "😕",
      3: "😐",
      4: "🙂",
      5: "💪",
    };
    return map[val] || "😐";
  };

  const sorted = [...checkins].sort((a, b) => b.week - a.week);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Weekly Check-ins
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600 transition-colors"
        >
          {showForm ? "Cancel" : "+ Check In"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3"
        >
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Week #
              </label>
              <input
                type="number"
                min={1}
                value={form.week}
                onChange={(e) =>
                  setForm({ ...form, week: parseInt(e.target.value) || 1 })
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
                step={0.1}
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
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Body Fat %
              </label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={form.bodyFat ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bodyFat: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                placeholder="Optional"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Energy Level (1-5)
              </label>
              <div className="flex gap-1">
                {([1, 2, 3, 4, 5] as const).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setForm({ ...form, energyLevel: val })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.energyLevel === val
                        ? "bg-emerald-500 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Sleep Quality (1-5)
              </label>
              <div className="flex gap-1">
                {([1, 2, 3, 4, 5] as const).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setForm({ ...form, sleepQuality: val })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.sleepQuality === val
                        ? "bg-purple-500 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
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
              placeholder="How was your week?"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Submit Check-in
          </button>
        </form>
      )}

      {sorted.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          No check-ins yet. Log your first weekly check-in!
        </p>
      ) : (
        <div className="space-y-2">
          {sorted.map((c) => (
            <div key={c.id} className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-gray-900">
                  Week {c.week}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{c.weight} kg</span>
                {c.bodyFat && <span>{c.bodyFat}% BF</span>}
                <span>Energy {ratingEmoji(c.energyLevel)}</span>
                <span>Sleep {ratingEmoji(c.sleepQuality)}</span>
              </div>
              {c.notes && (
                <p className="text-xs text-gray-400 mt-1">{c.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
