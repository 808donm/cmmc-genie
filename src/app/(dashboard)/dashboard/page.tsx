import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, AlertCircle, TrendingUp, FolderKanban, MessageSquare, Shield } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { shouldShowMspDashboard } from "@/lib/msp/utils";

export default async function DashboardPage() {
  const session = await auth();
  const organizationId = session?.user.activeOrganization;
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

  // Redirect MSP users to MSP dashboard
  if (session?.user?.id) {
    const isMsp = await shouldShowMspDashboard(session.user.id);
    if (isMsp) {
      redirect("/msp/dashboard");
    }
  }

  // For super admins, show all organizations. For regular users, filter by their org.
  const orgFilter = isSuperAdmin ? {} : { organizationId: organizationId || "" };

  // Fetch dashboard data
  const [projects, tasks, upcomingMeetings, allControls, controlInstances] = await Promise.all([
    prisma.project.findMany({
      where: orgFilter,
      include: {
        roadmaps: {
          include: {
            milestones: true,
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
      take: 5,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.task.findMany({
      where: {
        project: orgFilter,
        status: { in: ["TODO", "IN_PROGRESS"] },
      },
      include: {
        project: true,
        assignments: {
          include: {
            user: true,
          },
        },
      },
      take: 10,
      orderBy: { dueDate: "asc" },
    }),
    prisma.meeting.findMany({
      where: {
        project: orgFilter,
        startTime: { gte: new Date() },
      },
      include: {
        attendees: {
          include: {
            user: true,
          },
        },
      },
      take: 5,
      orderBy: { startTime: "asc" },
    }),
    prisma.cMMCControl.count(),
    prisma.controlInstance.findMany({
      where: {
        project: orgFilter,
      },
      select: {
        status: true,
      },
    }),
  ]);

  // Calculate stats
  type Task = typeof tasks[number];
  type ControlInstance = typeof controlInstances[number];
  type Project = typeof projects[number];
  type Meeting = typeof upcomingMeetings[number];

  const totalTasks = tasks.length;
  const completedTasks = await prisma.task.count({
    where: {
      project: orgFilter,
      status: "DONE",
    },
  });
  const overdueTasks = tasks.filter((task: Task) => task.dueDate && task.dueDate < new Date()).length;

  // Calculate compliance progress
  const totalControls = allControls || 110; // Default to 110 CMMC controls
  const compliantControls = controlInstances.filter((c: ControlInstance) => c.status === "COMPLIANT").length;
  const inProgressControls = controlInstances.filter((c: ControlInstance) => c.status === "IN_PROGRESS").length;
  const notStartedControls = totalControls - controlInstances.length;
  const compliancePercentage = totalControls > 0 ? (compliantControls / totalControls) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Welcome back, {session?.user.name}! Here&apos;s your CMMC compliance overview.
        </p>
        {isSuperAdmin && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-800">
            <Shield className="h-4 w-4" />
            Viewing All Organizations (Super Admin)
          </div>
        )}
      </div>

      {/* Compliance Progress */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                CMMC Compliance Journey
              </CardTitle>
              <CardDescription className="mt-1">
                Your progress across all 110 CMMC controls
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{compliancePercentage.toFixed(1)}%</div>
              <p className="text-sm text-slate-600">Complete</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                {compliantControls} of {totalControls} controls compliant
              </span>
              <span className="text-slate-600">
                {inProgressControls} in progress · {notStartedControls} not started
              </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full flex">
                <div
                  className="bg-green-500 transition-all duration-500"
                  style={{ width: `${(compliantControls / totalControls) * 100}%` }}
                />
                <div
                  className="bg-yellow-500 transition-all duration-500"
                  style={{ width: `${(inProgressControls / totalControls) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-slate-700">
                <span className="font-medium">{compliantControls}</span> Compliant
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="text-slate-700">
                <span className="font-medium">{inProgressControls}</span> In Progress
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-slate-200" />
              <span className="text-slate-700">
                <span className="font-medium">{notStartedControls}</span> Not Started
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="default">
              <Link href="/compliance">View Compliance Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/evidence">Evidence Vault</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              Tracking compliance progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks in Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completed this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingMeetings.length}</div>
            <p className="text-xs text-muted-foreground">
              Next in {upcomingMeetings[0] ? "today" : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Your current CMMC compliance projects</CardDescription>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">No active projects</p>
                <Button asChild className="mt-4">
                  <Link href="/projects/new">Create Project</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project: Project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                  >
                    <div>
                      <h3 className="font-medium text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-500">
                        {project._count.tasks} tasks · Target: {project.targetCMMCLevel.replace("_", " ")}
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/projects/${project.id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-muted-foreground">No pending tasks</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task: Task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 p-3"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-900">{task.title}</h4>
                      <p className="text-xs text-slate-500">
                        {task.project.name}
                        {task.assignments.length > 0 &&
                          ` · ${task.assignments[0].user.name}`}
                      </p>
                    </div>
                    {task.dueDate && (
                      <span
                        className={`text-xs ${
                          task.dueDate < new Date()
                            ? "text-red-600"
                            : "text-slate-500"
                        }`}
                      >
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ))}
                {tasks.length > 5 && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/tasks">View all tasks</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming meetings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
          <CardDescription>Your scheduled compliance meetings</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">No upcoming meetings</p>
              <Button asChild className="mt-4">
                <Link href="/meetings/new">Schedule Meeting</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingMeetings.map((meeting: Meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div>
                    <h3 className="font-medium text-slate-900">{meeting.title}</h3>
                    <p className="text-sm text-slate-500">
                      {new Date(meeting.startTime).toLocaleString()} ·{" "}
                      {meeting.attendees.length} attendees
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/meetings/${meeting.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
