import { AgentStudio } from "@/components/vision/AgentStudio";

export const metadata = { title: "One Great Agent — Team Maker" };

export default function OneAgentPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
        <a
          href="/"
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Back
        </a>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">One Great Agent</h1>
          <p className="text-xs text-gray-500">Configure a single agent to perfection</p>
        </div>
        <a
          href="/vision/org"
          className="ml-auto text-sm text-blue-500 hover:underline"
        >
          See the org chart vision →
        </a>
      </div>
      <AgentStudio />
    </div>
  );
}
