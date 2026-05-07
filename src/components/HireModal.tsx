"use client";

import { useState, useEffect } from "react";
import { AgentTemplate } from "@/data/agents";
import { generateReadableManifest } from "@/lib/manifest";

interface HireModalProps {
  agent: AgentTemplate | null;
  onClose: () => void;
}

type Step = "config" | "preview" | "hiring" | "done" | "error";

export function HireModal({ agent, onClose }: HireModalProps) {
  const [step, setStep] = useState<Step>("config");
  const [envValues, setEnvValues] = useState<Record<string, string>>({});
  const [aodBaseUrl, setAodBaseUrl] = useState("");
  const [aodToken, setAodToken] = useState("");
  const [manifest, setManifest] = useState("");
  const [result, setResult] = useState<{ action: string; agent: { name: string } } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (agent) {
      setStep("config");
      setEnvValues({});
      setError("");
      setResult(null);
      // Load saved AoD connection from localStorage
      const savedUrl = localStorage.getItem("aod_base_url") || "";
      const savedToken = localStorage.getItem("aod_token") || "";
      setAodBaseUrl(savedUrl);
      setAodToken(savedToken);
    }
  }, [agent]);

  useEffect(() => {
    if (agent && step === "preview") {
      setManifest(generateReadableManifest(agent, envValues));
    }
  }, [agent, envValues, step]);

  if (!agent) return null;

  const handleNext = () => {
    if (aodBaseUrl) localStorage.setItem("aod_base_url", aodBaseUrl);
    if (aodToken) localStorage.setItem("aod_token", aodToken);
    setStep("preview");
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
            </div>
          )}

          {/* Step: Preview */}
          {step === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  📄 Generated Manifest
                </h3>
                <button
                  onClick={copyManifest}
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <pre className="bg-gray-950 text-green-400 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono max-h-72 overflow-y-auto">
                {manifest}
              </pre>
              <p className="text-xs text-gray-500">
                This manifest will be applied to your AoD instance at{" "}
                <code className="text-amber-600 dark:text-amber-400">{aodBaseUrl}</code>. Agent will be
                immediately available.
              </p>
              <div className="flex gap-3">
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
