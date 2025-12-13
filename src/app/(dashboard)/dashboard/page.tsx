import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const organizationId = session?.user.activeOrganization;

  // Fetch dashboard data
  const [projects, tasks, upcomingMeetings] = await Promise.all([
    prisma.project.findMany({
      where: { organizationId: organizationId || "" },
      include: {
        roadmap: {
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
        project: { organizationId: organizationId || "" },
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
        organizationId: organizationId || "",
        scheduledAt: { gte: new Date() },
      },
      include: {
        attendees: {
          include: {
            user: true,
          },
        },
      },
      take: 5,
      orderBy: { scheduledAt: "asc" },
    }),
  ]);

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = await prisma.task.count({
    where: {
      project: { organizationId: organizationId || "" },
      status: "DONE",
    },
  });
  const overdueTasks = tasks.filter((task) => task.dueDate && task.dueDate < new Date()).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Welcome back, {session?.user.name}! Here's your CMMC compliance overview.
        </p>
      </div>

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
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                  >
                    <div>
                      <h3 className="font-medium text-slate-900">{project.name}</h3>
                      <p className="text-sm text-slate-500">
                        {project._count.tasks} tasks · Target: Level {project.targetLevel}
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
                {tasks.slice(0, 5).map((task) => (
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
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div>
                    <h3 className="font-medium text-slate-900">{meeting.title}</h3>
                    <p className="text-sm text-slate-500">
                      {new Date(meeting.scheduledAt).toLocaleString()} ·{" "}
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

// Add missing icon import
import { FolderKanban, MessageSquare } from "lucide-react";
