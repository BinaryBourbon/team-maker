export interface OrgAgent {
  id: string;
  name: string;
  emoji: string;
  persona: string;
  status: "active" | "idle" | "error";
  lastUsed: string;
  currentTask: string;
  recentActivity: { text: string; time: string }[];
  tools: string[];
  errorMessage?: string;
}

export interface OrgDepartment {
  id: string;
  name: string;
  color: string; // tailwind bg color class
  agentIds: string[];
}

export interface ActivityItem {
  agentId: string;
  agentEmoji: string;
  agentName: string;
  action: string;
  time: string;
  isError: boolean;
}

export const ORG_AGENTS: OrgAgent[] = [
  {
    id: "executive-copilot",
    name: "Executive Copilot",
    emoji: "🏆",
    persona: "Founder's Right Hand",
    status: "active",
    lastUsed: "Last used 2h ago",
    currentTask: "Drafting Q2 board update",
    recentActivity: [
      { text: "Summarized weekly eng + sales digest", time: "2h ago" },
      { text: "Answered 'what's our burn rate?'", time: "5h ago" },
      { text: "Pulled pipeline report from HubSpot", time: "1d ago" },
    ],
    tools: ["github", "hubspot", "notion"],
  },
  {
    id: "the-operator",
    name: "The Operator",
    emoji: "🎯",
    persona: "Chief of Staff",
    status: "active",
    lastUsed: "Last used 45m ago",
    currentTask: "Synthesizing sprint status across GitHub and Linear",
    recentActivity: [
      { text: "Flagged 3 Linear tickets with no linked PRs", time: "45m ago" },
      { text: "Answered 'what shipped this week?'", time: "2h ago" },
      { text: "Groomed backlog with Backlog Groomer", time: "1d ago" },
    ],
    tools: ["github", "linear", "notion"],
  },
  {
    id: "sales-sally",
    name: "Sales Sally",
    emoji: "💼",
    persona: "Sales Development Rep",
    status: "idle",
    lastUsed: "Last used 1d ago",
    currentTask: "Idle — last ran outbound sequence for Acme Corp",
    recentActivity: [
      { text: "Drafted follow-up for Acme Corp deal", time: "1d ago" },
      { text: "Updated 4 contacts in HubSpot", time: "2d ago" },
      { text: "Researched 12 new prospects", time: "3d ago" },
    ],
    tools: ["hubspot"],
  },
  {
    id: "devops-derek",
    name: "DevOps Derek",
    emoji: "🚀",
    persona: "Platform Engineer",
    status: "active",
    lastUsed: "Last used 12m ago",
    currentTask: "Monitoring deploy pipeline after main merge",
    recentActivity: [
      { text: "Fixed flaky test in CI", time: "12m ago" },
      { text: "Investigated slow deploy on prod", time: "3h ago" },
      { text: "Reviewed security scan results", time: "1d ago" },
    ],
    tools: ["github"],
  },
  {
    id: "engineering-ed",
    name: "Engineering Ed",
    emoji: "⚙️",
    persona: "Senior Software Engineer",
    status: "active",
    lastUsed: "Last used 3h ago",
    currentTask: "Reviewing PR #47 — async refactor in auth module",
    recentActivity: [
      { text: "Left review on PR #47", time: "3h ago" },
      { text: "Triaged 5 GitHub issues", time: "6h ago" },
      { text: "Wrote tech spec for caching layer", time: "1d ago" },
    ],
    tools: ["github"],
  },
  {
    id: "backlog-groomer",
    name: "Backlog Groomer",
    emoji: "🌿",
    persona: "Agile Delivery Lead",
    status: "idle",
    lastUsed: "Last used 3d ago",
    currentTask: "Idle — last sprint grooming 3d ago",
    recentActivity: [
      { text: "Closed 8 stale issues", time: "3d ago" },
      { text: "Added acceptance criteria to 12 tickets", time: "3d ago" },
      { text: "Labeled 23 issues by priority", time: "4d ago" },
    ],
    tools: ["github"],
  },
  {
    id: "marketing-mindy",
    name: "Marketing Mindy",
    emoji: "📣",
    persona: "Content Marketing Manager",
    status: "error",
    lastUsed: "NOTION_TOKEN expired",
    currentTask: "Blocked — cannot access Notion workspace",
    recentActivity: [
      { text: "Failed to update content calendar", time: "4h ago" },
      { text: "Drafted blog post (saved locally)", time: "1d ago" },
      { text: "Published LinkedIn thread", time: "2d ago" },
    ],
    tools: ["notion"],
    errorMessage: "NOTION_TOKEN expired — update this secret to restore Mindy",
  },
  {
    id: "security-steve",
    name: "Security Steve",
    emoji: "🔒",
    persona: "Application Security Engineer",
    status: "idle",
    lastUsed: "Last used 5d ago",
    currentTask: "Idle — last security audit 5d ago",
    recentActivity: [
      { text: "Audited npm deps for CVEs", time: "5d ago" },
      { text: "Reviewed auth PR for injection risks", time: "6d ago" },
      { text: "Wrote security runbook", time: "1w ago" },
    ],
    tools: ["github"],
  },
  {
    id: "data-dana",
    name: "Data Dana",
    emoji: "📊",
    persona: "Data Analyst",
    status: "active",
    lastUsed: "Last used 1h ago",
    currentTask: "Running monthly revenue cohort analysis",
    recentActivity: [
      { text: "Completed MRR report for April", time: "1h ago" },
      { text: "Answered 'why did churn spike in March?'", time: "3h ago" },
      { text: "Built retention dashboard query", time: "1d ago" },
    ],
    tools: ["postgres"],
  },
];

