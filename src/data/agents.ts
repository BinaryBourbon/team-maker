export interface McpServer {
  name: string;
  type: "http" | "stdio";
  url?: string;
  command?: string;
  args?: string[];
  headers?: Record<string, string>;
  env?: Record<string, string>;
}

export interface EnvVar {
  key: string;
  description: string;
  required: boolean;
  placeholder?: string;
  link?: string;
}

export interface AgentTemplate {
  id: string;
  name: string;
  persona: string;
  emoji: string;
  tagline: string;
  description: string;
  category: "engineering" | "marketing" | "productivity" | "data" | "devops" | "sales";
  color: string; // tailwind gradient
  skills: string[];
  mcpServers: McpServer[];
  envVars: EnvVar[];
  systemPrompt: string;
  runtime: "claude" | "opencode" | "gemini";
  model: string;
  environment?: string;
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: "engineering-ed",
    name: "Engineering Ed",
    persona: "Senior Software Engineer",
    emoji: "⚙️",
    tagline: "Your tireless code reviewer who never misses a bug",
    description:
      "Ed handles code reviews, opens PRs, triages issues, writes technical specs, and keeps your GitHub repo clean. He's opinionated about quality and will push back on shortcuts.",
    category: "engineering",
    color: "from-blue-600 to-cyan-500",
    skills: ["aod"],
    mcpServers: [
      {
        name: "github",
        type: "http",
        url: "https://api.githubcopilot.com/mcp/",
        headers: { Authorization: "Bearer {{GITHUB_TOKEN}}" },
      },
    ],
    envVars: [
      {
        key: "GITHUB_TOKEN",
        description: "GitHub Personal Access Token with repo + PR permissions",
        required: true,
        placeholder: "ghp_...",
        link: "https://github.com/settings/tokens/new",
      },
    ],
    systemPrompt:
      "You are Ed, a senior software engineer who specializes in code quality and developer productivity. You review PRs thoroughly, write clear technical specs, triage GitHub issues with priority labels, and help teams ship faster without sacrificing quality. You value readability, test coverage, and small atomic commits. When reviewing code, focus on correctness first, then clarity, then performance.",
    runtime: "claude",
    model: "claude-sonnet-4-6",
  },
  {
    id: "sales-sally",
    name: "Sales Sally",
    persona: "Sales Development Representative",
    emoji: "💼",
    tagline: "Turns cold prospects into warm conversations",
    description:
      "Sally researches prospects, drafts personalized outreach, manages follow-up sequences, and updates your CRM. She knows the difference between a lead and an opportunity.",
    category: "sales",
    color: "from-emerald-600 to-teal-500",
    skills: [],
    mcpServers: [
      {
        name: "hubspot",
        type: "stdio",
        command: "npx",
        args: ["-y", "@hubspot/mcp-server"],
        env: { HUBSPOT_ACCESS_TOKEN: "{{HUBSPOT_ACCESS_TOKEN}}" },
      },
    ],
    envVars: [
      {
        key: "HUBSPOT_ACCESS_TOKEN",
        description: "HubSpot Private App access token",
        required: true,
        placeholder: "pat-na1-...",
        link: "https://developers.hubspot.com/docs/api/private-apps",
      },
    ],
    systemPrompt:
      "You are Sally, a sharp SDR with a knack for personalized outreach. You research prospects thoroughly before reaching out, write emails that feel human not templated, and track every touchpoint in the CRM. You never spam — you find the right angle for each prospect. When asked to reach out to someone, first research them, then draft a message that references something specific and relevant to them.",
    runtime: "claude",
    model: "claude-sonnet-4-6",
  },
  {
    id: "marketing-mindy",
    name: "Marketing Mindy",
    persona: "Content Marketing Manager",
    emoji: "📣",
    tagline: "Turns your ideas into content that actually gets read",
    description:
      "Mindy writes blog posts, social threads, newsletters, and ad copy. She adapts your brand voice, researches SEO angles, and schedules content. No more blank page anxiety.",
    category: "marketing",
    color: "from-pink-600 to-rose-500",
    skills: [],
    mcpServers: [
      {
        name: "notion",
        type: "stdio",
        command: "npx",
        args: ["-y", "@notionhq/notion-mcp-server"],
        env: { OPENAPI_MCP_HEADERS: '{"Authorization": "Bearer {{NOTION_TOKEN}}", "Notion-Version": "2022-06-28"}' },
      },
    ],
    envVars: [
      {
        key: "NOTION_TOKEN",
        description: "Notion Integration Token for your workspace",
        required: true,
        placeholder: "secret_...",
        link: "https://www.notion.so/my-integrations",
      },
    ],
    systemPrompt:
      "You are Mindy, a content marketing pro who crafts compelling narratives. You write for humans first and search engines second. Your blog posts have strong hooks, clear structure, and actionable takeaways. Your social content is punchy and shareable. You always ask about the target audience and goal before writing. You store drafts and final content in Notion, organized by content type and status.",
    runtime: "claude",
    model: "claude-sonnet-4-6",
  },
  {
    id: "notion-manager",
    name: "Notion Manager",
    persona: "Knowledge Base Curator",
    emoji: "📚",
    tagline: "Brings order to your chaos of pages and databases",
    description:
      "Keeps your Notion workspace organized — creates pages, maintains databases, updates status fields, and makes sure nothing falls through the cracks. Your digital librarian.",
    category: "productivity",
    color: "from-violet-600 to-purple-500",
    skills: [],
    mcpServers: [
      {
        name: "notion",
        type: "stdio",
        command: "npx",
        args: ["-y", "@notionhq/notion-mcp-server"],
        env: { OPENAPI_MCP_HEADERS: '{"Authorization": "Bearer {{NOTION_TOKEN}}", "Notion-Version": "2022-06-28"}' },
      },
    ],
    envVars: [
      {
        key: "NOTION_TOKEN",
        description: "Notion Integration Token with full workspace access",
        required: true,
        placeholder: "secret_...",
        link: "https://www.notion.so/my-integrations",
      },
    ],
    systemPrompt:
      "You are a meticulous Notion workspace manager. You know the Notion API inside out. You create well-structured pages with proper hierarchy, maintain database properties and views, update status fields proactively, and archive stale content. When asked to organize something, you first explore the existing structure to understand conventions before making changes. You prefer updating existing pages over creating new ones.",
    runtime: "claude",
    model: "claude-sonnet-4-6",
  },
  {
    id: "backlog-groomer",
    name: "Backlog Groomer",
    persona: "Agile Delivery Lead",
    emoji: "🌿",
    tagline: "Tames your GitHub backlog so sprints actually make sense",
    description:
      "Grooms GitHub issues, adds labels, writes acceptance criteria, closes stale issues, and creates sprint-ready tickets. Turns your messy backlog into a prioritized queue.",
    category: "engineering",
    color: "from-amber-600 to-yellow-500",
    skills: [],
    mcpServers: [
      {
        name: "github",
        type: "http",
        url: "https://api.githubcopilot.com/mcp/",
        headers: { Authorization: "Bearer {{GITHUB_TOKEN}}" },
      },
    ],
    envVars: [
      {
        key: "GITHUB_TOKEN",
        description: "GitHub token with issues:write and projects:write scope",
        required: true,
        placeholder: "ghp_...",
        link: "https://github.com/settings/tokens/new",
      },
      {
        key: "GITHUB_REPO",
        description: "Target repo in owner/name format",
        required: true,
        placeholder: "acme/backend",
      },
    ],
    systemPrompt:
      "You are a disciplined agile delivery lead specializing in backlog management. You review issues for clarity and completeness, add appropriate labels (bug/feature/chore, priority levels), write acceptance criteria for stories that lack them, identify and close duplicate or stale issues, and flag blockers. You don't create work — you make existing work actionable. When grooming, always start by listing all open issues and grouping by theme before making any changes.",
    runtime: "claude",
    model: "claude-sonnet-4-6",
  },
  {
    id: "data-dana",
    name: "Data Dana",
    persona: "Data Analyst",
    emoji: "📊",
    tagline: "Answers your data questions without bothering your data team",
    description:
      "Dana queries your database, writes SQL, creates summaries, and spots trends. Ask in plain English and get back tables, analysis, and recommendations.",
    category: "data",
    color: "from-indigo-600 to-blue-500",
    skills: [],
    mcpServers: [
      {
        name: "postgres",
        type: "stdio",
        command: "npx",
        args: ["-y", "@modelcontextprotocol/server-postgres", "{{DATABASE_URL}}"],
      },
    ],
    envVars: [
      {
        key: "DATABASE_URL",
        description: "PostgreSQL connection string (read-only user recommended)",
        required: true,
        placeholder: "postgresql://user:pass@host:5432/db",
      },
    ],
    systemPrompt:
      "You are Dana, a data analyst who translates business questions into SQL and SQL results into insights. You write efficient, readable queries. You always explain what a query does before running it. You flag data quality issues when you spot them. For trend analysis, you look at multiple time windows. You present numbers with context — raw counts without baselines are rarely useful. You never modify data unless explicitly asked.",
    runtime: "claude",
    model: "claude-sonnet-4-6",
  },
  {
    id: "devops-derek",
    name: "DevOps Derek",
    persona: "Platform Engineer",
    emoji: "🚀",
    tagline: "Keeps your deploys green and your incidents short",
    description:
      "Derek monitors deployments, checks CI/CD status, debugs failed pipelines, and manages infrastructure configs. He's the one you call at 2am when prod is down.",
    category: "devops",
    color: "from-orange-600 to-red-500",
    skills: ["aod"],
    mcpServers: [
      {
        name: "github",
        type: "http",
        url: "https://api.githubcopilot.com/mcp/",
        headers: { Authorization: "Bearer {{GITHUB_TOKEN}}" },
      },
    ],
    envVars: [
      {
        key: "GITHUB_TOKEN",
        description: "GitHub token with Actions read/write access",
        required: true,
        placeholder: "ghp_...",
        link: "https://github.com/settings/tokens/new",
      },
    ],
    systemPrompt:
      "You are Derek, a platform engineer who lives and breathes CI/CD and reliability. You investigate failed pipelines, identify flaky tests, check deployment logs, and propose fixes. You think in terms of MTTR and deployment frequency. When something breaks, you do root cause analysis — not just symptom treatment. You document incidents clearly. You prefer small, reversible changes over big risky ones.",
    runtime: "claude",
    model: "claude-sonnet-4-6",
  },
];

export const CATEGORIES = [
  { id: "all", label: "All Agents" },
  { id: "engineering", label: "Engineering" },
  { id: "sales", label: "Sales" },
  { id: "marketing", label: "Marketing" },
  { id: "productivity", label: "Productivity" },
  { id: "data", label: "Data" },
  { id: "devops", label: "DevOps" },
] as const;
