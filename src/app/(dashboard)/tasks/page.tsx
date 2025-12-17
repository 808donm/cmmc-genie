import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus } from "lucide-react";

export default async function TasksPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Get user's organization
  const orgMembership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  // Get tasks assigned to the user
  const tasks = orgMembership
    ? await prisma.task.findMany({
        where: {
          project: {
            organizationId: orgMembership.organizationId,
          },
        },
        include: {
          project: true,
          assignments: {
            where: { userId: session.user.id },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  type Task = typeof tasks[number];

  const tasksByStatus = {
    BACKLOG: tasks.filter((t: Task) => t.status === "BACKLOG"),
    TODO: tasks.filter((t: Task) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t: Task) => t.status === "IN_PROGRESS"),
    IN_REVIEW: tasks.filter((t: Task) => t.status === "IN_REVIEW"),
    DONE: tasks.filter((t: Task) => t.status === "DONE"),
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
          <p className="mt-2 text-slate-600">
            Manage your CMMC compliance tasks with a Kanban board
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Kanban Board */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckSquare className="h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No tasks yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              Create your first task to get started with CMMC compliance tracking
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-5">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
            <Card key={status}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {status.replace("_", " ")}
                </CardTitle>
                <CardDescription>{statusTasks.length} tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {statusTasks.map((task: Task) => (
                  <div
                    key={task.id}
                    className="rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm"
                  >
                    <h4 className="font-medium text-slate-900">{task.title}</h4>
                    <p className="mt-1 text-xs text-slate-600">{task.project.name}</p>
                    {task.priority && (
                      <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-1 text-xs">
                        {task.priority}
                      </span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
