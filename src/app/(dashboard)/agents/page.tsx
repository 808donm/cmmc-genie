import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentChat } from "@/components/agents/agent-chat";
import { Sparkles } from "lucide-react";

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">The CMMC Genie</h1>
        <p className="mt-2 text-slate-600">
          Your AI-powered CMMC compliance assistant
        </p>
      </div>

      {/* Chat interface */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-xl">Ask The CMMC Genie</CardTitle>
          </div>
          <CardDescription className="text-center">
            Get expert guidance on CMMC compliance, controls, policies, evidence collection, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgentChat />
        </CardContent>
      </Card>

      {/* Help section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compliance Guidance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Ask about CMMC controls, requirements, and best practices for achieving compliance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Policy & Documentation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Get help drafting policies, procedures, and documentation required for CMMC certification.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evidence Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Learn what evidence you need and how to organize it for each control in your compliance journey.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
