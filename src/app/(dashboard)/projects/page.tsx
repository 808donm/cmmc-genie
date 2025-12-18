import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus } from "lucide-react";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Get user's organization
  const orgMembership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  // Get projects for the organization
  const projects = orgMembership
    ? await prisma.project.findMany({
        where: { organizationId: orgMembership.organizationId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  type Project = typeof projects[number];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="mt-2 text-slate-600">
            Manage your CMMC compliance projects and roadmaps
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Projects grid */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No projects yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              Get started by creating your first CMMC compliance project
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: Project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Target Level:</span>
                    <span className="font-medium">{project.targetCMMCLevel.replace("_", " ")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Status:</span>
                    <span className="font-medium capitalize">{project.status.toLowerCase().replace("_", " ")}</span>
                  </div>
                  {project.targetDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Target Date:</span>
                      <span className="font-medium">
                        {new Date(project.targetDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delivery views */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Kanban Board</CardTitle>
            <CardDescription>Track project tasks by status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Backlog", "In Progress", "Review", "Done"].map((column) => (
              <div key={column} className="rounded-lg border border-slate-200 p-3">
                <div className="text-sm font-semibold text-slate-900">{column}</div>
                <p className="text-xs text-slate-500">Drag-and-drop task planning</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Gantt Timeline</CardTitle>
            <CardDescription>Visualize milestones across weeks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Gap Analysis", "Remediation", "Policy Updates", "Assessment Prep"].map((item, index) => (
              <div key={item} className="space-y-2 rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between text-sm font-medium text-slate-900">
                  <span>{item}</span>
                  <span className="text-xs text-slate-500">Week {index + 1}-{index + 2}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${40 + index * 10}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>RACI Matrix</CardTitle>
            <CardDescription>Clarify ownership for controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "System Security Plan", roles: "R: PM · A: CISO · C: IT · I: Auditor" },
              { label: "Incident Response Playbooks", roles: "R: IR Lead · A: CISO · C: HR · I: Legal" },
              { label: "Vulnerability Scans", roles: "R: IT Ops · A: CISO · C: PM · I: Exec" },
            ].map((row) => (
              <div key={row.label} className="space-y-1 rounded-lg border border-slate-200 p-3">
                <div className="text-sm font-semibold text-slate-900">{row.label}</div>
                <p className="text-xs text-slate-600">{row.roles}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
