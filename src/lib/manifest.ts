import { AgentTemplate, McpServer } from "@/data/agents";

/**
 * Resolve a template value:
 * - If the key is in envValues, use the actual value (for "Apply" flow)
 * - Otherwise substitute ${KEY} so `aod apply` can expand from shell env
 */
function resolve(val: string, envValues: Record<string, string>): string {
  return val.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    envValues[key] !== undefined ? envValues[key] : `\${${key}}`
  );
}

function resolveMcpServer(server: McpServer, envValues: Record<string, string>): McpServer {
  const s = { ...server };
  if (s.url) s.url = resolve(s.url, envValues);
  if (s.headers)
    s.headers = Object.fromEntries(
      Object.entries(s.headers).map(([k, v]) => [k, resolve(v, envValues)])
    );
  if (s.env)
    s.env = Object.fromEntries(
      Object.entries(s.env).map(([k, v]) => [k, resolve(v, envValues)])
    );
  if (s.args) s.args = s.args.map((a) => resolve(a, envValues));
  return s;
}

interface ManifestOpts {
  /**
   * When true (default for manifest-only download), prepend an Environment
   * document with env_vars showing ${VAR} substitution placeholders.
   * When false (Apply preview), omit the Environment doc to avoid echoing
   * secret values back to the UI.
   */
  includeEnvironment?: boolean;
}

export function generateReadableManifest(
  template: AgentTemplate,
  envValues: Record<string, string>,
  opts: ManifestOpts = {}
): string {
  const includeEnvironment = opts.includeEnvironment ?? true;
  const envName = `team-maker-${template.id}`;
  const lines: string[] = [];

  // ── Environment document ───────────────────────────────────────────────────
  if (includeEnvironment && template.envVars.length > 0) {
    lines.push(`apiVersion: aod/v1`);
    lines.push(`kind: Environment`);
    lines.push(`metadata:`);
    lines.push(`  name: ${envName}`);
    lines.push(`spec:`);
    lines.push(`  packages: {}`);
    lines.push(`  env_vars:`);
    template.envVars.forEach((v) => {
      // Always use ${VAR} in the download manifest so the user fills in their
      // own values — we never embed actual secrets in the downloaded file.
      lines.push(`    ${v.key}: \${${v.key}}`);
    });
    lines.push(`---`);
  }

  // ── Agent document ─────────────────────────────────────────────────────────
  lines.push(`apiVersion: aod/v1`);
  lines.push(`kind: Agent`);
  lines.push(`metadata:`);
  lines.push(`  name: ${template.id}`);
  lines.push(`spec:`);
  lines.push(`  runtime: ${template.runtime}`);
  lines.push(`  model: ${template.model}`);
  if (template.envVars.length > 0) {
    lines.push(`  environment: ${envName}`);
  }
  lines.push(`  system: >`);
  template.systemPrompt.split("\n").forEach((l) => lines.push(`    ${l}`));

  // Skills — each is { name?: string; source: string }
  if (template.skills.length > 0) {
    lines.push(`  skills:`);
    template.skills.forEach((s) => {
      lines.push(`    - source: ${s.source}`);
      if (s.name) lines.push(`      name: ${s.name}`);
    });
  }

  // MCP servers
  if (template.mcpServers.length > 0) {
    lines.push(`  mcp_servers:`);
    template.mcpServers.forEach((server) => {
      const s = resolveMcpServer(server, envValues);
      lines.push(`    ${s.name}:`);
      lines.push(`      type: ${s.type}`);
      if (s.url) lines.push(`      url: ${s.url}`);
      if (s.command) lines.push(`      command: ${s.command}`);
      if (s.args && s.args.length > 0) {
        lines.push(`      args:`);
        s.args.forEach((a) => lines.push(`        - ${a}`));
      }
      if (s.headers) {
        lines.push(`      headers:`);
        Object.entries(s.headers).forEach(([k, v]) =>
          lines.push(`        ${k}: ${v}`)
        );
      }
      if (s.env) {
        lines.push(`      env:`);
        Object.entries(s.env).forEach(([k, v]) =>
          lines.push(`        ${k}: "${v}"`)
        );
      }
    });
  }

  return lines.join("\n");
}
