import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  FolderKanban,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  Calendar,
  FileText,
  Users,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default async function ClientDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get client organization
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organization: {
        type: "CLIENT",
      },
    },
    include: {
      organization: true,
    },
  });

  if (!membership) {
    redirect("/dashboard");
  }

  const orgId = membership.organizationId;

  // Get projects for this client organization
  const projects = await prisma.mspProject.findMany({
    where: {
      clientId: orgId,
    },
    include: {
      _count: {
        select: {
          tasks: true,
          milestones: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Get tasks assigned to user or organization
  const myTasks = await prisma.mspTask.findMany({
    where: {
      project: {
        clientId: orgId,
      },
      status: {
        not: "COMPLETED",
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
    take: 10,
  });

  // Get recent activity/messages
  const recentMessages = await prisma.gHLCommunication.findMany({
    where: {
      organizationId: orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  // Calculate compliance stats (if regular projects exist)
  const complianceProjects = await prisma.project.findMany({
    where: {
      organizationId: orgId,
    },
    include: {
      controls: {
        select: {
          status: true,
        },
      },
    },
  });

  const allControls = complianceProjects.flatMap((p) => p.controls);
  const controlStats = {
    total: allControls.length,
    implemented: allControls.filter((c) => c.status === "IMPLEMENTED" || c.status === "COMPLIANT").length,
    inProgress: allControls.filter((c) => c.status === "IN_PROGRESS").length,
    notStarted: allControls.filter((c) => c.status === "NOT_STARTED").length,
  };

  const compliancePercentage = controlStats.total > 0
    ? Math.round((controlStats.implemented / controlStats.total) * 100)
    : 0;

  // Project stats
  const projectStats = {
    total: projects.length,
    active: projects.filter((p) => p.status === "ACTIVE").length,
    atRisk: projects.filter((p) => p.status === "AT_RISK").length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
  };

  // Task stats
  const taskStats = {
    total: myTasks.length,
    todo: myTasks.filter((t) => t.status === "TODO").length,
    inProgress: myTasks.filter((t) => t.status === "IN_PROGRESS").length,
    underReview: myTasks.filter((t) => t.status === "UNDER_REVIEW").length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {session.user.name || "there"}!
        </h1>
        <p className="mt-2 text-slate-600">
          Here's an overview of your CMMC compliance progress
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* Compliance Progress */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Compliance</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {compliancePercentage}%
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {controlStats.implemented} of {controlStats.total} controls
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Projects</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projectStats.active}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {projectStats.total} total projects
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <FolderKanban className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending Tasks</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {taskStats.total}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {taskStats.inProgress} in progress
              </p>
            </div>
            <div className="rounded-full bg-amber-100 p-3">
              <CheckSquare className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        {/* At Risk Items */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">At Risk</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projectStats.atRisk}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Requires attention
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Projects - 2 columns */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Active Projects
                </h2>
                <Link
                  href="/client-portal/projects"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View All <ArrowRight className="inline h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-slate-200">
              {projects.slice(0, 5).map((project) => {
                const isOverdue = project.targetDate && new Date(project.targetDate) < new Date();

                return (
                  <div key={project.id} className="p-6 hover:bg-slate-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/client-portal/projects/${project.id}`}
                          className="text-base font-medium text-slate-900 hover:text-blue-600"
                        >
                          {project.name}
                        </Link>
                        {project.description && (
                          <p className="mt-1 text-sm text-slate-600 line-clamp-1">
                            {project.description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <CheckSquare className="h-3 w-3" />
                            {project._count.tasks} tasks
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {project._count.milestones} milestones
                          </span>
                          {project.targetDate && (
                            <span className={`flex items-center gap-1 ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                              <Calendar className="h-3 w-3" />
                              Due {new Date(project.targetDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            project.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : project.status === "AT_RISK"
                              ? "bg-red-100 text-red-700"
                              : project.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {project.status}
                        </span>
                        {/* Progress */}
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Progress</p>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="h-2 w-24 rounded-full bg-slate-200">
                              <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-900">
                              {project.progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {projects.length === 0 && (
                <div className="p-12 text-center">
                  <FolderKanban className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-4 text-sm font-medium text-slate-900">
                    No projects yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Your MSP will create projects for you
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* My Tasks */}
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900">My Tasks</h3>
            </div>
            <div className="divide-y divide-slate-200">
              {myTasks.slice(0, 5).map((task) => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

                return (
                  <div key={task.id} className="p-4 hover:bg-slate-50">
                    <Link
                      href={`/client-portal/tasks/${task.id}`}
                      className="text-sm font-medium text-slate-900 hover:text-blue-600"
                    >
                      {task.title}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {task.project.name}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
                          task.status === "TODO"
                            ? "bg-slate-100 text-slate-700"
                            : task.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-700"
                            : task.status === "UNDER_REVIEW"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                      {task.dueDate && (
                        <span className={`text-xs ${isOverdue ? "text-red-600 font-medium" : "text-slate-500"}`}>
                          {isOverdue ? "Overdue" : `Due ${new Date(task.dueDate).toLocaleDateString()}`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {myTasks.length === 0 && (
                <div className="p-8 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                  <p className="mt-2 text-sm text-slate-600">
                    All caught up!
                  </p>
                </div>
              )}
            </div>
            {myTasks.length > 0 && (
              <div className="border-t border-slate-200 p-4">
                <Link
                  href="/client-portal/tasks"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View All Tasks <ArrowRight className="inline h-4 w-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Compliance Status */}
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              Control Status
            </h3>
            {controlStats.total > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Implemented</span>
                  <span className="text-sm font-medium text-green-600">
                    {controlStats.implemented}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">In Progress</span>
                  <span className="text-sm font-medium text-blue-600">
                    {controlStats.inProgress}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Not Started</span>
                  <span className="text-sm font-medium text-slate-600">
                    {controlStats.notStarted}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <Link
                    href="/client-portal/compliance"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Details <ArrowRight className="inline h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No compliance controls yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
