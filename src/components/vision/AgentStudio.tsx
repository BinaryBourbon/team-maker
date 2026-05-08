"use client";
import { useState, useEffect, useCallback } from "react";
import { AGENT_TEMPLATES, AgentTemplate } from "@/data/agents";
import { VISION_PROMPTS, FOCUS_AREAS, TOOL_DESCRIPTIONS } from "@/data/visionFixtures";

type Depth = "Quick" | "Balanced" | "Deep";

function getAgentAccentColor(colorClass: string): string {
  const map: Record<string, string> = {
    "from-blue-600": "#2563eb",
    "from-emerald-600": "#059669",
    "from-pink-600": "#db2777",
    "from-violet-600": "#7c3aed",
    "from-amber-600": "#d97706",
    "from-indigo-600": "#4f46e5",
    "from-orange-600": "#ea580c",
    "from-cyan-600": "#0891b2",
    "from-rose-500": "#f43f5e",
    "from-slate-600": "#475569",
    "from-purple-600": "#9333ea",
    "from-yellow-500": "#eab308",
    "from-amber-500": "#f59e0b",
    "from-green-600": "#16a34a",
    "from-gray-800": "#1f2937",
  };
  const key = colorClass.split(" ")[0];
  return map[key] || "#6366f1";
}

function getPrompts(category: string, focus: string): { q: string; a: string }[] {
  const specificKey = `${category}-${focus}`;
  if (VISION_PROMPTS[specificKey]) return VISION_PROMPTS[specificKey];
  if (VISION_PROMPTS[category]) return VISION_PROMPTS[category];
  return [];
}

function getCapabilityBullets(agent: AgentTemplate, activeTools: Set<string>): string[] {
  const bullets: string[] = [];
  for (const server of agent.mcpServers) {
    if (activeTools.has(server.name) && TOOL_DESCRIPTIONS[server.name]) {
      bullets.push(`${server.name.charAt(0).toUpperCase() + server.name.slice(1)}: ${TOOL_DESCRIPTIONS[server.name]}`);
    }
  }
  return bullets.slice(0, 3);
}