export const ORG_DEPARTMENTS: OrgDepartment[] = [
  {
    id: "engineering",
    name: "Engineering",
    color: "bg-blue-500",
    agentIds: ["engineering-ed", "backlog-groomer", "security-steve", "devops-derek"],
  },
  {
    id: "revenue",
    name: "Revenue",
    color: "bg-green-500",
    agentIds: ["sales-sally", "marketing-mindy"],
  },
  {
    id: "operations",
    name: "Operations",
    color: "bg-violet-500",
    agentIds: ["executive-copilot", "the-operator"],
  },
  {
    id: "analytics",
    name: "Analytics",
    color: "bg-orange-500",
    agentIds: ["data-dana"],
  },
];

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    agentId: "devops-derek",
    agentEmoji: "🚀",
    agentName: "DevOps Derek",
    action: "Fixed flaky auth test causing CI failures on main",
    time: "12 minutes ago",
    isError: false,
  },
  {
    agentId: "the-operator",
    agentEmoji: "🎯",
    agentName: "The Operator",
    action: "Flagged 3 Linear tickets in-progress with no linked PRs",
    time: "45 minutes ago",
    isError: false,
  },
  {
    agentId: "data-dana",
    agentEmoji: "📊",
    agentName: "Data Dana",
    action: "Completed April MRR report — 23% MoM growth, churn up 2pts",
    time: "1 hour ago",
    isError: false,
  },
  {
    agentId: "executive-copilot",
    agentEmoji: "🏆",
    agentName: "Executive Copilot",
    action: "Drafted Q2 board update — 3 sections, ready for review in Notion",
    time: "2 hours ago",
    isError: false,
  },
  {
    agentId: "engineering-ed",
    agentEmoji: "⚙️",
    agentName: "Engineering Ed",
    action: "Reviewed PR #47: approved with 2 comments on error handling",
    time: "3 hours ago",
    isError: false,
  },
  {
    agentId: "marketing-mindy",
    agentEmoji: "📣",
    agentName: "Marketing Mindy",
    action: "NOTION_TOKEN expired — cannot update content calendar",
    time: "4 hours ago",
    isError: true,
  },
  {
    agentId: "executive-copilot",
    agentEmoji: "🏆",
    agentName: "Executive Copilot",
    action: "Pulled pipeline report: $240k in late-stage, 3 deals moved to proposal",
    time: "5 hours ago",
    isError: false,
  },
  {
    agentId: "sales-sally",
    agentEmoji: "💼",
    agentName: "Sales Sally",
    action: "Drafted personalized follow-up for Acme Corp — references their Q2 hiring push",
    time: "1 day ago",
    isError: false,
  },
  {
    agentId: "devops-derek",
    agentEmoji: "🚀",
    agentName: "DevOps Derek",
    action: "Investigated prod deploy slowdown — traced to npm install cache miss",
    time: "1 day ago",
    isError: false,
  },
  {
    agentId: "backlog-groomer",
    agentEmoji: "🌿",
    agentName: "Backlog Groomer",
    action: "Closed 8 stale issues (90+ days inactive), labeled 23 by priority",
    time: "3 days ago",
    isError: false,
  },
  {
    agentId: "security-steve",
    agentEmoji: "🔒",
    agentName: "Security Steve",
    action: "Audited package.json: 2 high CVEs in lodash and axios — PRs opened",
    time: "5 days ago",
    isError: false,
  },
  {
    agentId: "data-dana",
    agentEmoji: "📊",
    agentName: "Data Dana",
    action: "Answered 'why did churn spike in March?' — traced to pricing page change on Mar 3",
    time: "1 week ago",
    isError: false,
  },
];
