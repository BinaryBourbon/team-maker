import { NextRequest, NextResponse } from "next/server";
import { AGENT_TEMPLATES } from "@/data/agents";
import { generateReadableManifest } from "@/lib/manifest";

export async function POST(req: NextRequest) {
  try {
    const { agentId, envValues, aodBaseUrl, aodToken } = await req.json();

    if (!agentId || !aodBaseUrl || !aodToken) {
      return NextResponse.json({ error: "agentId, aodBaseUrl, and aodToken are required" }, { status: 400 });
    }

    const template = AGENT_TEMPLATES.find((t) => t.id === agentId);
    if (!template) {
      return NextResponse.json({ error: "Agent template not found" }, { status: 404 });
    }

    const manifest = generateReadableManifest(template, envValues || {});

    // Build MCP servers config, interpolating env var placeholders with provided values
    const mcpServersConfig: Record<string, unknown> = {};
    template.mcpServers.forEach((server) => {
      const interpolated = { ...server };
      const envVals = envValues || {};

      const replaceVars = (val: string) =>
        val.replace(/\{\{(\w+)\}\}/g, (_: string, k: string) => envVals[k] || `{{${k}}}`);

      const serverConfig: Record<string, unknown> = { type: interpolated.type };
      if (interpolated.url) serverConfig.url = replaceVars(interpolated.url);
      if (interpolated.command) serverConfig.command = interpolated.command;
      if (interpolated.args) serverConfig.args = interpolated.args.map(replaceVars);
      if (interpolated.headers) {
        serverConfig.headers = Object.fromEntries(
          Object.entries(interpolated.headers).map(([k, v]) => [k, replaceVars(v)])
        );
      }
      if (interpolated.env) {
        serverConfig.env = Object.fromEntries(
          Object.entries(interpolated.env).map(([k, v]) => [k, replaceVars(v)])
        );
      }
      mcpServersConfig[interpolated.name] = serverConfig;
    });

    // Check if AoD connection is valid by listing agents
    const listRes = await fetch(`${aodBaseUrl}/api/agents`, {
      headers: { Authorization: `Bearer ${aodToken}` },
    });

    if (!listRes.ok) {
      return NextResponse.json({ error: "Failed to connect to AoD. Check your URL and token." }, { status: 502 });
    }

    // --- Environment creation and secret storage ---
    const environmentName = `team-maker-${agentId}`;

    // Check if the environment already exists
    const envsRes = await fetch(`${aodBaseUrl}/api/environments`, {
      headers: { Authorization: `Bearer ${aodToken}` },
    });

    let environmentId: string | null = null;

    if (envsRes.ok) {
      const envsData = await envsRes.json();
      const existingEnv = envsData.data?.find(
        (e: { name: string; id: string }) => e.name === environmentName
      );
      if (existingEnv) {
        environmentId = existingEnv.id as string;
      }
    }

    // Create the environment if it doesn't exist
    if (!environmentId) {
      const createEnvRes = await fetch(`${aodBaseUrl}/api/environments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${aodToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: environmentName, packages: {} }),
      });

      if (createEnvRes.ok) {
        const createEnvData = await createEnvRes.json();
        environmentId = createEnvData.data?.id as string | null;
      }
    }

    // Write each provided secret into the environment
    if (environmentId && envValues && typeof envValues === "object") {
      const secretEntries = Object.entries(envValues as Record<string, string>);
      for (const [key, value] of secretEntries) {
        if (key && value) {
          await fetch(`${aodBaseUrl}/api/environments/${environmentId}/secrets`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${aodToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ key, value }),
          });
        }
      }
    }
    // --- End environment setup ---

    const agentPayload: Record<string, unknown> = {
      name: template.id,
      runtime: template.runtime,
      model: template.model,
      system: template.systemPrompt,
      environment: environmentName,
    };
    if (template.skills.length > 0) agentPayload.skills = template.skills;
    if (Object.keys(mcpServersConfig).length > 0) agentPayload.mcp_servers = mcpServersConfig;

    const listData = await listRes.json();
    const existing = listData.data?.find((a: { name: string }) => a.name === template.id);

    let agentRes: Response;
    if (existing) {
      // Update existing agent
      agentRes = await fetch(`${aodBaseUrl}/api/agents/${existing.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${aodToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentPayload),
      });
    } else {
      // Create new agent
      agentRes = await fetch(`${aodBaseUrl}/api/agents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${aodToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentPayload),
      });
    }

    if (!agentRes.ok) {
      const errText = await agentRes.text();
      return NextResponse.json({ error: `AoD API error: ${errText}` }, { status: agentRes.status });
    }

    const agentData = await agentRes.json();

    return NextResponse.json({
      success: true,
      agent: agentData.data,
      manifest,
      action: existing ? "updated" : "created",
      environmentId,
    });
  } catch (err) {
    console.error("Hire API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
