import { AgentTemplate, McpServer } from "@/data/agents";

function interpolateEnvVars(value: string, envValues: Record<string, string>): string {
  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => envValues[key] || `{{${key}}}`);
}

function interpolateMcpServer(server: McpServer, envValues: Record<string, string>): McpServer {
  const result: McpServer = { ...server };
  if (result.url) result.url = interpolateEnvVars(result.url, envValues);
  if (result.headers) {
    result.headers = Object.fromEntries(
      Object.entries(result.headers).map(([k, v]) => [k, interpolateEnvVars(v, envValues)])
    );
  }
  if (result.env) {
    result.env = Object.fromEntries(
      Object.entries(result.env).map(([k, v]) => [k, interpolateEnvVars(v, envValues)])
    );
  }
  if (result.args) {
    result.args = result.args.map((a) => interpolateEnvVars(a, envValues));
  }
  return result;
}

export function generateManifest(template: AgentTemplate, envValues: Record<string, string>): string {
  const mcpSection = template.mcpServers.length > 0
    ? template.mcpServers.reduce((acc, server) => {
        const s = interpolateMcpServer(server, envValues);
        const serverConfig: Record<string, unknown> = { type: s.type };
        if (s.url) serverConfig.url = s.url;
        if (s.command) serverConfig.command = s.command;
        if (s.args) serverConfig.args = s.args;
        if (s.headers) serverConfig.headers = s.headers;
        if (s.env) serverConfig.env = s.env;
        acc[s.name] = serverConfig;
        return acc;
      }, {} as Record<string, unknown>)
    : undefined;

  const agentSpec: Record<string, unknown> = {
    runtime: template.runtime,
    model: template.model,
    system: template.systemPrompt,
  };
  if (template.skills.length > 0) agentSpec.skills = template.skills;
  if (mcpSection) agentSpec.mcp_servers = mcpSection;

  const manifest = {
    apiVersion: "aod/v1",
    kind: "Agent",
    metadata: { name: template.id },
    spec: agentSpec,
  };

  // Format as YAML-like structure
  return toYaml(manifest);
}

function toYaml(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null || obj === undefined) return "null";
  if (typeof obj === "boolean") return obj.toString();
  if (typeof obj === "number") return obj.toString();
  if (typeof obj === "string") {
    if (obj.includes("\n") || obj.includes(":") || obj.includes("#") || obj.startsWith(" ")) {
      return `|\n${obj.split("\n").map((l) => pad + "  " + l).join("\n")}`;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item) => `\n${pad}- ${toYaml(item, indent + 1)}`).join("");
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries
      .map(([k, v]) => {
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
          return `\n${pad}${k}:\n${Object.entries(v as Record<string, unknown>)
            .map(([k2, v2]) => `${"  ".repeat(indent + 1)}${k2}: ${toYaml(v2, indent + 2)}`)
            .join("\n")}`;
        }
        if (Array.isArray(v)) {
          return `\n${pad}${k}:${toYaml(v, indent + 1)}`;
        }
        const rendered = toYaml(v, indent + 1);
        if (rendered.startsWith("|")) {
          return `\n${pad}${k}: ${rendered}`;
        }
        return `\n${pad}${k}: ${rendered}`;
      })
      .join("");
  }
  return String(obj);
}

export function generateReadableManifest(template: AgentTemplate, envValues: Record<string, string>): string {
  const lines: string[] = [
    `apiVersion: aod/v1`,
    `kind: Agent`,
    `metadata:`,
    `  name: ${template.id}`,
    `spec:`,
    `  runtime: ${template.runtime}`,
    `  model: ${template.model}`,
    `  system: >`,
    ...template.systemPrompt.split("\n").map((l) => `    ${l}`),
  ];

  if (template.skills.length > 0) {
    lines.push(`  skills:`);
    template.skills.forEach((s) => lines.push(`    - ${s}`));
  }

  if (template.mcpServers.length > 0) {
    lines.push(`  mcp_servers:`);
    template.mcpServers.forEach((server) => {
      const s = interpolateMcpServer(server, envValues);
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
        Object.entries(s.headers).forEach(([k, v]) => lines.push(`        ${k}: ${v}`));
      }
      if (s.env) {
        lines.push(`      env:`);
        Object.entries(s.env).forEach(([k, v]) => lines.push(`        ${k}: ${v}`));
      }
    });
  }

  return lines.join("\n");
}