export function AgentStudio() {
  const [selectedAgent, setSelectedAgent] = useState<AgentTemplate>(AGENT_TEMPLATES[0]);
  const [search, setSearch] = useState("");
  const [activeFocus, setActiveFocus] = useState<string>(
    () => FOCUS_AREAS[AGENT_TEMPLATES[0].category]?.[0] ?? ""
  );
  const [activeTools, setActiveTools] = useState<Set<string>>(
    () => new Set(AGENT_TEMPLATES[0].mcpServers.map((s) => s.name))
  );
  const [depth, setDepth] = useState<Depth>("Balanced");
  const [activePromptIdx, setActivePromptIdx] = useState<number | null>(null);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const accentColor = getAgentAccentColor(selectedAgent.color);

  const filteredAgents = AGENT_TEMPLATES.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.persona.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  });

  const handleSelectAgent = useCallback((agent: AgentTemplate) => {
    setSelectedAgent(agent);
    setActiveFocus(FOCUS_AREAS[agent.category]?.[0] ?? "");
    setActiveTools(new Set(agent.mcpServers.map((s) => s.name)));
    setActivePromptIdx(null);
    setDisplayedResponse("");
    setIsTyping(false);
  }, []);

  const handleFocusChange = (focus: string) => {
    setActiveFocus(focus);
    setActivePromptIdx(null);
    setDisplayedResponse("");
    setIsTyping(false);
  };

  const toggleTool = (toolName: string) => {
    setActiveTools((prev) => {
      const next = new Set(prev);
      if (next.has(toolName)) {
        next.delete(toolName);
      } else {
        next.add(toolName);
      }
      return next;
    });
  };

  const handleSelectPrompt = (idx: number) => {
    setActivePromptIdx(idx);
    setDisplayedResponse("");
    setIsTyping(true);
  };

  // Typing animation
  useEffect(() => {
    if (activePromptIdx === null || !isTyping) return;

    const prompts = getPrompts(selectedAgent.category, activeFocus);
    const fullResponse = prompts[activePromptIdx]?.a ?? "";
    if (!fullResponse) {
      setIsTyping(false);
      return;
    }

    const words = fullResponse.split(" ");
    let wordIndex = 0;

    const interval = setInterval(() => {
      wordIndex += 1;
      setDisplayedResponse(words.slice(0, wordIndex).join(" "));
      if (wordIndex >= words.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [activePromptIdx, isTyping, selectedAgent.category, activeFocus]);

  const prompts = getPrompts(selectedAgent.category, activeFocus);
  const focusAreas = FOCUS_AREAS[selectedAgent.category] ?? [];
  const capabilityBullets = getCapabilityBullets(selectedAgent, activeTools);
  const depths: Depth[] = ["Quick", "Balanced", "Deep"];

  // Tool emoji map
  const toolEmoji: Record<string, string> = {
    github: "🐙",
    notion: "📝",
    hubspot: "🟠",
    linear: "📐",
    slack: "💬",
    postgres: "🐘",
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 h-[calc(100vh-65px)]">
      {/* Left sidebar */}
      <aside className="lg:w-72 shrink-0 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-gray-200 dark:border-gray-800">
          <input
            type="text"
            placeholder="Search agents…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredAgents.map((agent) => {
            const isActive = agent.id === selectedAgent.id;
            const agentAccent = getAgentAccentColor(agent.color);
            return (
              <button
                key={agent.id}
                onClick={() => handleSelectAgent(agent)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 border-l-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  isActive
                    ? "bg-gray-50 dark:bg-gray-800"
                    : "border-l-transparent"
                }`}
                style={isActive ? { borderLeftColor: agentAccent } : undefined}
              >
                <span className="text-2xl leading-none mt-0.5 shrink-0">{agent.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {agent.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {agent.persona}
                  </p>
                </div>
              </button>
            );
          })}
          {filteredAgents.length === 0 && (
            <p className="p-4 text-sm text-gray-400 text-center">No agents found</p>
          )}
        </div>
      </aside>

      {/* Right main panel */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-3xl mx-auto">
          {/* Config section */}
          <section>
            {/* Identity row */}
            <div className="flex items-start gap-4">
              <span className="text-5xl leading-none">{selectedAgent.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedAgent.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {selectedAgent.persona}
                </p>
              </div>
            </div>

            {/* Focus chips */}
            {focusAreas.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {focusAreas.map((focus) => {
                  const isActive = focus === activeFocus;
                  return (
                    <button
                      key={focus}
                      onClick={() => handleFocusChange(focus)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${selectedAgent.color} text-white shadow-sm`
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {focus}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tools */}
            {selectedAgent.mcpServers.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Tools
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {selectedAgent.mcpServers.map((server) => {
                    const isOn = activeTools.has(server.name);
                    return (
                      <button
                        key={server.name}
                        onClick={() => toggleTool(server.name)}
                        className={`flex items-start gap-2 p-3 rounded-xl border-2 cursor-pointer text-left transition-all ${
                          isOn
                            ? "opacity-100"
                            : "border-gray-200 dark:border-gray-700 opacity-50"
                        }`}
                        style={isOn ? { borderColor: accentColor } : undefined}
                      >
                        <span className="text-xl leading-none shrink-0 mt-0.5">
                          {toolEmoji[server.name] ?? "🔧"}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                            {server.name}
                          </p>
                          {TOOL_DESCRIPTIONS[server.name] && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-0.5">
                              {TOOL_DESCRIPTIONS[server.name]}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Depth pills */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Response Depth
              </p>
              <div className="flex gap-2">
                {depths.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDepth(d)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      depth === d
                        ? `bg-gradient-to-r ${selectedAgent.color} text-white shadow-sm`
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

          {/* Preview section */}
          <section>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Try a prompt
            </p>

            {prompts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {prompts.map((prompt, idx) => {
                  const isActive = idx === activePromptIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectPrompt(idx)}
                      className={`p-3 rounded-xl border text-left text-sm transition-all hover:shadow-sm ${
                        isActive
                          ? "bg-gray-50 dark:bg-gray-800"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900"
                      }`}
                      style={isActive ? { borderColor: accentColor } : undefined}
                    >
                      <span className="text-gray-700 dark:text-gray-300 line-clamp-3">
                        {prompt.q}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No example prompts for this focus area yet.
              </p>
            )}

            {/* Response area */}
            {activePromptIdx !== null && (
              <div className="mt-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl leading-none">{selectedAgent.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedAgent.name}
                    </p>
                    <p className="text-xs text-gray-500">{selectedAgent.persona}</p>
                  </div>
                  {isTyping && (
                    <span className="ml-auto text-lg animate-pulse text-gray-400">●●●</span>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {displayedResponse}
                  {isTyping && (
                    <span className="inline-block w-1.5 h-4 ml-0.5 bg-gray-400 animate-pulse rounded-sm align-middle" />
                  )}
                </p>
              </div>
            )}

            {/* Capability summary */}
            <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                With this configuration, {selectedAgent.name} can:
              </p>
              {capabilityBullets.length > 0 ? (
                <ul className="space-y-1.5">
                  {capabilityBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: accentColor }}
                      />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">
                  Enable at least one tool above to see capabilities.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
