import { headers } from "next/headers";
import { whop } from "@/lib/whop";
import ProgressTracker from "@/components/ProgressTracker";

export default async function Home() {
  let userId: string | null = null;
  let error: string | null = null;

  try {
    const h = await headers();
    console.log("Incoming headers:", Object.fromEntries(h.entries()));
    try {
      const result = await whop.verifyUserToken(h);
      userId = result.userId;
      console.log("Verified userId:", userId);
    } catch (err) {
      console.error("verifyUserToken failed:", err);
      throw err;
    }
  } catch {
    error =
      "Unable to verify your identity. Make sure you're accessing this app from within Whop.";
  }

  if (error || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Authentication Required
          </h2>
          <p className="text-sm text-gray-500">
            {error || "Please access this app through your Whop dashboard."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6 py-8">
      <ProgressTracker userId={userId} />
    </main>
  );
}
