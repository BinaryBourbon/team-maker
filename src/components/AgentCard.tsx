"use client";

import { AgentTemplate } from "@/data/agents";

interface AgentCardProps {
  agent: AgentTemplate;
  onHire: (agent: AgentTemplate) => void;
}

export function AgentCard({ agent, onHire }: AgentCardProps) {
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Gradient header */}
      <div className={`h-2 w-full bg-gradient-to-r ${agent.color}`} />

      <div className="p-6">
        {/* Emoji + name */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-4xl" role="img" aria-label={agent.name}>
              {agent.emoji}
            </span>
            <div className="mt-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{agent.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{agent.persona}</p>
            </div>
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r ${agent.color} text-white`}
          >
            {agent.category}
          </span>
        </div>

        {/* Tagline */}
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 italic mb-3">
          &ldquo;{agent.tagline}&rdquo;
        </p>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{agent.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {agent.mcpServers.map((s) => (
            <span
              key={s.name}
              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md"
            >
              🔌 {s.name}
            </span>
          ))}
          {agent.skills.map((s) => (
            <span
              key={s}
              className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md"
            >
              ⚡ {s}
            </span>
          ))}
        </div>

        {/* Env vars needed */}
        {agent.envVars.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wide font-medium">
              Needs {agent.envVars.length} secret{agent.envVars.length > 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap gap-1">
              {agent.envVars.map((v) => (
                <code
                  key={v.key}
                  className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded font-mono"
                >
                  {v.key}
                </code>
              ))}
            </div>
          </div>
        )}

        {/* Hire button */}
        <button
          onClick={() => onHire(agent)}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${agent.color} hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm`}
        >
          Hire {agent.name.split(" ")[0]} →
        </button>
      </div>
    </div>
  );
}
