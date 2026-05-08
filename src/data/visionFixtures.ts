export const VISION_PROMPTS: Record<string, { q: string; a: string }[]> = {
  "engineering-Code Review": [
    {
      q: "Review this PR — we're switching from callbacks to async/await in the auth module",
      a: "I pulled up the PR on GitHub and scanned the diff. The async/await migration looks solid overall, but you've got an unhandled promise rejection in the token refresh path — line 47 needs a try/catch wrapping the `refreshToken()` call. I also noticed the old callback-style error-first signature is still exported for backward compatibility, which is fine, but add a deprecation notice so callers know to migrate. I'll leave inline comments on GitHub now and mark the review as 'Request Changes' until those two items are addressed.",
    },
    {
      q: "We have a PR that's been open for 6 days with no reviews. Can you take a look?",
      a: "Found it — PR #184, 'Add rate limiting middleware'. Six days with zero reviewer engagement is a flag, so I went ahead and did a full review. The implementation is functionally correct but the Redis key schema will cause collisions in multi-tenant environments; I left a specific comment with a suggested fix. I've also assigned two reviewers from the CODEOWNERS file who have context on the middleware layer, and added the 'needs-review' label so it surfaces in the triage board.",
    },
    {
      q: "Can you check if our main branch has any open PRs with merge conflicts?",
      a: "Queried GitHub for all open PRs targeting main — you've got 3 with reported conflicts: #201 (feature/user-export), #197 (fix/invoice-rounding), and #188 (refactor/db-client). PR #188 has the messiest conflict, touching the same database connection factory that two other branches also modified this week. I'd recommend resolving #188 first since it's a refactor that the others will likely need to rebase onto anyway. Want me to leave comments on each PR with rebase instructions?",
    },
    {
      q: "What's our average PR review turnaround time looking like this sprint?",
      a: "Pulled the GitHub PR data for the current sprint. Median time-to-first-review is sitting at 18 hours, which is up from 11 hours last sprint. The outliers are almost all on the platform team — they have 4 PRs that waited 48+ hours. Looking at reviewer load, two engineers on that team are assigned to 9 open PRs each, which is why things are backing up. I'd suggest a brief redistribution conversation in your next standup and consider enabling the GitHub CODEOWNERS round-robin assignment to spread load automatically.",
    },
  ],
  "engineering-Architecture": [
    {
      q: "Should we go with a monorepo or keep our services in separate repos?",
      a: "Given your current setup — three services, a shared component library, and a small team — a monorepo will likely save more pain than it causes right now. The main wins are atomic cross-service commits, a single CI pipeline, and easier dependency upgrades. The cost is upfront tooling investment (Turborepo or Nx will help) and a slightly more complex GitHub branch protection setup. I'd migrate to monorepo now while the codebase is small enough to do it in a day, rather than attempting it with 10 services. I can draft a migration plan if useful.",
    },
    {
      q: "We're debating between REST and GraphQL for our new public API. Thoughts?",
      a: "The choice depends on your consumer profile more than anything else. If your primary consumers are third-party developers with unpredictable query patterns, GraphQL's flexibility pays off. If you're building for a specific mobile app or dashboard you control, REST with well-designed endpoints is simpler to cache, version, and reason about. Given that you've mentioned rate limiting concerns and external partners, I'd lean REST with an OpenAPI spec — it's easier to gate, document, and version. You can always layer a GraphQL gateway later without rewriting the underlying service.",
    },
    {
      q: "How should we handle database migrations in a zero-downtime deployment?",
      a: "The core pattern is expand-contract: first deploy a migration that's backward-compatible with the old code (add columns, don't remove), then deploy the new code, then clean up the old schema in a final migration. This means avoiding destructive changes (DROP COLUMN, NOT NULL additions without defaults) in a single deploy. For your GitHub Actions workflow, I'd add a migration check step that validates the migration against a schema snapshot and blocks merge if it's a breaking change. Tools like `squawk` or `pgroll` can automate most of this validation.",
    },
    {
      q: "We're seeing N+1 query problems in our API. What's the architectural fix?",
      a: "N+1 is almost always a symptom of the wrong data-fetching layer, not just a query problem. The immediate fix is dataloader-style batching — group child lookups and issue one query per batch instead of one per parent. Architecturally, consider whether your API layer should be constructing domain objects at all or delegating that to the data layer. If you're using an ORM, check whether eager loading via `include`/`joins` makes sense for the most common access patterns. I'd also recommend adding a query count assertion to your critical path integration tests so N+1 regressions get caught in CI before they reach production.",
    },
  ],
  "engineering-Incident Response": [
    {
      q: "Production is down — our checkout endpoint is returning 503s. Where do I start?",
      a: "First, check your most recent GitHub deployments — was anything merged to main in the last 90 minutes? A bad deploy is the most common cause and the fastest to roll back. While you're doing that, pull the error logs for the checkout service and look for a spike in a specific exception type rather than a general load issue. If it's a dependency (database, payment gateway), the error messages will tell you. I'll pull up the last 5 merged PRs on GitHub so you can cross-reference timing.",
    },
    {
      q: "We had a memory leak take down a pod last night. How do we do a proper post-mortem?",
      a: "A good post-mortem is blameless and specific — it documents what happened, when each event occurred, why the system behaved that way, and what prevents recurrence. Start the doc with a timeline pulled from your monitoring alerts and deployment logs. For the memory leak itself: what changed in the last deploy? I can pull the merged PR diff from GitHub to help identify the suspect code. The action items should be concrete: a fix for the leak, a memory alert threshold, and a load test that would have caught this in staging. Assign an owner and a due date to each.",
    },
    {
      q: "An engineer accidentally pushed secrets to a public GitHub repo. What's the incident playbook?",
      a: "Move fast — GitHub's secret scanning may have already flagged it, but exposure begins at the moment of push. Step one: rotate the compromised credentials immediately, before anything else. Step two: use GitHub's repository history tools to remove the commit (BFG Repo Cleaner or git-filter-repo) and force-push — but rotating first is non-negotiable because the secret is already indexed. Step three: audit access logs for the rotated credential to understand blast radius. Step four: add pre-commit hooks and CI scanning (GitHub's push protection or truffleHog) to prevent recurrence. Document the full timeline for your security team.",
    },
    {
      q: "Our API latency spiked to 4 seconds p99 at 2pm today. It recovered on its own. Help me understand what happened.",
      a: "A self-resolving latency spike that's time-bounded usually points to one of three things: a scheduled job that competed for database connections, a traffic burst that triggered backpressure, or a GC pause in a JVM or Node service. Check your GitHub Actions scheduled workflows — anything cron-triggered around 2pm? Also look for any database migration that ran during that window. The fact that it recovered without intervention is useful data: it means capacity was sufficient to absorb the spike, but you should add a p99 latency alert so the next spike gets human eyes before customers notice it.",
    },
  ],
  "sales-Outbound": [
    {
      q: "Write me a cold outreach email to the VP of Engineering at a 200-person SaaS company",
      a: "Here's a draft targeting someone who cares about engineering velocity and team overhead: Subject: 'Cutting your team's context-switching by half' — Hi [Name], noticed [Company] recently scaled from Series A to B (congrats on the round). At that inflection point, most VP Engs I talk to say their biggest drag isn't headcount, it's context-switching across tools. We help teams like yours reduce that overhead by 40% in the first 60 days. Worth a 20-minute call to see if there's a fit? I'll log this outreach and the contact in HubSpot once you approve it.",
    },
    {
      q: "I have 50 leads from a conference. How should I prioritize who to reach out to first?",
      a: "Run them through a quick ICP scoring pass before you touch a keyboard. Prioritize by: company size vs. your sweet spot, their role seniority, whether they have an active use case for your product (infer from their job title and company stage), and any signal from the conference interaction itself (did they stop by the booth with a specific question?). I'll check HubSpot to see if any of these contacts already exist in your CRM — duplicates and existing accounts should go to the account owner, not cold outreach. Send me the list and I'll sort it.",
    },
    {
      q: "What's the best cadence for a cold outreach sequence?",
      a: "A five-touch cadence over three weeks performs best for B2B SaaS: Day 1 personalized email, Day 3 LinkedIn connection request, Day 7 follow-up email referencing a specific pain point relevant to their role, Day 14 a value-add touch (share a relevant case study or post — not another ask), Day 21 a breakup email that gives them an easy out. Total touches: 5, zero phone calls unless they've shown intent. I'll set up the sequence in HubSpot with the appropriate enrollment triggers and automatic logging so nothing falls through.",
    },
    {
      q: "A prospect opened my email 7 times but hasn't replied. How do I follow up?",
      a: "Seven opens is a strong intent signal — they're interested but something is blocking the reply. Common reasons: they need internal approval to respond, they're waiting for budget clarity, or they're comparing you against a competitor. Your follow-up should lower the bar: instead of 'let's chat,' try 'I noticed you had a chance to look this over — is there a specific question I can answer quickly via email?' That framing respects their time, surfaces the objection, and feels less pushy than another meeting request. I'll log this engagement pattern in HubSpot and flag them as a warm lead.",
    },
  ],
  "sales-Pipeline": [
    {
      q: "Which deals in my pipeline are most at risk of slipping this quarter?",
      a: "Pulled your open pipeline from HubSpot. Three deals show classic slip signals: 'Acme Corp' (closed $120k, last activity 18 days ago — no champion engagement since the procurement ask), 'Finley Inc' (demo done but no follow-up meeting scheduled, Q4 budget cycle ends in 11 days), and 'NovaTech' (deal has been in 'Negotiation' for 34 days with no contract sent). I'd prioritize Acme and Finley this week — both have recoverable situations if you re-engage today. Want me to draft re-engagement emails for each?",
    },
    {
      q: "What's my pipeline coverage ratio for Q3?",
      a: "Based on HubSpot data: your Q3 quota is $480k and current pipeline (weighted by stage probability) sits at $612k, giving you 1.28x coverage. That's below the 3x coverage most sales orgs target for this point in the quarter — you have 6 weeks left. The weighted number is propped up by two large deals in early stages (30% probability each) that may not close in time. Stripping those out, your near-term coverage drops to 0.9x. You likely need 3-5 new qualified opportunities to hit number. Want me to pull a list of dormant leads we could re-engage?",
    },
    {
      q: "Update all deals in 'Demo Scheduled' stage where the demo was more than 10 days ago",
      a: "Found 6 deals in HubSpot where the demo date field shows more than 10 days ago and the stage is still 'Demo Scheduled' — they're stale. I'll move them to 'Follow-up Required', set a task for each deal owner due today, and add a note explaining the audit. Before I write, let me confirm: should the deal owner be auto-notified via HubSpot task, or do you prefer I draft a Slack summary for you to share manually? Also flagging that two of the six deals have no activity at all in 21 days — those may need to be marked 'Closed Lost' instead.",
    },
    {
      q: "Which of our lost deals in the last 6 months had the most common loss reason?",
      a: "Queried HubSpot closed-lost deals from the last 180 days. Out of 34 losses with a reason recorded, 14 (41%) are tagged 'Chose Competitor', 9 (26%) are 'No Budget / Timing', 7 (21%) are 'No Decision Made', and 4 (12%) are 'Missing Feature'. The competitor losses spike in deals over $50k ACV, which suggests pricing or procurement friction at the enterprise tier. The 'No Decision Made' cluster is worth a closer look — those are deals where we had a champion but couldn't get executive buy-in. That's often a sales process gap, not a product gap.",
    },
  ],
  "productivity-Summaries": [
    {
      q: "Summarize the last week of activity in our #engineering-decisions Slack channel",
      a: "Here's the digest for #engineering-decisions (last 7 days): Three explicit decisions were made — (1) adopt Zod for all API input validation going forward, owner: @mark, (2) deprecate the legacy REST endpoint by end of quarter, owner: @priya, (3) move to pnpm as the package manager, no rollback planned. Two open questions remain unresolved in thread: the database sharding strategy discussion from Tuesday and whether to adopt edge functions for the auth layer. Four action items were mentioned but have no assigned owner — I flagged those separately. Want me to write this to the Notion decision log?",
    },
    {
      q: "Give me a one-pager summary of the 40-page product spec I just shared",
      a: "Summary of the Product Spec (v2.3): The spec covers the redesign of the onboarding flow for new workspace admins. Core problem: 68% of admins abandon setup before inviting their first team member. Proposed solution: a guided 5-step wizard with contextual help, replacing the current blank-state dashboard. Key decisions required: (1) whether to gate the wizard behind a feature flag or make it default, (2) the data model change for onboarding_state, which has implications for existing users. Open question from the spec author: should we support SSO configuration during onboarding or defer to post-activation? Timeline proposed is 6 weeks for MVP.",
    },
    {
      q: "I have 3 hours of meeting notes from this week. Can you pull out all the action items?",
      a: "Extracted all action items from your meeting notes this week. 14 total, organized by owner: You have 3 (send contract redline to Acme by Friday, review Q3 forecast model, schedule architecture review with platform team). @james has 2 (write acceptance criteria for the export feature, follow up with Design on the new dashboard mocks). @sara has 4 (update the HubSpot sequence for enterprise prospects, draft the launch email, coordinate beta user feedback session, close out the security review ticket). Remaining 5 have no owner assigned — want me to propose owners based on context from the notes?",
    },
    {
      q: "Summarize all updates across GitHub, Linear, and Notion from the past 24 hours",
      a: "24-hour digest: GitHub — 7 PRs merged (notable: the authentication refactor and the new billing webhook handler), 3 new issues opened (2 bugs, 1 feature request from a customer). Linear — 5 tickets moved to Done, 2 moved to Blocked (both waiting on a design decision from the product meeting scheduled tomorrow). Notion — 2 pages updated (the API documentation and the Q3 roadmap; the roadmap now shows the mobile feature pushed to Q4). No conflicting information spotted across the three sources, but the blocked Linear tickets may be related to the design work mentioned in Notion — worth confirming in tomorrow's standup.",
    },
  ],
  "productivity-Documentation": [
    {
      q: "Write a runbook for our database backup and restore process",
      a: "Here's a draft runbook structure I'll write out fully in Notion: Overview (what this covers and when to use it), Prerequisites (access requirements, tools needed), Backup Procedure (step-by-step with exact commands, expected output at each step, and how to verify success), Restore Procedure (same format, with a pre-restore checklist to avoid overwriting good data accidentally), Verification Steps (how to confirm the restore is complete and data is consistent), Escalation Path (who to contact if the procedure fails and what information to bring). I'll store it in the 'Engineering Runbooks' Notion database with tags: database, backup, operations. Should this be linked from the incident response page?",
    },
    {
      q: "Our API docs are 18 months out of date. How do I approach a documentation sprint?",
      a: "A documentation sprint works best when scoped tightly. Start by auditing what exists: which endpoints are documented, which are missing, and which have documentation that contradicts the current behavior. I'd pull the OpenAPI spec from your codebase and diff it against the Notion API docs to generate an exact gap list — that's your sprint backlog. Prioritize the endpoints that customer support and partners reference most, not alphabetical order. Set a rule: no new endpoint ships without a documentation PR in the same pull request. That stops the drift from recurring. I can create the Notion sprint page and populate the gap list if you share the spec.",
    },
    {
      q: "Write an architecture decision record (ADR) for switching from REST to gRPC for internal services",
      a: "ADR-0042: Switch Internal Service Communication from REST to gRPC. Status: Proposed. Context: Our internal service calls are growing in frequency and the REST overhead (HTTP/1.1, JSON serialization) is adding ~12ms per hop at p99; we have 4 service-to-service call chains that amplify this. Decision: Adopt gRPC with Protocol Buffers for all new internal service APIs; migrate existing high-frequency endpoints over 2 sprints. Consequences — Positive: 60-70% reduction in serialization overhead, strong contracts via .proto files, streaming support. Negative: steeper learning curve, binary protocol harder to debug without tooling, all consumers must regenerate clients on schema change. Alternatives considered: REST with HTTP/2 (rejected — still JSON overhead), GraphQL federation (rejected — overhead not justified for internal calls). I'll save this to the Notion ADR database.",
    },
    {
      q: "Write a contributor guide for our open-source repo",
      a: "Draft contributor guide for CONTRIBUTING.md: Sections will include — Getting Started (fork/clone instructions, dev environment setup, required env vars), Development Workflow (branch naming convention, commit message format following Conventional Commits, how to run tests locally), Submitting Changes (PR checklist: tests pass, docs updated if applicable, no secrets committed, description explains the 'why' not just the 'what'), Code Review Process (what reviewers look for, expected turnaround time, how to respond to feedback), Reporting Issues (bug report template with reproduction steps, environment info, expected vs. actual behavior), and Community (code of conduct link, where to ask questions). I'll format this for GitHub Markdown with anchor links in the TOC.",
    },
  ],
  "data-Ad-hoc Queries": [
    {
      q: "How many users signed up last month and what was the conversion rate from trial to paid?",
      a: "I'll write two queries: one for new signups in the prior calendar month (grouping by day to show the trend), and a conversion query that joins trial_starts to subscriptions on user_id within a 14-day window. Before I run them, I want to confirm the timezone for 'last month' — should I use UTC or your billing system's timezone? Also, is 'paid' defined as any active subscription or specifically first-time-paid (excluding upgrades from one plan to another)? Getting that definition right matters more than the query itself. I'll present the results with the raw count, the percentage, and a week-over-week comparison for context.",
    },
    {
      q: "Find all customers who haven't logged in for 90 days but are still on a paid plan",
      a: "Here's the query approach: join your users table to sessions (latest session per user) and subscriptions (status = 'active'), filter where last_session_at < NOW() - INTERVAL '90 days'. I'll also pull their plan tier and MRR contribution so you can prioritize outreach by revenue at risk. One flag: if your session table is large, this query will be slow without an index on last_session_at — I'll write it with a CTE that limits the session scan. Results will include user_id, email, plan, MRR, last_login, and account age so your CS team has full context for the re-engagement campaign.",
    },
    {
      q: "Which of our features has the lowest adoption rate among enterprise customers?",
      a: "To answer this I need two things from the schema: a feature_usage or events table with user_id and feature_name, and a way to identify enterprise accounts (either a plan field or a separate accounts table with tier). I'll compute adoption as (distinct enterprise users who triggered the event at least once in the last 30 days) / (total enterprise users who were active in the same period). This controls for churned or dormant accounts skewing the denominator. I'll return the bottom 10 features ranked by adoption %, along with whether the low adoption is uniform across all enterprise accounts or concentrated in a subset — that distinction changes the action you'd take.",
    },
    {
      q: "Our revenue dashboard shows a 15% MRR drop last Tuesday. Help me investigate",
      a: "A sudden MRR drop on a specific date is almost always one of three things: a batch of churns/downgrades processed that day, a billing system correction, or a data pipeline issue. I'll start by querying subscription_changes for Tuesday where change_type IN ('cancelled', 'downgraded') and summing the MRR delta. If that accounts for the full 15%, we have the answer. If the sum is small, I'll check for data quality issues — rows inserted or updated with a Tuesday timestamp that don't represent real events. I'll also check if the drop persists on Wednesday (real churn) or reverts (data glitch). Send me the table names and I'll build the investigation query.",
    },
  ],
  "devops-Deployments": [
    {
      q: "Our GitHub Actions deploy workflow has been failing intermittently on the Docker build step",
      a: "Intermittent Docker build failures in CI usually come from one of three sources: flaky network calls pulling base images or dependencies, a race condition in a multi-stage build, or a resource limit being hit (memory/disk on the runner). I'll pull your recent failed workflow runs from GitHub Actions to check the error message pattern — if it's always the same layer failing, that's a specific dependency. If it's different layers each time, it's a resource issue. Quickest fix to test: add `--network=host` to the Docker build step and pin your base image to a digest instead of a tag. I'll check the workflow YAML now.",
    },
    {
      q: "Walk me through setting up a blue-green deployment for our Node.js API",
      a: "Blue-green for a Node API means maintaining two identical production environments (blue = live, green = idle) and switching traffic between them atomically. The GitHub Actions workflow shape: build and push Docker image → deploy to green environment → run smoke tests against green → if tests pass, swap the load balancer target group → keep blue running for 15 minutes as a rollback target → terminate blue. The key config is your load balancer: on AWS this is updating the target group in the ALB listener; on GCP it's traffic splitting in Cloud Run. The smoke test step is the most important part — without it, blue-green just means faster broken deploys. Want me to write the full workflow YAML?",
    },
    {
      q: "How do I roll back a bad deployment without downtime?",
      a: "If you're on GitHub Actions with Docker, the fastest zero-downtime rollback is redeploying the previous image tag — you want your workflow to tag images with both 'latest' and the git SHA so you always have a specific version to roll back to. The rollback command is just a re-run of the deploy job with the previous SHA passed as input. The 'without downtime' requirement means your load balancer needs to support connection draining: old containers finish in-flight requests while new containers start accepting traffic. If your current setup doesn't tag images with git SHAs, that's the first thing to fix — 'latest' rollbacks are dangerous because you can't verify what you're deploying to.",
    },
    {
      q: "We're deploying 3x a day and our staging environment is constantly in a broken state",
      a: "A staging environment that's always broken is a sign that staging is being used as a testing environment rather than a pre-production environment. The fix is environment promotion: code goes local → dev (or PR preview) → staging → prod, with staging only receiving code that has already passed automated tests in the earlier environments. In GitHub Actions terms, this means your staging deploy should only trigger after the test suite passes on a release branch, not on every push to main. You should also add a staging health check gate in your workflow — if staging is currently unhealthy, block the next deploy until it's resolved rather than piling more broken code on top.",
    },
  ],
  // Fallback keys by category
  engineering: [
    {
      q: "What's the best way to handle feature flags in a Node.js monorepo?",
      a: "Use a centralized flag service (LaunchDarkly, Unleash, or a simple Postgres-backed implementation) rather than environment variables, so you can toggle flags at runtime without a deploy. In a monorepo, the flag client should live in a shared package that all services import, with a consistent interface regardless of which backend you use. The critical rule: every flag needs a removal ticket created at the same time it's added — flags that live past their intended release become technical debt. I can help you set up the shared package structure and write a lint rule that enforces flag documentation.",
    },
    {
      q: "How should we structure our CI pipeline to keep builds under 5 minutes?",
      a: "Five minutes is achievable if you parallelize aggressively. Typical breakdown: lint (30s), type check (45s), unit tests (2min), integration tests (2min) — if those run sequentially you're already over. Split your GitHub Actions workflow into parallel jobs: lint and type-check run together, unit tests run in parallel across multiple runners using a matrix strategy, integration tests run only on PRs targeting main (not every push). Also: cache your node_modules and Docker layers between runs. The biggest single win is usually moving integration tests to a separate workflow triggered only on merge to main rather than every commit.",
    },
    {
      q: "We need to add observability to our services. Where do I start?",
      a: "Start with the three pillars in order of ROI: logs first (structured JSON logging with request IDs for correlation), then metrics (request rate, error rate, and latency p50/p95/p99 — the RED method), then traces (distributed tracing is highest value but highest setup cost). For a Node.js service, OpenTelemetry gives you a vendor-agnostic instrumentation layer. The most important thing to do before writing any code is define your SLOs — what latency and error rate are acceptable? Without that, you're collecting data without knowing what 'bad' looks like. Instrument the critical path first, not everything at once.",
    },
    {
      q: "Should we adopt TypeScript for our existing JavaScript codebase?",
      a: "Yes, but incrementally — don't try to convert everything at once. The migration path: enable TypeScript in your repo with 'allowJs: true' and 'strict: false', convert new files to .ts from day one, and gradually migrate existing files starting with shared utilities (they'll give you the most type-safety leverage across the codebase). Strict mode should be the eventual goal, but not the starting point — it'll cause so many errors upfront that the team will lose momentum. The real benefit of TypeScript isn't catching bugs (though it does that) — it's making refactoring safe enough that people actually do it.",
    },
  ],
  sales: [
    {
      q: "How do I build a repeatable sales process for a B2B SaaS product?",
      a: "A repeatable sales process has defined entry criteria for each stage, not just names. Instead of 'Prospecting → Demo → Negotiation → Close', define what must be true to advance: a prospect moves from Demo to Negotiation only when you have an identified budget, a champion, and a known decision timeline. I'll build this stage-by-stage in HubSpot with required fields at each deal stage gate so your data is clean and your pipeline is honest. The process is only repeatable once your team can explain it in 30 seconds and the CRM enforces it automatically.",
    },
    {
      q: "What metrics should I track to understand sales team performance?",
      a: "Track leading indicators, not just quota attainment. The metrics that predict future revenue: number of new first meetings per rep per week (prospecting activity), demo-to-opportunity conversion rate (qualification quality), average sales cycle by deal size (process efficiency), and pipeline coverage ratio per rep (future quarter health). Quota attainment is a lagging indicator — by the time it's bad, the quarter is already lost. I'll build a HubSpot dashboard that shows each rep's leading indicators week-over-week so you can coach proactively.",
    },
    {
      q: "We're losing deals to a specific competitor. How do I build a battle card?",
      a: "A good battle card has four sections: where we win (our strengths that matter to buyers), where they win (be honest — sales reps need to know what objections are coming), how to reframe the comparison (the questions to ask that shift the criteria in our favor), and proof points (specific customer quotes or metrics that counter their common claims). I'll create a battle card template in HubSpot's sales content library so it's accessible during active deals. The most important part is keeping it current — a stale battle card is worse than none because it gives reps false confidence.",
    },
    {
      q: "A deal we were confident about just went dark. What's the play?",
      a: "Deals go dark for four reasons: they chose someone else and are avoiding the conversation, internal budget or priority shifted, your champion lost influence or left, or they're genuinely busy and dropped the ball. Your first message should be low-pressure and easy to respond to — something like 'I want to make sure I'm not missing something on our end' gives them an easy opening to share bad news. If they've truly gone dark, a breakup email ('closing your file') has a surprisingly high response rate because it creates a moment of decision. I'll log all outreach attempts in HubSpot and set a 5-day follow-up task.",
    },
  ],
  marketing: [
    {
      q: "Write a blog post about how AI agents are changing software development",
      a: "Here's an outline I'll write from: Hook — a specific, concrete scenario (a developer waking up to find their AI agent has already triaged overnight GitHub issues). Body sections: (1) What's actually different about agents vs. copilots — it's the tool use, not the generation, (2) The three workflows changing fastest — code review, incident response, and backlog management, (3) What teams are getting wrong — treating agents as faster search instead of autonomous actors. CTA: a specific action, not just 'learn more.' I'll write to ~1,200 words, avoid buzzword density, and store the draft in your Notion content calendar under 'Engineering / AI' with status 'Draft'.",
    },
    {
      q: "We're launching a new feature next week. Write the announcement email",
      a: "Before I write the email, I need three things: what the feature does in one sentence (from the user's perspective, not the engineer's), who it's for (all users or a segment), and what you want them to do (click a CTA, watch a demo, start using it). Once I have those, I'll write a subject line that leads with the benefit not the feature name, an opening that makes the reader feel understood, a 3-line explanation of what it does and why it matters, and a single CTA. I'll avoid the word 'excited' and 'thrilled.' I'll store the approved version in Notion and can schedule it via your email platform if you have the integration set up.",
    },
    {
      q: "How should we approach SEO for a new product page?",
      a: "Start with keyword intent, not keyword volume. A product page should target bottom-of-funnel terms where the searcher is comparing solutions or ready to buy — not top-of-funnel informational queries (those belong on blog posts). Research the terms your competitors rank for on their product pages, identify gaps, and pick 1-2 primary terms with clear commercial intent. On-page: the primary term goes in the H1, first 100 words, and meta title. Page speed and Core Web Vitals matter more than keyword density in 2025. I'll draft the page copy with the target keyword woven in naturally and store it in your Notion content library for review before publishing.",
    },
    {
      q: "We need a content calendar for Q3. Help me plan it",
      a: "A Q3 content calendar should map to your business priorities: if you have a product launch, product-adjacent content dominates August. If you're focused on pipeline, content should target the personas of your open deals. I'll structure it as a Notion database with fields: title, format (blog/social/email), target persona, funnel stage, primary keyword or theme, owner, due date, and status. For a typical 12-week quarter, plan for 6-8 blog posts, 2 case studies or customer stories, and 1 larger asset (guide, report, or tool). I'll leave 20% of slots unplanned for reactive content around news or launches. Want me to seed the database with a starter set of titles based on your product category?",
    },
  ],
  productivity: [
    {
      q: "Help me organize my Notion workspace — it's a mess",
      a: "The most common Notion mess is too many top-level pages and no consistent naming convention. I'll start by auditing your current structure: list all root-level pages, identify which are active vs. abandoned, and map what should live where. A clean structure for a small team usually has 4-6 top-level areas: Company (mission, strategy, OKRs), Product (roadmap, specs, decisions), Engineering (runbooks, architecture docs, ADRs), People (team directory, onboarding, job descriptions), and an Inbox for things that haven't been filed yet. I'll propose the new structure before moving anything — the last thing you want is a reorganization that loses content.",
    },
    {
      q: "I need a weekly planning template I'll actually use",
      a: "A planning template you'll use has 10 minutes of input overhead, not 45. The format that sticks: Top 3 outcomes for this week (not tasks — outcomes), one 'if nothing else' priority, key meetings and what you need to prepare for each, and one thing to push or delegate. That's it. I'll create this as a Notion template in your workspace with a 'New Week' button that pre-populates the dates and carries over any undone outcomes from last week. The weekly review is equally important: 3 bullets on what happened, 1 on what to change. I'll set up a recurring reminder in your workspace.",
    },
    {
      q: "Draft an async update for my team about a project delay",
      a: "An async update about a delay needs to lead with the impact, not the apology. Format: (1) What changed and by how much — be specific about dates, (2) Why — one honest sentence, not a paragraph of excuses, (3) What it affects — which dependencies, launches, or team plans are impacted, (4) What you're doing about it — the concrete next steps with owners, (5) What you need from the reader, if anything. This structure respects your team's time and gives them everything they need to update their own plans. Want me to draft a specific version? Tell me the project, the original date, the new date, and the one-sentence reason.",
    },
    {
      q: "Help me run a more effective standup",
      a: "Most standups are slow because they're status reports to the manager, not coordination among the team. Effective standup format: each person answers two questions — what are you working on today that others might be blocked by or want to know about, and do you have a blocker that needs another person's help? Hard time limit of 90 seconds per person. Anything that needs discussion gets taken async or to a breakout after standup ends — not in front of the whole team. If your standup is consistently over 15 minutes, the fix is not running it faster, it's reducing the team size in the standup. I can draft a Notion page with these norms for your team.",
    },
  ],
  data: [
    {
      q: "How do I set up a data warehouse for a 50-person startup?",
      a: "At 50 people, you want something you can operate without a dedicated data engineer. The modern minimal stack: a cloud data warehouse (Snowflake, BigQuery, or Redshift — BigQuery is cheapest to start), an ELT tool (Fivetran or Airbyte) to move data from your sources without writing connectors, and dbt for transformations. The common mistake is over-engineering the ingestion layer — start with 3-4 critical sources (your production database, CRM, and billing system) rather than connecting everything at once. I can help you model your first 5 core tables: users, accounts, events, revenue, and a metrics mart. That covers 80% of what most teams actually query.",
    },
    {
      q: "Our data pipeline keeps breaking on weekends. Help me make it more reliable",
      a: "Weekend-specific failures usually mean a dependency on business-hours infrastructure (a VPN that expires, a database that's in maintenance mode, or an API with different rate limits on weekends). First, check whether the failure pattern is consistent — same time each weekend, or random? Consistent timing points to a scheduled task or maintenance window. I'll look at the error logs to find the first failing step. For reliability in general: add idempotency to every step so you can safely re-run from any point, add alerting on first failure rather than after 3 retries, and separate your critical-path pipelines (the ones that feed dashboards leadership looks at Monday morning) from nice-to-have pipelines.",
    },
    {
      q: "What's the best way to track north-star metrics for a SaaS product?",
      a: "Your north-star metric should be the one number that best predicts long-term revenue and reflects real customer value — not a vanity metric. For most SaaS products, it's either active users performing a core action (weekly active paying users who have completed at least one key workflow) or a volume metric (total units of value delivered, like 'documents processed' or 'queries answered'). The test: if this metric goes up, are customers genuinely getting more value? MRR is a financial outcome, not a north-star. I'd build a simple Postgres query that produces this metric daily and save it as a view — then it's one query away from any dashboard tool.",
    },
    {
      q: "How do I do a proper cohort analysis of our user retention?",
      a: "Cohort retention shows what percentage of users who signed up in a given period are still active N weeks later. The query structure: group users by their signup_week (the cohort), then for each subsequent week, count how many of those users performed an activity event. Result is a matrix: rows are cohorts, columns are weeks since signup, cells are retention %. The key insight from a cohort chart is whether retention curves flatten — a curve that flattens at 40% means 40% of your users find long-term value; a curve that approaches zero means no one retains. I'll write the SQL, but first confirm: what counts as 'active' for your product? That definition is more important than the query.",
    },
  ],
  devops: [
    {
      q: "How do I set up infrastructure as code for a new project?",
      a: "Start with Terraform for infrastructure and a separate tool for application configuration (Helm if you're on Kubernetes, or SSM Parameter Store for simpler setups). The critical rule for IaC: every resource in your cloud account must be represented in code — if you create something manually, you create drift. For a new project, the structure I'd recommend: one Terraform module per environment (dev, staging, prod), a shared modules directory for reusable components (VPC, ECS service, RDS cluster), and remote state in S3 with DynamoDB locking. Store your Terraform in the same GitHub repo as your application code so infrastructure changes go through the same PR review process.",
    },
    {
      q: "Walk me through a security hardening checklist for a new AWS account",
      a: "AWS account security hardening, in priority order: (1) Enable MFA on root account and lock it away — no exceptions, (2) Create IAM roles for human access, delete any long-lived IAM user access keys, (3) Enable CloudTrail with log file integrity validation in every region you use, (4) Enable AWS Config and turn on the 'required-tags' and 'root-mfa-enabled' managed rules, (5) Enable GuardDuty for threat detection, (6) Set up a billing alert at 110% of your expected monthly spend, (7) Enable S3 Block Public Access at the account level, (8) Use AWS Organizations with SCPs even for a single account — it lets you add guardrails you'll want later. The GitHub repo for this hardening should use Terraform so it's auditable.",
    },
    {
      q: "Our Kubernetes pods keep getting OOM-killed. How do I fix this?",
      a: "OOM kills mean either your memory requests are set too low (so the scheduler places too many pods on a node) or your application has a memory leak. First, check whether it's a specific pod type or widespread — if it's one deployment, it's likely a leak in that service. If it's spreading, you may be overcommitting the cluster. The fix for misconfigured requests: run `kubectl top pods` during load to see actual usage, then set requests to ~70% of typical usage and limits to ~150% of requests. For a leak: add memory profiling to the suspect service and look for objects accumulating across requests. Don't just raise the limit — that defers the problem rather than solving it.",
    },
    {
      q: "Help me set up monitoring and alerting for a new microservice",
      a: "For a new microservice, instrument in this order: (1) Request rate, error rate, and latency (RED metrics) — these are the minimum for any service, (2) Business-level metrics specific to what the service does (orders processed, emails sent, etc.), (3) Resource metrics (CPU, memory, connection pool saturation). For alerting, only alert on symptoms that require human action — don't alert on CPU usage (alert on latency instead, which is the symptom that matters). Alerts should fire on SLO burn rate, not static thresholds. I'll set up the GitHub Actions step to validate that any new service has a metrics endpoint before it can deploy to production.",
    },
  ],
};

export const FOCUS_AREAS: Record<string, string[]> = {
  engineering: ["Code Review", "Architecture", "Incident Response", "Onboarding"],
  sales: ["Outbound", "Pipeline", "Follow-ups", "Proposals"],
  marketing: ["Blog Content", "Social", "Launch Copy", "SEO"],
  productivity: ["Summaries", "Documentation", "Planning", "Async Comms"],
  data: ["Ad-hoc Queries", "Reporting", "Anomaly Detection", "Dashboards"],
  devops: ["Deployments", "Monitoring", "Security", "Cost Optimization"],
};

export const TOOL_DESCRIPTIONS: Record<string, string> = {
  github: "Read PRs, open issues, review code, check CI status",
  notion: "Read and write pages, update databases, manage workspace",
  hubspot: "Query contacts, update deals, log activities",
  linear: "Manage tickets, update sprint, track velocity",
  slack: "Read channels, post messages, surface decisions",
  postgres: "Run SQL queries, analyze data, inspect schema",
};
