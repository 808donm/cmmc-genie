import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentChat } from "@/components/agents/agent-chat";
import { AGENT_REGISTRY } from "@/lib/ai/agent-registry";
import { Bot, Sparkles } from "lucide-react";

export default function AgentsPage() {
  const agents = Object.values(AGENT_REGISTRY);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Compliance Agents</h1>
        <p className="mt-2 text-slate-600">
          Get expert guidance on CMMC compliance from specialized AI agents
        </p>
      </div>

      {/* Agent capabilities overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.slice(1).map((agent) => ( // Skip orchestrator
          <Card key={agent.type}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base">{agent.name}</CardTitle>
                </div>
              </div>
              <CardDescription className="line-clamp-2">{agent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 3).map((capability, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                  >
                    {capability}
                  </span>
                ))}
                {agent.capabilities.length > 3 && (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    +{agent.capabilities.length - 3} more
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chat interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <CardTitle>AI Assistant</CardTitle>
          </div>
          <CardDescription>
            Ask questions about CMMC compliance, policies, configurations, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgentChat />
        </CardContent>
      </Card>
    </div>
  );
}
