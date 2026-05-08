export interface MissionOutput {
  agentId: string;
  agentName: string;
  agentEmoji: string;
  action: string;
  detail: string;
  time: string;
  link?: string;
}

export interface MissionGoal {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  status: "on-track" | "at-risk" | "blocked" | "done";
  progress: number; // 0-100
  deadline: string;
  agentIds: string[];
  outputs: MissionOutput[];
}

export const MISSION_GOALS: MissionGoal[] = [
  {
    id: "ship-q2",
    emoji: "🚀",
    title: "Ship Q2 Features",
    subtitle: "Auth overhaul, dashboard v2, mobile beta",
    status: "on-track",
    progress: 67,
    deadline: "Jun 30",
    agentIds: ["engineering-ed", "code-reviewer-cody", "documentation-dana", "the-operator"],
    outputs: [
      {
        agentId: "engineering-ed",
        agentName: "Engineering Ed",
        agentEmoji: "⚙️",
        action: "opened PR",
        detail: "feat: OAuth2 PKCE flow for mobile clients",
        time: "12m ago",
        link: "#",
      },
      {
        agentId: "code-reviewer-cody",
        agentName: "Code Reviewer Cody",
        agentEmoji: "🔍",
        action: "reviewed PR #418",
        detail: "Flagged 2 security issues, approved after fixes",
        time: "1h ago",
      },
      {
        agentId: "the-operator",
        agentName: "The Operator",
        agentEmoji: "🎯",
        action: "updated sprint",
        detail: "Closed 6 tickets, flagged 2 without linked PRs",
        time: "2h ago",
      },
      {
        agentId: "documentation-dana",
        agentName: "Documentation Dana",
        agentEmoji: "📚",
        action: "published docs",
        detail: "Auth migration guide for existing integrations",
        time: "3h ago",
        link: "#",
      },
      {
        agentId: "engineering-ed",
        agentName: "Engineering Ed",
        agentEmoji: "⚙️",
        action: "merged PR",
        detail: "feat: dashboard v2 — new metrics panel and filter bar",
        time: "5h ago",
        link: "#",
      },
      {
        agentId: "the-operator",
        agentName: "The Operator",
        agentEmoji: "🎯",
        action: "posted update",
        detail: "Weekly eng digest sent to #general — 5 shipped, 3 in review",
        time: "1d ago",
      },
    ],
  },
  {
    id: "grow-pipeline",
    emoji: "📈",
    title: "Grow Sales Pipeline",
    subtitle: "2× qualified leads, $500K new ARR target",
    status: "at-risk",
    progress: 34,
    deadline: "Jun 30",
    agentIds: ["sales-sally", "marketing-maya", "executive-copilot"],
    outputs: [
      {
        agentId: "marketing-maya",
        agentName: "Marketing Maya",
        agentEmoji: "📣",
        action: "launched campaign",
        detail: "\"Ship Faster with AI\" — 3 LinkedIn posts, 1 case study",
        time: "3h ago",
        link: "#",
      },
      {
        agentId: "sales-sally",
        agentName: "Sales Sally",
        agentEmoji: "💼",
        action: "enriched 40 leads",
        detail: "Mid-market SaaS — added titles, tech stack, recent funding",
        time: "4h ago",
      },
      {
        agentId: "executive-copilot",
        agentName: "Executive Copilot",
        agentEmoji: "🏆",
        action: "flagged risk",
        detail: "Pipeline coverage at 2.1× vs 3× target — needs attention",
        time: "5h ago",
      },
      {
        agentId: "sales-sally",
        agentName: "Sales Sally",
        agentEmoji: "💼",
        action: "drafted sequences",
        detail: "12 personalized outreach emails for Acme, Globex, Initech",
        time: "1d ago",
      },
      {
        agentId: "marketing-maya",
        agentName: "Marketing Maya",
        agentEmoji: "📣",
        action: "published blog post",
        detail: "\"5 ways AI agents cut your ops overhead by 40%\"",
        time: "2d ago",
        link: "#",
      },
    ],
  },
  {
    id: "series-a-dataroom",
    emoji: "📋",
    title: "Series A Data Room",
    subtitle: "Investor materials, legal docs, financial model",
    status: "on-track",
    progress: 81,
    deadline: "May 20",
    agentIds: ["executive-copilot", "the-operator", "data-diana"],
    outputs: [
      {
        agentId: "data-diana",
        agentName: "Data Diana",
        agentEmoji: "📊",
        action: "built model",
        detail: "3-year financial model with 4 growth scenarios",
        time: "1h ago",
        link: "#",
      },
      {
        agentId: "executive-copilot",
        agentName: "Executive Copilot",
        agentEmoji: "🏆",
        action: "updated deck",
        detail: "Incorporated latest ARR, NRR, and cohort charts — slide 8–12",
        time: "3h ago",
      },
      {
        agentId: "the-operator",
        agentName: "The Operator",
        agentEmoji: "🎯",
        action: "tracked checklist",
        detail: "14/17 data room items complete — cap table pending legal",
        time: "4h ago",
      },
      {
        agentId: "data-diana",
        agentName: "Data Diana",
        agentEmoji: "📊",
        action: "ran analysis",
        detail: "LTV/CAC by cohort, payback period, unit economics summary",
        time: "1d ago",
      },
      {
        agentId: "executive-copilot",
        agentName: "Executive Copilot",
        agentEmoji: "🏆",
        action: "drafted narrative",
        detail: "Why now, why us, market sizing — founder review requested",
        time: "2d ago",
      },
    ],
  },
  {
    id: "reduce-support",
    emoji: "🛟",
    title: "Reduce Support Volume",
    subtitle: "Self-serve docs + smarter onboarding flow",
    status: "blocked",
    progress: 18,
    deadline: "Jul 15",
    agentIds: ["documentation-dana", "data-diana", "engineering-ed"],
    outputs: [
      {
        agentId: "data-diana",
        agentName: "Data Diana",
        agentEmoji: "📊",
        action: "identified top issues",
        detail: "Top 3 ticket categories: billing (31%), auth (28%), API (19%)",
        time: "2h ago",
      },
      {
        agentId: "documentation-dana",
        agentName: "Documentation Dana",
        agentEmoji: "📚",
        action: "blocked",
        detail: "Needs Intercom API access to pull ticket history — waiting on IT",
        time: "6h ago",
      },
      {
        agentId: "data-diana",
        agentName: "Data Diana",
        agentEmoji: "📊",
        action: "pulled Mixpanel report",
        detail: "Onboarding drop-off at step 4 (API key setup) — 62% exit rate",
        time: "1d ago",
      },
    ],
  },
];

