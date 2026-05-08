"use client";
import { ORG_AGENTS, OrgAgent } from "@/data/orgFixtures";

interface OrgChartViewProps {
  onSelectAgent: (agentId: string) => void;
}

const statusDotColor: Record<OrgAgent["status"], string> = {
  active: "bg-green-500",
  idle: "bg-yellow-500",
  error: "bg-red-500",
};

function AgentNode({
  agentId,
  onSelectAgent,
}: {
  agentId: string;
  onSelectAgent: (id: string) => void;
}) {
  const agent = ORG_AGENTS.find((a) => a.id === agentId);
  if (!agent) return null;

  const isError = agent.status === "error";

  return (
    <button
      onClick={() => onSelectAgent(agent.id)}
      className={`w-[140px] flex flex-col items-center gap-1 p-3 rounded-xl bg-white dark:bg-gray-900 border transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
        isError
          ? "border-red-400 ring-2 ring-red-400/50"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <span className="text-3xl">{agent.emoji}</span>
      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 text-center leading-tight">
        {agent.name}
      </span>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span
          className={`w-2.5 h-2.5 rounded-full inline-block ${statusDotColor[agent.status]}`}
        />
        <span className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[88px]">
          {agent.lastUsed}
        </span>
      </div>
    </button>
  );
}

function VerticalConnector() {
  return <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-auto" />;
}

export function OrgChartView({ onSelectAgent }: OrgChartViewProps) {
  return (
    <>
      {/* Mobile fallback */}
      <div className="lg:hidden flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-3">🖥️</span>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Desktop recommended</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          The org chart is best viewed on a larger screen. Switch to Departments or Activity view on
          mobile.
        </p>
      </div>

      {/* Desktop chart */}
      <div className="hidden lg:block">
        <div className="flex flex-col items-center gap-0">
          {/* Row 1: Executive Copilot */}
          <div className="flex justify-center">
            <AgentNode agentId="executive-copilot" onSelectAgent={onSelectAgent} />
          </div>

          {/* Connector row 1→2 */}
          <VerticalConnector />

          {/* Row 2: The Operator, Sales Sally, DevOps Derek */}
          <div className="flex justify-around w-full max-w-2xl">
            <AgentNode agentId="the-operator" onSelectAgent={onSelectAgent} />
            <AgentNode agentId="sales-sally" onSelectAgent={onSelectAgent} />
            <AgentNode agentId="devops-derek" onSelectAgent={onSelectAgent} />
          </div>

          {/* Connector row 2→3 — one line per parent */}
          <div className="flex justify-around w-full max-w-2xl">
            {/* Under The Operator: 2 children */}
            <div className="flex justify-around w-[300px]">
              <VerticalConnector />
              <VerticalConnector />
            </div>
            {/* Under Sales Sally: 1 child */}
            <div className="flex justify-center w-[140px]">
              <VerticalConnector />
            </div>
            {/* Under DevOps Derek: 2 children */}
            <div className="flex justify-around w-[300px]">
              <VerticalConnector />
              <VerticalConnector />
            </div>
          </div>

          {/* Row 3: Ed, Backlog | Mindy | Steve, Dana */}
          <div className="flex items-start w-full max-w-2xl">
            {/* Under The Operator */}
            <div className="flex justify-around w-[300px]">
              <AgentNode agentId="engineering-ed" onSelectAgent={onSelectAgent} />
              <AgentNode agentId="backlog-groomer" onSelectAgent={onSelectAgent} />
            </div>
            {/* Under Sales Sally */}
            <div className="flex justify-center w-[140px]">
              <AgentNode agentId="marketing-mindy" onSelectAgent={onSelectAgent} />
            </div>
            {/* Under DevOps Derek */}
            <div className="flex justify-around w-[300px]">
              <AgentNode agentId="security-steve" onSelectAgent={onSelectAgent} />
              <AgentNode agentId="data-dana" onSelectAgent={onSelectAgent} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
