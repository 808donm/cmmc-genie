"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { GanttChart, GanttTask } from "@/components/gantt/gantt-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MspTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  startDate: Date | string | null;
  dueDate: Date | string | null;
  completedAt: Date | string | null;
  assignee: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  project: {
    id: string;
    name: string;
    client: {
      id: string;
      name: string;
    };
  };
  dependencies: {
    dependsOn: {
      id: string;
      title: string;
    };
  }[];
}

interface MspMilestone {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | string;
  status: string;
  project: {
    id: string;
    name: string;
    client: {
      id: string;
      name: string;
    };
  };
}

interface Project {
  id: string;
  name: string;
  client: {
    id: string;
    name: string;
  };
}

interface Client {
  id: string;
  name: string;
}

interface GanttChartClientProps {
  tasks: MspTask[];
  milestones: MspMilestone[];
  projects: Project[];
  clients: Client[];
  currentProjectId?: string;
  currentClientId?: string;
}

// Map MSP task status to GANTT status
const mapTaskStatus = (status: string): "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED" => {
  switch (status) {
    case "TODO":
      return "NOT_STARTED";
    case "IN_PROGRESS":
    case "UNDER_REVIEW":
      return "IN_PROGRESS";
    case "COMPLETED":
      return "COMPLETED";
    case "BLOCKED":
      return "BLOCKED";
    default:
      return "NOT_STARTED";
  }
};

// Calculate progress based on status
const calculateProgress = (status: string, completedAt: Date | string | null): number => {
  if (status === "COMPLETED") return 100;
  if (status === "UNDER_REVIEW") return 90;
  if (status === "IN_PROGRESS") return 50;
  if (status === "BLOCKED") return 25;
  return 0;
};

export function GanttChartClient({
  tasks,
  milestones,
  projects,
  clients,
  currentProjectId,
  currentClientId,
}: GanttChartClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Transform MSP tasks to GANTT tasks
  const ganttTasks = useMemo((): GanttTask[] => {
    const transformedTasks: GanttTask[] = [];

    // Transform regular tasks
    for (const task of tasks) {
      // Skip tasks without start and due dates
      if (!task.startDate || !task.dueDate) continue;

      const startDate = new Date(task.startDate);
      const endDate = new Date(task.dueDate);

      // Skip invalid date ranges
      if (endDate < startDate) continue;

      transformedTasks.push({
        id: task.id,
        name: task.title,
        startDate,
        endDate,
        progress: calculateProgress(task.status, task.completedAt),
        dependencies: task.dependencies.map((dep) => dep.dependsOn.id),
        assignee: task.assignee
          ? {
              name: task.assignee.name || task.assignee.email || "Unknown",
              image: task.assignee.image || undefined,
            }
          : undefined,
        category: `${task.project.client.name} - ${task.project.name}`,
        status: mapTaskStatus(task.status),
      });
    }

    // Transform milestones to tasks (shown as point-in-time events)
    for (const milestone of milestones) {
      const dueDate = new Date(milestone.dueDate);
      const startDate = new Date(dueDate);
      startDate.setDate(startDate.getDate() - 1); // Milestones span 1 day for visibility

      transformedTasks.push({
        id: `milestone-${milestone.id}`,
        name: `📍 ${milestone.title}`,
        startDate,
        endDate: dueDate,
        progress: milestone.status === "COMPLETED" ? 100 : 0,
        category: `${milestone.project.client.name} - ${milestone.project.name}`,
        status: milestone.status === "COMPLETED" ? "COMPLETED" : "NOT_STARTED",
      });
    }

    // Sort by start date
    return transformedTasks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [tasks, milestones]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = currentProjectId || currentClientId;

  // Statistics
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const blockedTasks = tasks.filter((t) => t.status === "BLOCKED").length;

    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      blocked: blockedTasks,
    };
  }, [tasks]);

  const handleTaskClick = (task: GanttTask) => {
    // Skip milestones
    if (task.id.startsWith("milestone-")) {
      console.log("Milestone clicked:", task);
      return;
    }

    // TODO: Open task detail modal
    console.log("Task clicked:", task);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GANTT Chart</h1>
          <p className="text-gray-600 mt-1">
            Visualize project timelines and dependencies
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {[currentProjectId, currentClientId].filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Filters</h3>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Client Filter */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Client
              </label>
              <Select
                value={currentClientId || "all"}
                onValueChange={(value) => handleFilterChange("clientId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All clients</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Filter */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Project
              </label>
              <Select
                value={currentProjectId || "all"}
                onValueChange={(value) => handleFilterChange("projectId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.client.name} - {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-600">Total Tasks</div>
              </div>
            </div>

            <div className="flex items-center justify-center bg-green-50 rounded-lg p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {stats.completed}
                </div>
                <div className="text-xs text-green-600">Completed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      {ganttTasks.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Calendar className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No tasks with dates
          </h3>
          <p className="text-gray-600 text-sm">
            Tasks need both start dates and due dates to appear on the GANTT chart.
            Add dates to your tasks to visualize timelines.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <span>
              <strong>{stats.inProgress}</strong> in progress
            </span>
            <span>•</span>
            <span>
              <strong>{stats.blocked}</strong> blocked
            </span>
            <span>•</span>
            <span>
              <strong>{milestones.length}</strong> milestones
            </span>
          </div>

          {/* GANTT Chart */}
          <div className="flex-1 overflow-hidden">
            <GanttChart
              tasks={ganttTasks}
              onTaskClick={handleTaskClick}
              viewMode="week"
            />
          </div>
        </>
      )}
    </div>
  );
}
