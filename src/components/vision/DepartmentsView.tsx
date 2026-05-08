"use client";
import { useState } from "react";
import { ORG_AGENTS, ORG_DEPARTMENTS } from "@/data/orgFixtures";

interface DepartmentsViewProps {
  onSelectAgent: (agentId: string) => void;
}

type DeployState = "idle" | "confirm" | "deploying" | "deployed";

function DepartmentCard({
  deptId,
  onSelectAgent,
}: {
  deptId: string;
  onSelectAgent: (id: string) => void;
}) {
  const [deployState, setDeployState] = useState<DeployState>("idle");

  const dept = ORG_DEPARTMENTS.find((d) => d.id === deptId);
  if (!dept) return null;

  const agents = ORG_AGENTS.filter((a) => dept.agentIds.includes(a.id));
  const uniqueTools = [...new Set(agents.flatMap((a) => a.tools))];
  const activeCount = agents.filter((a) => a.status === "active").length;
  const idleCount = agents.filter((a) => a.status === "idle").length;
  const errorCount = agents.filter((a) => a.status === "error").length;

  function handleDeploy() {
    if (deployState === "idle") {
      setDeployState("confirm");
    } else if (deployState === "confirm") {
      setDeployState("deploying");
      setTimeout(() => setDeployState("deployed"), 1500);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* Colored top strip */}
      <div className={`h-1 w-full ${dept.color}`} />

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">{dept.name}</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {agents.length} agent{agents.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Emoji avatars */}
        <div className="flex gap-2 flex-wrap">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent.id)}
              title={agent.name}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl hover:ring-2 hover:ring-blue-400 transition-all"
            >
              {agent.emoji}
            </button>
          ))}
        </div>

        {/* Tools count */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-200">{uniqueTools.length}</span>{" "}
          tool{uniqueTools.length !== 1 ? "s" : ""} connected
        </p>

        {/* Status line */}
        <p className="text-sm">
          <span className="text-green-600 font-medium">{activeCount} active</span>
          <span className="text-gray-400"> · </span>
          <span className="text-yellow-600 font-medium">{idleCount} idle</span>
          {errorCount > 0 && (
            <>
              <span className="text-gray-400"> · </span>
              <span className="text-red-600 font-medium">{errorCount} error</span>
            </>
          )}
        </p>

        {/* Deploy button */}
        <div className="mt-auto pt-2">
          {deployState === "idle" && (
            <button
              onClick={handleDeploy}
              className="w-full text-sm font-medium py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Deploy Team
            </button>
          )}
          {deployState === "confirm" && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Deploy all {agents.length} agents in {dept.name}?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeployState("idle")}
                  className="flex-1 text-sm py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeploy}
                  className="flex-1 text-sm font-medium py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
          {deployState === "deploying" && (
            <button
              disabled
              className="w-full text-sm font-medium py-2 px-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 cursor-not-allowed"
            >
              Deploying...
            </button>
          )}
          {deployState === "deployed" && (
            <button
              disabled
              className="w-full text-sm font-medium py-2 px-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-not-allowed"
            >
              ✓ Deployed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DepartmentsView({ onSelectAgent }: DepartmentsViewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
      {ORG_DEPARTMENTS.map((dept) => (
        <DepartmentCard key={dept.id} deptId={dept.id} onSelectAgent={onSelectAgent} />
      ))}
    </div>
  );
}
