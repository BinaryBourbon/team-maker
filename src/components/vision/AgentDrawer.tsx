"use client";
import { OrgAgent } from "@/data/orgFixtures";

interface AgentDrawerProps {
  agent: OrgAgent | null;
  onClose: () => void;
}

const statusConfig = {
  active: { label: "Active", className: "bg-green-100 text-green-700" },
  idle: { label: "Idle", className: "bg-yellow-100 text-yellow-700" },
  error: { label: "Error", className: "bg-red-100 text-red-700" },
};

export function AgentDrawer({ agent, onClose }: AgentDrawerProps) {
  if (!agent) return null;

  const status = statusConfig[agent.status];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[380px] bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-semibold leading-none"
          aria-label="Close"
        >
          ×
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="text-5xl mb-3">{agent.emoji}</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{agent.name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{agent.persona}</p>
          <span
            className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 space-y-5">
          {/* Error alert */}
          {agent.status === "error" && agent.errorMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                ⚠ {agent.errorMessage}
              </p>
            </div>
          )}

          {/* Currently doing */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
              Currently doing
            </p>
            <p className="text-sm italic text-gray-500 dark:text-gray-400">{agent.currentTask}</p>
          </div>

          {/* Recent activity */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
              Recent activity
            </p>
            <ul className="space-y-1.5">
              {agent.recentActivity.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-gray-300 dark:text-gray-600 select-none">•</span>
                  <span>
                    {item.text}{" "}
                    <span className="text-gray-400 dark:text-gray-500 text-xs">· {item.time}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
              Tools
            </p>
            <div className="flex flex-wrap gap-1.5">
              {agent.tools.map((tool) => (
                <span
                  key={tool}
                  className="font-mono text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-6 pt-0">
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-sm font-semibold py-3 rounded-xl transition-all">
            Start conversation →
          </button>
        </div>
      </div>
    </>
  );
}