// Lookup from agent ID to the fixture data used in AgentDrawer
export const MISSION_AGENT_DETAILS: Record<string, {
  name: string;
  emoji: string;
  persona: string;
  tools: string[];
  currentTask: string;
  status: "active" | "idle" | "error";
}> = {
  "engineering-ed": {
    name: "Engineering Ed",
    emoji: "⚙️",
    persona: "Senior Software Engineer",
    tools: ["github", "linear", "notion"],
    currentTask: "Implementing OAuth2 PKCE for mobile",
    status: "active",
  },
  "code-reviewer-cody": {
    name: "Code Reviewer Cody",
    emoji: "🔍",
    persona: "Principal Code Reviewer",
    tools: ["github"],
    currentTask: "Reviewing PR #421 — API rate limiting",
    status: "active",
  },
  "documentation-dana": {
    name: "Documentation Dana",
    emoji: "📚",
    persona: "Technical Writer",
    tools: ["notion", "github"],
    currentTask: "Waiting on Intercom API access",
    status: "idle",
  },
  "the-operator": {
    name: "The Operator",
    emoji: "🎯",
    persona: "Chief of Staff",
    tools: ["github", "linear", "notion"],
    currentTask: "Synthesizing sprint status",
    status: "active",
  },
  "sales-sally": {
    name: "Sales Sally",
    emoji: "💼",
    persona: "SDR / Account Executive",
    tools: ["hubspot", "linkedin"],
    currentTask: "Building Acme outreach sequence",
    status: "active",
  },
  "marketing-maya": {
    name: "Marketing Maya",
    emoji: "📣",
    persona: "Growth Marketer",
    tools: ["notion", "linkedin"],
    currentTask: "Drafting next campaign brief",
    status: "idle",
  },
  "executive-copilot": {
    name: "Executive Copilot",
    emoji: "🏆",
    persona: "Founder's Right Hand",
    tools: ["github", "hubspot", "notion"],
    currentTask: "Updating Series A deck — slide 9",
    status: "active",
  },
  "data-diana": {
    name: "Data Diana",
    emoji: "📊",
    persona: "Data Analyst",
    tools: ["notion", "github"],
    currentTask: "Finalizing unit economics model",
    status: "active",
  },
};
