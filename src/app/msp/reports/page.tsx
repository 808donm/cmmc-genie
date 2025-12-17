import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, FileText, Building2, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default async function MspReportsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) {
    redirect("/dashboard");
  }

  // Fetch all client organizations
  const clients = await prisma.organization.findMany({
    where: {
      type: "CLIENT",
      mspClientProjects: {
        some: {
          mspOrganizationId: mspOrg.id,
        },
      },
    },
    include: {
      _count: {
        select: {
          projects: true,
          members: true,
        },
      },
    },
  });

  // Fetch all MSP projects
  const projects = await prisma.mspProject.findMany({
    where: {
      mspOrganizationId: mspOrg.id,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  // Fetch all MSP tasks
  const tasks = await prisma.mspTask.findMany({
    where: {
      project: {
        mspOrganizationId: mspOrg.id,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  type Project = typeof projects[number];
  type Task = typeof tasks[number];
  type Client = typeof clients[number];

  // Calculate statistics
  const totalClients = clients.length;
  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  const projectsByStatus = {
    PLANNING: projects.filter((p: Project) => p.status === "PLANNING").length,
    ACTIVE: projects.filter((p: Project) => p.status === "ACTIVE").length,
    ON_HOLD: projects.filter((p: Project) => p.status === "ON_HOLD").length,
    AT_RISK: projects.filter((p: Project) => p.status === "AT_RISK").length,
    COMPLETED: projects.filter((p: Project) => p.status === "COMPLETED").length,
    CANCELLED: projects.filter((p: Project) => p.status === "CANCELLED").length,
  };

  const tasksByStatus = {
    TODO: tasks.filter((t: Task) => t.status === "TODO").length,
    IN_PROGRESS: tasks.filter((t: Task) => t.status === "IN_PROGRESS").length,
    UNDER_REVIEW: tasks.filter((t: Task) => t.status === "UNDER_REVIEW").length,
    BLOCKED: tasks.filter((t: Task) => t.status === "BLOCKED").length,
    COMPLETED: tasks.filter((t: Task) => t.status === "COMPLETED").length,
    CANCELLED: tasks.filter((t: Task) => t.status === "CANCELLED").length,
  };

  const taskCompletionRate = totalTasks > 0
    ? Math.round((tasksByStatus.COMPLETED / totalTasks) * 100)
    : 0;

  const projectCompletionRate = totalProjects > 0
    ? Math.round((projectsByStatus.COMPLETED / totalProjects) * 100)
    : 0;

  // Calculate average project progress
  const avgProjectProgress = projects.length > 0
    ? Math.round(projects.reduce((sum: number, p: Project) => sum + p.progress, 0) / projects.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="mt-2 text-slate-600">
          Comprehensive analytics across all client organizations and projects
        </p>
      </div>

      {/* Overview statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              Active client organizations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {projectsByStatus.ACTIVE} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {projectsByStatus.COMPLETED} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {tasksByStatus.COMPLETED} of {totalTasks} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of all projects by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Planning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${totalProjects > 0 ? (projectsByStatus.PLANNING / totalProjects) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{projectsByStatus.PLANNING}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: `${totalProjects > 0 ? (projectsByStatus.ACTIVE / totalProjects) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{projectsByStatus.ACTIVE}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">On Hold</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-amber-600"
                      style={{ width: `${totalProjects > 0 ? (projectsByStatus.ON_HOLD / totalProjects) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{projectsByStatus.ON_HOLD}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">At Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-red-600"
                      style={{ width: `${totalProjects > 0 ? (projectsByStatus.AT_RISK / totalProjects) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{projectsByStatus.AT_RISK}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-purple-600"
                      style={{ width: `${totalProjects > 0 ? (projectsByStatus.COMPLETED / totalProjects) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{projectsByStatus.COMPLETED}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of all tasks by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium">To Do</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-slate-600"
                      style={{ width: `${totalTasks > 0 ? (tasksByStatus.TODO / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{tasksByStatus.TODO}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${totalTasks > 0 ? (tasksByStatus.IN_PROGRESS / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{tasksByStatus.IN_PROGRESS}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Under Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-purple-600"
                      style={{ width: `${totalTasks > 0 ? (tasksByStatus.UNDER_REVIEW / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{tasksByStatus.UNDER_REVIEW}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Blocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-red-600"
                      style={{ width: `${totalTasks > 0 ? (tasksByStatus.BLOCKED / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{tasksByStatus.BLOCKED}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: `${totalTasks > 0 ? (tasksByStatus.COMPLETED / totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{tasksByStatus.COMPLETED}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Client Performance Overview</CardTitle>
          <CardDescription>
            Progress and project status for each client organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No clients found
            </div>
          ) : (
            <div className="space-y-4">
              {clients.map((client: Client) => {
                const clientProjects = projects.filter((p: Project) => p.clientId === client.id);
                const clientProgress = clientProjects.length > 0
                  ? Math.round(clientProjects.reduce((sum: number, p: Project) => sum + p.progress, 0) / clientProjects.length)
                  : 0;
                const activeProjects = clientProjects.filter((p: Project) => p.status === "ACTIVE").length;
                const completedProjects = clientProjects.filter((p: Project) => p.status === "COMPLETED").length;

                return (
                  <div
                    key={client.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-slate-900">{client.name}</h3>
                        <span className="text-sm font-bold text-slate-900">{clientProgress}%</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${clientProgress}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-600">
                        <span>{clientProjects.length} total projects</span>
                        <span>•</span>
                        <span>{activeProjects} active</span>
                        <span>•</span>
                        <span>{completedProjects} completed</span>
                      </div>
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
