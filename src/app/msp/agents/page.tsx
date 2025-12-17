import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentChat } from "@/components/agents/agent-chat";
import { Sparkles, Users, FileText, Target } from "lucide-react";

export default function MspAgentsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900">MSP AI Assistant</h1>
        </div>
        <p className="mt-2 text-slate-600">
          Your AI-powered assistant for managing CMMC compliance across all client organizations
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
            Get expert guidance on client management, policy generation, compliance tracking, and assessment preparation across all your clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgentChat />
        </CardContent>
      </Card>

      {/* MSP-specific help sections */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Multi-Client Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Get assistance managing CMMC compliance across multiple client organizations, tracking progress, and identifying common gaps.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">Policy Templates & Customization</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Generate customized policies and procedures for each client based on their specific requirements and industry context.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base">Assessment Preparation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Prepare clients for C3PAO assessments with gap analysis, evidence collection guidance, and remediation planning.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* MSP-specific example questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Example Questions for MSP Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Client Management</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• &quot;Show me clients at risk of missing their certification deadline&quot;</li>
                <li>• &quot;Which clients have incomplete access control policies?&quot;</li>
                <li>• &quot;Compare compliance progress across all clients&quot;</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Policy & Documentation</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• &quot;Generate an incident response policy for healthcare client&quot;</li>
                <li>• &quot;Create a configuration management plan template&quot;</li>
                <li>• &quot;Draft security awareness training materials&quot;</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Assessment Support</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• &quot;Prepare a C3PAO assessment checklist for XYZ Corp&quot;</li>
                <li>• &quot;What evidence gaps exist across active projects?&quot;</li>
                <li>• &quot;Generate pre-assessment readiness report&quot;</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700">Technical Guidance</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>• &quot;How to configure Azure AD for CMMC compliance?&quot;</li>
                <li>• &quot;Best practices for encryption at rest and in transit&quot;</li>
                <li>• &quot;Network segmentation requirements for Level 2&quot;</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
