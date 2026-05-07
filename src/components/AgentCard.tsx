"use client";

import { useState } from "react";
import { AgentTemplate } from "@/data/agents";
import { generateReadableManifest } from "@/lib/manifest";

interface AgentCardProps {
  agent: AgentTemplate;
  onHire: (agent: AgentTemplate) => void;
}

function getExamplePrompts(agent: AgentTemplate): string[] {
  const promptMap: Record<string, string[]> = {
    "engineering-ed": [
      "Review my latest PR and flag any issues with test coverage or code clarity",
      "Triage all open issues in my repo and add priority labels",
      "Write a technical spec for adding OAuth2 login to our app",
    ],
    "sales-sally": [
      "Research Acme Corp and draft a personalized outreach email for their CTO",
      "Update all leads in HubSpot that went cold in the last 30 days",
      "Create a follow-up sequence for prospects who opened my email but didn't reply",
    ],
    "marketing-mindy": [
      "Write a blog post about the top 5 mistakes teams make when adopting AI",
      "Draft 5 Twitter/X threads based on our latest product launch",
      "Create a newsletter for this week highlighting our new feature releases",
    ],
    "notion-manager": [
      "Organize my Notion workspace by creating a master project tracker database",
      "Update all project pages to include a status field and owner property",
      "Archive all pages that haven't been edited in over 6 months",
    ],
    "backlog-groomer": [
      "Review all open issues and add bug/feature/chore labels with priority levels",
      "Write acceptance criteria for the 10 oldest ungroomed issues",
      "Find and close all duplicate or stale issues older than 3 months",
    ],
    "data-dana": [
      "How many new users signed up this week compared to last week?",
      "Show me the top 10 customers by revenue for Q1 with month-over-month trends",
      "Are there any anomalies in our order data from the past 48 hours?",
    ],
    "devops-derek": [
      "Why did the last deployment fail and what should I fix?",
      "Check if there are any flaky tests in our CI pipeline from the last week",
      "Review our GitHub Actions workflow and suggest optimizations to cut build time",
    ],
  };

  if (promptMap[agent.id]) return promptMap[agent.id];

  // Fallback: generate generic prompts based on category
  const categoryPrompts: Record<string, string[]> = {
    engineering: [
      `Review recent code changes and highlight potential issues`,
      `Help triage open issues and suggest priorities`,
      `Draft a technical document for an upcoming feature`,
    ],
    marketing: [
      `Write compelling copy for our latest campaign`,
      `Research content trends and suggest a content calendar`,
      `Draft a newsletter for our subscribers`,
    ],
    sales: [
      `Research a prospect and draft a personalized outreach`,
      `Update CRM records and flag stale opportunities`,
      `Create a follow-up sequence for warm leads`,
    ],
    productivity: [
      `Organize and clean up our workspace`,
      `Create a summary of this week's activity`,
      `Set up a new project structure with proper tracking`,
    ],
    data: [
      `Run a report on key metrics from the last 30 days`,
      `Identify trends or anomalies in our data`,
      `Create a summary dashboard of our most important KPIs`,
    ],
    devops: [
      `Check the status of recent deployments`,
      `Investigate any failing CI/CD pipelines`,
      `Review infrastructure configs for potential improvements`,
    ],
  };

  return categoryPrompts[agent.category] || [
    `What can you help me with today?`,
    `Give me a summary of recent activity`,
    `Help me get started with a new task`,
  ];
}

function mcpServerToYaml(agent: AgentTemplate): string {
  if (agent.mcpServers.length === 0) return "mcp_servers: {}";
  const lines = ["mcp_servers:"];
  agent.mcpServers.forEach((s) => {
    lines.push(`  ${s.name}:`);
    lines.push(`    type: ${s.type}`);
    if (s.url) lines.push(`    url: ${s.url}`);
    if (s.command) lines.push(`    command: ${s.command}`);
    if (s.args && s.args.length > 0) {
      lines.push(`    args:`);
      s.args.forEach((a) => lines.push(`      - ${a}`));
    }
    if (s.headers) {
      lines.push(`    headers:`);
      Object.entries(s.headers).forEach(([k, v]) => lines.push(`      ${k}: ${v}`));
    }
    if (s.env) {
      lines.push(`    env:`);
      Object.entries(s.env).forEach(([k, v]) => lines.push(`      ${k}: ${v}`));
    }
  });
  return lines.join("\n");
}

export function AgentCard({ agent, onHire }: AgentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const examplePrompts = getExamplePrompts(agent);
  const mcpYaml = mcpServerToYaml(agent);

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

        {/* Details toggle */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 w-full text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex items-center justify-center gap-1"
        >
          {expanded ? "▲ Hide details" : "▼ Details"}
        </button>

        {/* Expanded detail panel */}
        {expanded && (
          <div className="mt-4 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            {/* Runtime badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">
                Runtime: {agent.runtime} | Model: {agent.model}
              </span>
            </div>

            {/* System prompt */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                System Prompt
              </p>
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 py-1 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  {agent.systemPrompt}
                </p>
              </blockquote>
            </div>

            {/* Example prompts */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Example Prompts
              </p>
              <ul className="space-y-1.5">
                {examplePrompts.map((prompt, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="mt-0.5 text-gray-300 dark:text-gray-600 flex-shrink-0">•</span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* MCP server config */}
            {agent.mcpServers.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  MCP Server Config
                </p>
                <pre className="bg-gray-950 text-green-400 text-xs rounded-xl p-3 overflow-x-auto leading-relaxed font-mono max-h-48 overflow-y-auto">
                  {mcpYaml}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
