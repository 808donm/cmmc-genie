import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { KanbanBoard } from "@/components/client-portal/kanban-board";
import {
  CheckSquare,
  Filter,
  Search,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  ListTodo,
} from "lucide-react";

export default async function ClientTasksPage() {
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

  // Get all tasks for this client
  const tasks = await prisma.mspTask.findMany({
    where: {
      project: {
        clientId: orgId,
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
      createdAt: "desc",
    },
  });

  type Task = typeof tasks[number];

  // Calculate stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t: Task) => t.status === "TODO").length,
    inProgress: tasks.filter((t: Task) => t.status === "IN_PROGRESS").length,
    underReview: tasks.filter((t: Task) => t.status === "UNDER_REVIEW").length,
    completed: tasks.filter((t: Task) => t.status === "COMPLETED").length,
    blocked: tasks.filter((t: Task) => t.status === "BLOCKED").length,
  };

  const overdueTasks = tasks.filter(
    (t: Task) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "COMPLETED"
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
          <p className="mt-2 text-slate-600">
            Manage and track your compliance tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <ListTodo className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Total</p>
              <p className="text-xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-slate-100 p-2">
              <CheckSquare className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">To Do</p>
              <p className="text-xl font-bold text-slate-900">{stats.todo}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">In Progress</p>
              <p className="text-xl font-bold text-slate-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-2">
              <CheckSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Review</p>
              <p className="text-xl font-bold text-slate-900">{stats.underReview}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Done</p>
              <p className="text-xl font-bold text-slate-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Overdue</p>
              <p className="text-xl font-bold text-slate-900">{overdueTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard tasks={tasks} organizationId={orgId} />
    </div>
  );
}
