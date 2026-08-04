import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { whop } from "@/lib/whop";
import {
  getProgress,
  addWorkout,
  addCheckin,
  updateGoals,
  deleteWorkout,
} from "@/lib/progress-store";

async function getUserId(): Promise<string | null> {
  try {
    const h = await headers();
    const { userId } = await whop.verifyUserToken(h);
    return userId;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getProgress(userId));
}

export async function POST(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { type, data } = body;

  switch (type) {
    case "workout": {
      const workout = addWorkout(userId, data);
      return NextResponse.json(workout, { status: 201 });
    }
    case "checkin": {
      const checkin = addCheckin(userId, data);
      return NextResponse.json(checkin, { status: 201 });
    }
    case "goals": {
      const goals = updateGoals(userId, data);
      return NextResponse.json(goals);
    }
    default:
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const userId = await getUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workoutId = searchParams.get("workoutId");
  if (!workoutId) {
    return NextResponse.json(
      { error: "workoutId required" },
      { status: 400 }
    );
  }

  const deleted = deleteWorkout(userId, workoutId);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
