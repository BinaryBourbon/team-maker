"use client";
import { useState } from "react";
import { AgentDrawer } from "@/components/vision/AgentDrawer";
import { OrgChartView } from "@/components/vision/OrgChartView";
import { DepartmentsView } from "@/components/vision/DepartmentsView";
import { ActivityFeedView } from "@/components/vision/ActivityFeedView";
import { ORG_AGENTS } from "@/data/orgFixtures";

type View = "chart" | "departments" | "activity";

export default function OrgPage() {
  const [view, setView] = useState<View>("chart");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const selectedAgent = selectedAgentId
    ? ORG_AGENTS.find((a) => a.id === selectedAgentId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center gap-4 mb-3">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back
          </a>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Your AI Org Chart</h1>
            <p className="text-xs text-gray-500">
              Hire by role. Deploy by team. Manage like a company.
            </p>
          </div>
          <a
            href="/vision/one-agent"
            className="text-sm text-blue-500 hover:underline"
          >
            ← See the studio vision
          </a>
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>9 agents</span>
          <span>8 tools connected</span>
          <span>4 departments</span>
          <span className="text-green-600 font-medium">$0 / mo</span>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1">
          {(["chart", "departments", "activity"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                view === v
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {v === "chart" ? "Org Chart" : v === "departments" ? "Departments" : "Activity"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {view === "chart" && <OrgChartView onSelectAgent={setSelectedAgentId} />}
        {view === "departments" && <DepartmentsView onSelectAgent={setSelectedAgentId} />}
        {view === "activity" && <ActivityFeedView onSelectAgent={setSelectedAgentId} />}
      </div>

      <AgentDrawer agent={selectedAgent} onClose={() => setSelectedAgentId(null)} />
    </div>
  );
}
