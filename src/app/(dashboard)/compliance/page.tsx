import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default async function CompliancePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Get user's organization
  const orgMembership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  // Get compliance stats
  const projects = orgMembership
    ? await prisma.project.findMany({
        where: { organizationId: orgMembership.organizationId },
        include: {
          controls: true,
        },
      })
    : [];

  const totalControls = projects.reduce((sum, p) => sum + p.controls.length, 0);
  const compliantControls = projects.reduce(
    (sum, p) => sum + p.controls.filter((c) => c.status === "COMPLIANT").length,
    0
  );
  const inProgressControls = projects.reduce(
    (sum, p) => sum + p.controls.filter((c) => c.status === "IN_PROGRESS").length,
    0
  );
  const notStartedControls = projects.reduce(
    (sum, p) => sum + p.controls.filter((c) => c.status === "NOT_STARTED").length,
    0
  );

  const complianceRate = totalControls > 0 ? (compliantControls / totalControls) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Compliance Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Track your CMMC compliance progress across all controls
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceRate.toFixed(1)}%</div>
            <p className="text-xs text-slate-600">
              {compliantControls} of {totalControls} controls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compliantControls}</div>
            <p className="text-xs text-slate-600">Controls fully implemented</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressControls}</div>
            <p className="text-xs text-slate-600">Controls being implemented</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notStartedControls}</div>
            <p className="text-xs text-slate-600">Controls pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects compliance breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Projects Compliance Status</CardTitle>
          <CardDescription>Detailed compliance breakdown by project</CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-slate-600">No projects found. Create a project to start tracking compliance.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => {
                const projectCompliant = project.controls.filter((c) => c.status === "COMPLIANT").length;
                const projectTotal = project.controls.length;
                const projectRate = projectTotal > 0 ? (projectCompliant / projectTotal) * 100 : 0;

                return (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-slate-900">{project.name}</h4>
                        <p className="text-sm text-slate-600">
                          {project.targetCMMCLevel.replace("_", " ")} • {projectCompliant}/{projectTotal} controls
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{projectRate.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${projectRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
