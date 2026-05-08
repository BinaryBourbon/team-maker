import { MissionControl } from "@/components/vision/MissionControl";

export default function MissionControlPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-3 shrink-0">
        <div className="flex items-center gap-4">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            ← Back
          </a>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900 dark:text-white">Mission Control</h1>
            <p className="text-xs text-gray-500">Goals → team → work. All connected.</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="/vision/one-agent" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              One Agent
            </a>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <a href="/vision/org" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              Org
            </a>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span className="text-gray-900 dark:text-white font-medium">Mission Control</span>
          </div>
        </div>
      </div>

      {/* Main — full height minus header */}
      <div className="flex-1 min-h-0">
        <MissionControl />
      </div>
    </div>
  );
}
