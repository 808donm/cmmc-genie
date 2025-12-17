import { auth } from "@/lib/auth/auth";
import { getMspOrganization } from "@/lib/msp/utils";
import { prisma } from "@/lib/db";
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  KanbanSquare,
  GanttChart,
  Network,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MspProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) {
    return <div>No MSP organization found</div>;
  }

  // Get all projects for this MSP
  const projects = await prisma.mspProject.findMany({
    where: {
      mspOrganizationId: mspOrg.id,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          industry: true,
        },
      },
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

  type Project = typeof projects[number];

  // Calculate stats
  const stats = {
    total: projects.length,
    active: projects.filter((p: Project) => p.status === "ACTIVE").length,
    atRisk: projects.filter((p: Project) => p.status === "AT_RISK").length,
    completed: projects.filter((p: Project) => p.status === "COMPLETED").length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Project Management</h1>
          <p className="mt-2 text-slate-600">
            Manage compliance projects across all clients
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/msp/projects/kanban"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <KanbanSquare className="h-4 w-4" />
            Kanban
          </Link>
          <Link
            href="/msp/projects/gantt"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <GanttChart className="h-4 w-4" />
            GANTT
          </Link>
          <Link
            href="/msp/projects/raci"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Network className="h-4 w-4" />
            RACI
          </Link>
          <Link
            href="/msp/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <FolderKanban className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Total Projects</p>
              <p className="text-xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Active</p>
              <p className="text-xl font-bold text-slate-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">At Risk</p>
              <p className="text-xl font-bold text-slate-900">{stats.atRisk}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Completed</p>
              <p className="text-xl font-bold text-slate-900">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-12 text-center">
            <FolderKanban className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-900">
              No projects yet
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Get started by creating your first compliance project
            </p>
            <Link
              href="/msp/projects/new"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project) => {
              const getStatusColor = (status: string) => {
                switch (status) {
                  case "ACTIVE":
                    return "bg-green-100 text-green-700";
                  case "AT_RISK":
                    return "bg-red-100 text-red-700";
                  case "ON_HOLD":
                    return "bg-amber-100 text-amber-700";
                  case "COMPLETED":
                    return "bg-emerald-100 text-emerald-700";
                  case "CANCELLED":
                    return "bg-slate-100 text-slate-700";
                  default:
                    return "bg-blue-100 text-blue-700";
                }
              };

              const getPriorityColor = (priority: string) => {
                switch (priority) {
                  case "CRITICAL":
                    return "text-red-600";
                  case "HIGH":
                    return "text-orange-600";
                  case "MEDIUM":
                    return "text-blue-600";
                  default:
                    return "text-slate-600";
                }
              };

              const isOverdue =
                project.targetDate && new Date(project.targetDate) < new Date();

              return (
                <div
                  key={project.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Link
                        href={`/msp/projects/${project.id}`}
                        className="text-lg font-semibold text-slate-900 hover:text-blue-600"
                      >
                        {project.name}
                      </Link>
                      <Link
                        href={`/msp/clients/${project.client.id}`}
                        className="block mt-1 text-sm text-slate-600 hover:text-blue-600"
                      >
                        {project.client.name}
                      </Link>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                      {project.description}
                    </p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-medium text-slate-900">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className={`h-2 rounded-full ${
                          project.progress >= 80
                            ? "bg-green-600"
                            : project.progress >= 50
                            ? "bg-blue-600"
                            : project.progress >= 25
                            ? "bg-amber-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Priority</span>
                      <span
                        className={`font-medium ${getPriorityColor(
                          project.priority
                        )}`}
                      >
                        {project.priority}
                      </span>
                    </div>

                    {project.targetDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Target Date
                        </span>
                        <span
                          className={`font-medium ${
                            isOverdue ? "text-red-600" : "text-slate-900"
                          }`}
                        >
                          {new Date(project.targetDate).toLocaleDateString()}
                          {isOverdue && " (Overdue)"}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {project._count.tasks} tasks
                      </span>
                      <span className="text-slate-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {project._count.milestones} milestones
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <Link
                      href={`/msp/projects/${project.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
