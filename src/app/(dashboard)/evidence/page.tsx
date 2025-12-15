import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Archive, Upload, FileText, CheckCircle2, AlertCircle, Filter } from "lucide-react";

export default async function EvidenceVaultPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Get user's organization
  const orgMembership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  // Get all CMMC controls
  const controls = await prisma.cMMCControl.findMany({
    orderBy: [{ domain: "asc" }, { id: "asc" }],
  });

  // Get all projects for the organization to check control instances
  const projects = orgMembership
    ? await prisma.project.findMany({
        where: { organizationId: orgMembership.organizationId },
        include: {
          controls: {
            include: {
              evidence: true,
            },
          },
          evidence: true,
        },
      })
    : [];

  // Create a map of control evidence counts
  const controlEvidenceMap = new Map<string, { count: number; status: string }>();
  projects.forEach((project) => {
    project.controls.forEach((controlInstance) => {
      const existing = controlEvidenceMap.get(controlInstance.controlId) || {
        count: 0,
        status: "NOT_STARTED",
      };
      controlEvidenceMap.set(controlInstance.controlId, {
        count: existing.count + controlInstance.evidence.length,
        status: controlInstance.status,
      });
    });
  });

  // Get total evidence count
  const totalEvidence = projects.reduce((sum, p) => sum + p.evidence.length, 0);
  const controlsWithEvidence = Array.from(controlEvidenceMap.values()).filter(
    (c) => c.count > 0
  ).length;

  // Group controls by domain
  const controlsByDomain = controls.reduce((acc, control) => {
    if (!acc[control.domain]) {
      acc[control.domain] = [];
    }
    acc[control.domain].push(control);
    return acc;
  }, {} as Record<string, typeof controls>);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Evidence Vault</h1>
          <p className="mt-2 text-slate-600">
            Upload and manage evidence for all 110 CMMC controls
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Evidence
        </Button>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Evidence</CardTitle>
            <Archive className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvidence}</div>
            <p className="text-xs text-slate-600">Documents uploaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Controls with Evidence</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {controlsWithEvidence} / {controls.length}
            </div>
            <p className="text-xs text-slate-600">
              {((controlsWithEvidence / controls.length) * 100).toFixed(1)}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Evidence</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{controls.length - controlsWithEvidence}</div>
            <p className="text-xs text-slate-600">Controls need documentation</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>CMMC Controls</CardTitle>
              <CardDescription>Browse all controls and their evidence status</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Controls list by domain */}
      {Object.entries(controlsByDomain).map(([domain, domainControls]) => (
        <Card key={domain}>
          <CardHeader>
            <CardTitle className="text-lg">{domain}</CardTitle>
            <CardDescription>
              {domainControls.length} controls • Level {Math.min(...domainControls.map((c) => c.level))}
              -{Math.max(...domainControls.map((c) => c.level))}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {domainControls.map((control) => {
                const evidenceInfo = controlEvidenceMap.get(control.id);
                const hasEvidence = evidenceInfo && evidenceInfo.count > 0;

                return (
                  <div
                    key={control.id}
                    className="flex items-start justify-between rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          {control.id}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          Level {control.level}
                        </span>
                        {hasEvidence ? (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{evidenceInfo.count} evidence</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <AlertCircle className="h-3 w-3" />
                            <span>No evidence</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-900">{control.practice}</p>
                      <p className="mt-1 text-sm text-slate-600">{control.description}</p>
                      {evidenceInfo?.status && (
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              evidenceInfo.status === "COMPLIANT"
                                ? "bg-green-100 text-green-700"
                                : evidenceInfo.status === "IN_PROGRESS"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {evidenceInfo.status.replace(/_/g, " ")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm">
                        <Upload className="mr-2 h-3 w-3" />
                        Upload
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
