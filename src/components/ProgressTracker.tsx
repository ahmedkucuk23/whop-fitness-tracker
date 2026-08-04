"use client";

import { useState, useEffect, useCallback } from "react";
import type { ClientProgress } from "@/lib/progress-store";
import ProgressStats from "./ProgressStats";
import WorkoutLog from "./WorkoutLog";
import WeeklyCheckin from "./WeeklyCheckin";

export default function ProgressTracker({ userId }: { userId: string }) {
  const [progress, setProgress] = useState<ClientProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"workouts" | "checkins">(
    "workouts"
  );

  const fetchProgress = useCallback(async () => {
    const res = await fetch("/api/progress");
    if (res.ok) {
      setProgress(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  async function handleAddWorkout(data: Record<string, unknown>) {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "workout", data }),
    });
    fetchProgress();
  }

  async function handleDeleteWorkout(id: string) {
    await fetch(`/api/progress?workoutId=${id}`, { method: "DELETE" });
    fetchProgress();
  }

  async function handleAddCheckin(data: Record<string, unknown>) {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "checkin", data }),
    });
    fetchProgress();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="text-center py-20 text-gray-400">
        Failed to load progress data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Progress Tracker
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track your fitness journey
          </p>
        </div>
        <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
          {userId.slice(0, 12)}...
        </div>
      </div>

      <ProgressStats progress={progress} />

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("workouts")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "workouts"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Workouts
        </button>
        <button
          onClick={() => setActiveTab("checkins")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "checkins"
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Weekly Check-ins
        </button>
      </div>

      {activeTab === "workouts" ? (
        <WorkoutLog
          workouts={progress.workouts}
          onAdd={handleAddWorkout}
          onDelete={handleDeleteWorkout}
        />
      ) : (
        <WeeklyCheckin checkins={progress.checkins} onAdd={handleAddCheckin} />
      )}
    </div>
  );
}
