"use client";

import { useState } from "react";
import { Calendar, AlertCircle, Flag } from "lucide-react";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  project: {
    id: string;
    name: string;
  };
};

type KanbanBoardProps = {
  tasks: Task[];
  organizationId: string;
};

const columns = [
  { id: "TODO", label: "To Do", color: "bg-slate-100" },
  { id: "IN_PROGRESS", label: "In Progress", color: "bg-blue-100" },
  { id: "UNDER_REVIEW", label: "Under Review", color: "bg-purple-100" },
  { id: "BLOCKED", label: "Blocked", color: "bg-red-100" },
  { id: "COMPLETED", label: "Completed", color: "bg-green-100" },
];

export function KanbanBoard({ tasks, organizationId }: KanbanBoardProps) {
  const [taskList, setTaskList] = useState(tasks);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "border-red-500 bg-red-50 text-red-700";
      case "HIGH":
        return "border-orange-500 bg-orange-50 text-orange-700";
      case "MEDIUM":
        return "border-blue-500 bg-blue-50 text-blue-700";
      default:
        return "border-slate-300 bg-slate-50 text-slate-700";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
      case "HIGH":
        return <Flag className="h-3 w-3" fill="currentColor" />;
      default:
        return <Flag className="h-3 w-3" />;
    }
  };

  const isOverdue = (date: Date | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = taskList.filter((task) => task.status === column.id);

        return (
          <div key={column.id} className="flex-shrink-0 w-80">
            {/* Column Header */}
            <div className={`rounded-t-lg ${column.color} px-4 py-3 border-b-2 border-slate-300`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{column.label}</h3>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-700">
                  {columnTasks.length}
                </span>
              </div>
            </div>

            {/* Column Body */}
            <div className="min-h-[500px] space-y-3 rounded-b-lg border-x-2 border-b-2 border-slate-200 bg-slate-50 p-3">
              {columnTasks.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white">
                  <p className="text-sm text-slate-400">No tasks</p>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const overdue = isOverdue(task.dueDate);

                  return (
                    <div
                      key={task.id}
                      className="group cursor-pointer rounded-lg border-2 border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                    >
                      {/* Priority Badge */}
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {getPriorityIcon(task.priority)}
                          {task.priority}
                        </span>
                      </div>

                      {/* Task Title */}
                      <Link
                        href={`/client-portal/tasks/${task.id}`}
                        className="mb-2 block text-sm font-semibold text-slate-900 group-hover:text-blue-600"
                      >
                        {task.title}
                      </Link>

                      {/* Task Description */}
                      {task.description && (
                        <p className="mb-3 line-clamp-2 text-xs text-slate-600">
                          {task.description}
                        </p>
                      )}

                      {/* Project */}
                      <div className="mb-3 text-xs text-slate-500">
                        <span className="font-medium">Project:</span> {task.project.name}
                      </div>

                      {/* Due Date */}
                      {task.dueDate && (
                        <div
                          className={`flex items-center gap-1 text-xs ${
                            overdue
                              ? "font-medium text-red-600"
                              : "text-slate-500"
                          }`}
                        >
                          {overdue ? (
                            <AlertCircle className="h-3 w-3" />
                          ) : (
                            <Calendar className="h-3 w-3" />
                          )}
                          {overdue ? "Overdue: " : "Due: "}
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
