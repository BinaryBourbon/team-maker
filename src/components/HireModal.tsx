"use client";

import { useState, useEffect } from "react";
import { AgentTemplate } from "@/data/agents";
import { generateReadableManifest } from "@/lib/manifest";

interface HireModalProps {
  agent: AgentTemplate | null;
  onClose: () => void;
}

type Step = "config" | "preview" | "hiring" | "done" | "error";
type ConfigTab = "connect" | "manifest-only";

export function HireModal({ agent, onClose }: HireModalProps) {
  const [step, setStep] = useState<Step>("config");
  const [configTab, setConfigTab] = useState<ConfigTab>("connect");
  const [envValues, setEnvValues] = useState<Record<string, string>>({});
  const [aodBaseUrl, setAodBaseUrl] = useState("");
  const [aodToken, setAodToken] = useState("");
  const [manifest, setManifest] = useState("");
  const [result, setResult] = useState<{ action: string; agent: { name: string }; environmentId?: string | null } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [manifestGenerated, setManifestGenerated] = useState(false);

  useEffect(() => {
    if (agent) {
      setStep("config");
      setConfigTab("connect");
      setEnvValues({});
      setError("");
      setResult(null);
      setManifestGenerated(false);
      // Load saved AoD connection from localStorage
      const savedUrl = localStorage.getItem("aod_base_url") || "";
      const savedToken = localStorage.getItem("aod_token") || "";
      setAodBaseUrl(savedUrl);
      setAodToken(savedToken);
    }
  }, [agent]);

  useEffect(() => {
    if (agent && step === "preview") {
      // Apply preview: show agent doc only (no environment doc to avoid
      // echoing secret values back into the UI)
      setManifest(generateReadableManifest(agent, envValues, { includeEnvironment: false }));
    }
  }, [agent, envValues, step]);

  if (!agent) return null;

  const handleNext = () => {
    if (aodBaseUrl) localStorage.setItem("aod_base_url", aodBaseUrl);
    if (aodToken) localStorage.setItem("aod_token", aodToken);
    setStep("preview");
  };

  const handleGenerateManifest = () => {
    // Empty envValues → generator emits ${VAR} placeholders throughout
    setManifest(generateReadableManifest(agent, {}));
    setManifestGenerated(true);
  };

  const handleDownloadManifest = () => {
    const blob = new Blob([manifest], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manifest.yml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleHire = async () => {
    setStep("hiring");
    setError("");
    try {
      const res = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, envValues, aodBaseUrl, aodToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setStep("error");
      } else {
        setResult(data);
        setManifest(data.manifest);
        setStep("done");
      }
    } catch {
      setError("Network error — check your AoD URL");
      setStep("error");
    }
  };

  const copyManifest = () => {
    navigator.clipboard.writeText(manifest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canProceed = aodBaseUrl && aodToken;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${agent.color} rounded-t-2xl`} />
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{agent.emoji}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hire {agent.name}</h2>
              <p className="text-sm text-gray-500">{agent.persona}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Step: Config */}
          {step === "config" && (
            <div className="space-y-5">
              {/* Tab switcher */}
              <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setConfigTab("connect")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    configTab === "connect"
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  Connect to AoD
                </button>
                <button
                  onClick={() => { setConfigTab("manifest-only"); setManifestGenerated(false); }}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    configTab === "manifest-only"
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  Get Manifest Only
                </button>
              </div>

              {/* Connect to AoD tab */}
              {configTab === "connect" && (
                <>
                  {/* AoD connection */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      🔗 Your AoD Connection
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          AOD_BASE_URL
                        </label>
                        <input
                          type="url"
                          value={aodBaseUrl}
                          onChange={(e) => setAodBaseUrl(e.target.value)}
                          placeholder="https://your-aod.onrender.com"
                          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          AOD_TOKEN
                        </label>
                        <input
                          type="password"
                          value={aodToken}
                          onChange={(e) => setAodToken(e.target.value)}
                          placeholder="your-aod-bearer-token"
                          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Env vars */}
                  {agent.envVars.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        🔑 Required Secrets
                      </h3>
                      <div className="space-y-3">
                        {agent.envVars.map((v) => (
                          <div key={v.key}>
                            <div className="flex items-center gap-2 mb-1">
                              <label className="text-xs font-mono font-medium text-amber-700 dark:text-amber-400">
                                {v.key}
                              </label>
                              {v.required && (
                                <span className="text-xs text-red-500">required</span>
                              )}
                              {v.link && (
                                <a
                                  href={v.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-500 hover:underline ml-auto"
                                >
                                  Get it →
                                </a>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-1">{v.description}</p>
                            <input
                              type="password"
                              value={envValues[v.key] || ""}
                              onChange={(e) =>
                                setEnvValues((prev) => ({ ...prev, [v.key]: e.target.value }))
                              }
                              placeholder={v.placeholder}
                              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${agent.color} hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    Preview Manifest →
                  </button>
                </>
              )}

              {/* Get Manifest Only tab */}
              {configTab === "manifest-only" && (
                <>
                  {/* Requirements section — read-only, no secret inputs */}
                  {agent.envVars.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Requirements
                      </h3>
                      <div className="space-y-2">
                        {agent.envVars.map((v) => (
                          <div
                            key={v.key}
                            className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2.5"
                          >
                            <code className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                              {v.key}
                            </code>
                            <p className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                              {v.description}
                            </p>
                            {v.link && (
                              <a
                                href={v.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 shrink-0 font-medium"
                              >
                                Get it →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!manifestGenerated ? (
                    <button
                      onClick={handleGenerateManifest}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${agent.color} hover:opacity-90 active:scale-95 transition-all`}
                    >
                      Generate Manifest
                    </button>
                  ) : (
                    <div className="space-y-4">
                      {/* YAML output */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          📄 Generated Manifest
                        </h3>
                        <button
                          onClick={copyManifest}
                          className="text-xs text-blue-500 hover:text-blue-600"
                        >
                          {copied ? "✓ Copied" : "Copy YAML"}
                        </button>
                      </div>
                      <pre className="bg-gray-950 text-green-400 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono max-h-60 overflow-y-auto">
                        {manifest}
                      </pre>

                      {/* Download button */}
                      <button
                        onClick={handleDownloadManifest}
                        className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>⬇</span> Download manifest.yml
                      </button>

                      {/* Secrets callout */}
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold mb-1">
                          Before starting a conversation
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          Add these secrets to an AoD environment named{" "}
                          <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded font-mono">
                            team-maker-{agent.id}
                          </code>{" "}
                          before starting a conversation.
                        </p>
                      </div>

                      {/* Tip box */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
                          💡 No AoD yet?
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                          Install with:
                        </p>
                        <code className="block text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-lg px-3 py-2 font-mono">
                          brew install jhgaylor/tap/aod &amp;&amp; aod apply -f manifest.yml
                        </code>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step: Preview */}
          {step === "preview" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Here&rsquo;s exactly what will be created in your AoD instance at{" "}
                <code className="text-amber-600 dark:text-amber-400 break-all">{aodBaseUrl}</code>.
              </p>

              {/* Environment card */}
              {agent.envVars.length > 0 && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Environment</span>
                    <code className="text-xs font-mono text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                      team-maker-{agent.id}
                    </code>
                  </div>
                  <div className="px-4 py-3 space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Secrets to be stored:</p>
                    {agent.envVars.map((v) => (
                      <div key={v.key} className="flex items-center justify-between">
                        <code className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-400">
                          {v.key}
                        </code>
                        <span className="text-xs font-mono text-gray-400 dark:text-gray-500 tracking-widest">
                          {envValues[v.key] ? "••••••••" : <span className="text-red-400 not-italic font-sans">not set</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agent card */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Agent</span>
                  <code className="text-xs font-mono text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                    {agent.id}
                  </code>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {/* Runtime + model */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md font-mono">
                      {agent.runtime}
                    </span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md font-mono">
                      {agent.model}
                    </span>
                    {agent.envVars.length > 0 && (
                      <span className="text-xs bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-md font-mono">
                        env: team-maker-{agent.id}
                      </span>
                    )}
                  </div>

                  {/* MCP servers */}
                  {agent.mcpServers.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">MCP servers:</p>
                      <div className="space-y-1.5">
                        {agent.mcpServers.map((s) => (
                          <div key={s.name} className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-300 w-24 shrink-0">
                              🔌 {s.name}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {s.type === "http" ? s.url : `${s.command} ${(s.args ?? []).join(" ")}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {agent.skills.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Skills:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {agent.skills.map((s, i) => (
                          <span key={i} className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-mono">
                            ⚡ {s.name ? `${s.source}/${s.name}` : s.source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setStep("config")}
                  className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleHire}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${agent.color} hover:opacity-90 active:scale-95 transition-all`}
                >
                  Hire Now 🎉
                </button>
              </div>
            </div>
          )}

          {/* Step: Hiring */}
          {step === "hiring" && (
            <div className="flex flex-col items-center py-10 gap-4">
              <div className="text-5xl animate-bounce">{agent.emoji}</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Applying manifest to your AoD instance...
              </p>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${agent.color} animate-pulse`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step: Done */}
          {step === "done" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center py-6 gap-3">
                <div className="text-5xl">🎉</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {agent.name} is hired!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Agent {result?.action === "updated" ? "updated" : "created"} successfully in your AoD instance.
                  You can now start a conversation with{" "}
                  <strong>{result?.agent?.name || agent.id}</strong>.
                </p>
              </div>
              {result?.environmentId && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 text-xs text-green-700 dark:text-green-300">
                  Secrets stored in environment{" "}
                  <code className="font-mono bg-green-100 dark:bg-green-900/40 px-1 rounded">
                    team-maker-{agent.id}
                  </code>
                </div>
              )}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-xs text-gray-600 dark:text-gray-400">
                <p className="font-medium mb-1">Next steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    Open your AoD instance at{" "}
                    <a href={aodBaseUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {aodBaseUrl}
                    </a>
                  </li>
                  <li>Find <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{agent.id}</code> in your agent list</li>
                  <li>Start a new conversation and put {agent.name} to work!</li>
                </ol>
              </div>
              <button
                onClick={onClose}
                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${agent.color}`}
              >
                Close
              </button>
            </div>
          )}

          {/* Step: Error */}
          {step === "error" && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Something went wrong</p>
                <p className="text-xs text-red-600 dark:text-red-500">{error}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("config")}
                  className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  ← Try Again
                </button>
                <button onClick={onClose} className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm bg-gray-100 dark:bg-gray-800 hover:opacity-80">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
