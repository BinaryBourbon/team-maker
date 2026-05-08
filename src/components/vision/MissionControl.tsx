"use client";
import { useState } from "react";
import { MISSION_GOALS, MISSION_AGENT_DETAILS, MissionGoal } from "@/data/missionFixtures";

const STATUS_CONFIG = {
  "on-track": { label: "On track", dot: "bg-green-500", text: "text-green-700 dark:text-green-400", badge: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" },
  "at-risk":  { label: "At risk",  dot: "bg-yellow-500", text: "text-yellow-700 dark:text-yellow-400", badge: "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" },
  "blocked":  { label: "Blocked",  dot: "bg-red-500", text: "text-red-700 dark:text-red-400", badge: "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800" },
  "done":     { label: "Done",     dot: "bg-blue-500", text: "text-blue-700 dark:text-blue-400", badge: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
};

const PROGRESS_COLOR = {
  "on-track": "bg-green-500",
  "at-risk": "bg-yellow-500",
  "blocked": "bg-red-500",
  "done": "bg-blue-500",
};

function GoalSidebar({ goals, selected, onSelect }: { goals: MissionGoal[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Goals</p>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {goals.map((goal) => {
          const cfg = STATUS_CONFIG[goal.status];
          const isSelected = goal.id === selected;
          return (
            <button
              key={goal.id}
              onClick={() => onSelect(goal.id)}
              className={`w-full text-left px-4 py-3 transition-colors group ${
                isSelected
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg leading-none mt-0.5">{goal.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                    {goal.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-1 rounded-full ${PROGRESS_COLOR[goal.status]}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{goal.progress}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    <span className={`text-xs ${cfg.text}`}>{cfg.label}</span>
                    <span className="text-xs text-gray-400 ml-auto">due {goal.deadline}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AgentChip({ agentId, onClick }: { agentId: string; onClick: () => void }) {
  const agent = MISSION_AGENT_DETAILS[agentId];
  if (!agent) return null;
  const statusDot = agent.status === "active" ? "bg-green-500 animate-pulse" : agent.status === "error" ? "bg-red-500" : "bg-gray-400";
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all text-left group"
    >
      <span className="text-xl">{agent.emoji}</span>
      <div>
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{agent.name}</p>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-none">{agent.persona}</p>
      </div>
      <span className="ml-auto text-gray-300 group-hover:text-gray-500 text-xs">→</span>
    </button>
  );
}

function OutputFeed({ goal, onAgentClick }: { goal: MissionGoal; onAgentClick: (id: string) => void }) {
  return (
    <div className="space-y-1">
      {goal.outputs.map((item, i) => {
        const isBlocked = item.detail.toLowerCase().startsWith("blocked") || item.action === "flagged risk";
        return (
          <div
            key={i}
            className={`flex gap-3 py-3 px-4 rounded-xl ${isBlocked ? "bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30" : "bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800"}`}
          >
            <button
              onClick={() => onAgentClick(item.agentId)}
              className="shrink-0 hover:scale-110 transition-transform"
              title={item.agentName}
            >
              <span className="text-xl">{item.agentEmoji}</span>
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <button
                  onClick={() => onAgentClick(item.agentId)}
                  className="text-sm font-medium text-gray-900 dark:text-white hover:underline"
                >
                  {item.agentName}
                </button>
                <span className={`text-sm ${isBlocked ? "text-red-600 dark:text-red-400 font-medium" : "text-gray-500"}`}>
                  {item.action}
                </span>
              </div>
              <p className={`text-sm mt-0.5 ${isBlocked ? "text-red-700 dark:text-red-300" : "text-gray-700 dark:text-gray-300"}`}>
                {item.detail}
                {item.link && (
                  <a href={item.link} className="ml-1.5 text-blue-500 hover:underline text-xs">↗</a>
                )}
              </p>
            </div>
            <span className="text-xs text-gray-400 shrink-0 mt-0.5">{item.time}</span>
          </div>
        );
      })}
    </div>
  );
}

function AgentDetailPanel({ agentId, onClose }: { agentId: string; onClose: () => void }) {
  const agent = MISSION_AGENT_DETAILS[agentId];
  if (!agent) return null;
  const statusColor = agent.status === "active" ? "text-green-600" : agent.status === "error" ? "text-red-600" : "text-gray-400";
  const statusLabel = agent.status === "active" ? "Active" : agent.status === "error" ? "Error" : "Idle";

  // Find all goals this agent contributes to
  const agentGoals = MISSION_GOALS.filter((g) => g.agentIds.includes(agentId));
  // Find all outputs from this agent
  const agentOutputs = MISSION_GOALS.flatMap((g) =>
    g.outputs
      .filter((o) => o.agentId === agentId)
      .map((o) => ({ ...o, goalTitle: g.title, goalEmoji: g.emoji }))
  ).slice(0, 5);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-start gap-3">
          <span className="text-3xl">{agent.emoji}</span>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 dark:text-white">{agent.name}</h2>
            <p className="text-sm text-gray-500">{agent.persona}</p>
            <p className={`text-xs font-medium mt-1 ${statusColor}`}>{statusLabel}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
        </div>

        {/* Current task */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Now working on</p>
          <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
            {agent.currentTask}
          </p>
        </div>

        {/* Goals */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contributing to</p>
          <div className="space-y-1.5">
            {agentGoals.map((g) => {
              const cfg = STATUS_CONFIG[g.status];
              return (
                <div key={g.id} className="flex items-center gap-2 text-sm">
                  <span>{g.emoji}</span>
                  <span className="text-gray-700 dark:text-gray-300 flex-1">{g.title}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded border ${cfg.badge}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tools */}
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tools</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.tools.map((t) => (
              <span key={t} className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 font-medium">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Recent outputs */}
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent work</p>
          <div className="space-y-2">
            {agentOutputs.map((o, i) => (
              <div key={i} className="text-sm">
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-0.5">
                  <span>{o.goalEmoji}</span>
                  <span>{o.goalTitle}</span>
                  <span className="ml-auto">{o.time}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="text-gray-500">{o.action} — </span>
                  {o.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function MissionControl() {
  const [selectedGoalId, setSelectedGoalId] = useState(MISSION_GOALS[0].id);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const goal = MISSION_GOALS.find((g) => g.id === selectedGoalId)!;
  const cfg = STATUS_CONFIG[goal.status];

  return (
    <div className="flex h-full min-h-0">
      {/* Left: Goal list */}
      <GoalSidebar
        goals={MISSION_GOALS}
        selected={selectedGoalId}
        onSelect={(id) => { setSelectedGoalId(id); setSelectedAgentId(null); }}
      />

      {/* Center: Goal detail */}
      <div className="flex-1 overflow-y-auto">
        {/* Goal header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{goal.emoji}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{goal.title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{goal.subtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{goal.progress}%</p>
              <p className="text-xs text-gray-400">due {goal.deadline}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className={`h-2 rounded-full transition-all ${PROGRESS_COLOR[goal.status]}`}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>

        {/* Agents on this goal */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Team on this goal</p>
          <div className="grid grid-cols-2 gap-2">
            {goal.agentIds.map((id) => (
              <AgentChip key={id} agentId={id} onClick={() => setSelectedAgentId(id)} />
            ))}
          </div>
        </div>

        {/* Output feed */}
        <div className="px-6 py-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Work done</p>
          <OutputFeed goal={goal} onAgentClick={setSelectedAgentId} />
        </div>
      </div>

      {/* Right: Agent detail drawer */}
      {selectedAgentId && (
        <AgentDetailPanel
          agentId={selectedAgentId}
          onClose={() => setSelectedAgentId(null)}
        />
      )}
    </div>
  );
}
