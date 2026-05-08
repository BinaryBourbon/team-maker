"use client";

import { useState } from "react";
import { AGENT_TEMPLATES, CATEGORIES, AgentTemplate } from "@/data/agents";
import { AgentCard } from "@/components/AgentCard";
import { HireModal } from "@/components/HireModal";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [hiringAgent, setHiringAgent] = useState<AgentTemplate | null>(null);

  const filtered = AGENT_TEMPLATES.filter((a) => {
    const matchesCategory = selectedCategory === "all" || a.category === selectedCategory;
    const matchesSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.tagline.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-1.5 text-sm text-gray-600 dark:text-gray-400 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Built on <a href="http://jakegaylor.com/aod-ex/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">AoD</a>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            Hire Your
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}Dream Team
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Pre-built AI agents with the right tools, prompts, and integrations.
            One click to add them to your AoD instance.
          </p>

          {/* Vision nav */}
          <div className="flex justify-center gap-3 mb-8">
            <a
              href="/vision/one-agent"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              🎯 Build One Great Agent
            </a>
            <a
              href="/vision/org"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              🏢 Multi-Agent Org
            </a>
            <a
              href="/vision/mission-control"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              🎯 Mission Control
            </a>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div>
              <span className="font-bold text-2xl text-gray-900 dark:text-white">{AGENT_TEMPLATES.length}</span>
              <br />agents ready
            </div>
            <div>
              <span className="font-bold text-2xl text-gray-900 dark:text-white">
                {[...new Set(AGENT_TEMPLATES.flatMap((a) => a.mcpServers.map((s) => s.name)))].length}
              </span>
              <br />integrations
            </div>
            <div>
              <span className="font-bold text-2xl text-gray-900 dark:text-white">1-click</span>
              <br />deployment
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agent grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🤷</div>
            <p>No agents match your search. Try a different term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onHire={setHiringAgent} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            Team Maker — discover and deploy AI agents to your{" "}
            <a href="http://jakegaylor.com/aod-ex/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Agent on Demand
            </a>{" "}
            instance.{" "}
            <a href="https://github.com/BinaryBourbon/team-maker" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Open source
            </a>
            .
          </p>
        </div>
      </footer>

      {/* Hire Modal */}
      <HireModal agent={hiringAgent} onClose={() => setHiringAgent(null)} />
    </div>
  );
}
