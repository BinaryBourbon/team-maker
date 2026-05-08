"use client";
import { ACTIVITY_FEED } from "@/data/orgFixtures";

interface ActivityFeedViewProps {
  onSelectAgent: (agentId: string) => void;
}

export function ActivityFeedView({ onSelectAgent }: ActivityFeedViewProps) {
  return (
    <div className="max-w-2xl space-y-1">
      {ACTIVITY_FEED.map((item, i) => (
        <button
          key={i}
          onClick={() => onSelectAgent(item.agentId)}
          className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800/60 ${
            item.isError
              ? "bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400"
              : "border-l-4 border-transparent"
          }`}
        >
          {/* Emoji circle */}
          <span className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
            {item.agentEmoji}
          </span>

          {/* Main content */}
          <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 leading-snug pt-0.5">
            <span className="font-semibold text-gray-900 dark:text-white">{item.agentName}</span>{" "}
            {item.action}
          </span>

          {/* Time */}
          <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 pt-0.5 whitespace-nowrap">
            {item.time}
          </span>
        </button>
      ))}
    </div>
  );
}
