"use client";

import type { ClientProgress } from "@/lib/progress-store";

export default function ProgressStats({
  progress,
}: {
  progress: ClientProgress;
}) {
  const { workouts, checkins, goals } = progress;

  // Workouts this week
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const workoutsThisWeek = workouts.filter(
    (w) => new Date(w.date) >= weekStart
  ).length;

  // Total volume (sets * reps * weight)
  const totalVolume = workouts.reduce(
    (sum, w) => sum + w.sets * w.reps * w.weight,
    0
  );

  // Weight change
  const sortedCheckins = [...checkins].sort((a, b) => a.week - b.week);
  const firstWeight = sortedCheckins[0]?.weight;
  const lastWeight = sortedCheckins[sortedCheckins.length - 1]?.weight;
  const weightChange =
    firstWeight && lastWeight ? lastWeight - firstWeight : null;

  // Program progress
  const currentWeek = checkins.length;
  const programProgress = Math.min(
    (currentWeek / goals.programWeeks) * 100,
    100
  );

  const stats = [
    {
      label: "This Week",
      value: `${workoutsThisWeek}/${goals.weeklyWorkouts}`,
      sub: "workouts",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Volume",
      value: totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : `${totalVolume}`,
      sub: "kg lifted",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Weight Change",
      value:
        weightChange !== null
          ? `${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)}`
          : "—",
      sub: weightChange !== null ? "kg" : "no data",
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Program",
      value: `${currentWeek}/${goals.programWeeks}`,
      sub: "weeks",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-2xl border border-gray-200 p-4"
        >
          <p className="text-xs text-gray-400 mb-1">{s.label}</p>
          <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          <p className="text-xs text-gray-400">{s.sub}</p>
        </div>
      ))}
      <div className="col-span-2 md:col-span-4 bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-400">Program Progress</p>
          <p className="text-xs font-medium text-gray-600">
            {programProgress.toFixed(0)}%
          </p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${programProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
