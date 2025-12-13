"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

export interface GanttTask {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number; // 0-100
  dependencies?: string[]; // Task IDs
  assignee?: {
    name: string;
    image?: string;
  };
  category?: string;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED";
}

interface GanttChartProps {
  tasks: GanttTask[];
  onTaskClick?: (task: GanttTask) => void;
  viewMode?: "day" | "week" | "month";
}

type ViewMode = "day" | "week" | "month";

const statusColors = {
  NOT_STARTED: "bg-slate-200",
  IN_PROGRESS: "bg-blue-500",
  COMPLETED: "bg-green-500",
  BLOCKED: "bg-red-500",
};

export function GanttChart({ tasks, onTaskClick, viewMode: initialViewMode = "week" }: GanttChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate date range
  const { startDate, endDate, columns } = useMemo(() => {
    if (tasks.length === 0) {
      const today = new Date();
      return {
        startDate: today,
        endDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        columns: 30,
      };
    }

    const allDates = tasks.flatMap((t) => [t.startDate, t.endDate]);
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())));

    // Add padding
    const padding = viewMode === "month" ? 30 : viewMode === "week" ? 14 : 7;
    minDate.setDate(minDate.getDate() - padding);
    maxDate.setDate(maxDate.getDate() + padding);

    // Calculate columns based on view mode
    const timeDiff = maxDate.getTime() - minDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const columns =
      viewMode === "month"
        ? Math.ceil(daysDiff / 30)
        : viewMode === "week"
        ? Math.ceil(daysDiff / 7)
        : daysDiff;

    return { startDate: minDate, endDate: maxDate, columns };
  }, [tasks, viewMode]);

  // Generate time columns
  const timeColumns = useMemo(() => {
    const cols = [];
    const current = new Date(startDate);

    for (let i = 0; i < columns; i++) {
      cols.push(new Date(current));
      if (viewMode === "month") {
        current.setMonth(current.getMonth() + 1);
      } else if (viewMode === "week") {
        current.setDate(current.getDate() + 7);
      } else {
        current.setDate(current.getDate() + 1);
      }
    }

    return cols;
  }, [startDate, columns, viewMode]);

  // Calculate task position and width
  const getTaskStyle = (task: GanttTask) => {
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const taskStart = (task.startDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const taskDuration = (task.endDate.getTime() - task.startDate.getTime()) / (1000 * 60 * 60 * 24);

    const left = (taskStart / totalDays) * 100;
    const width = (taskDuration / totalDays) * 100;

    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.min(100 - left, width)}%`,
    };
  };

  // Format column header based on view mode
  const formatColumnHeader = (date: Date) => {
    if (viewMode === "month") {
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } else if (viewMode === "week") {
      return `Week ${Math.ceil(date.getDate() / 7)}`;
    } else {
      return date.getDate().toString();
    }
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Navigate timeline
  const navigate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("day")}
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Month
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gantt Chart */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Header */}
              <div className="flex border-b border-slate-200 bg-slate-50">
                <div className="sticky left-0 z-20 w-64 flex-shrink-0 border-r border-slate-200 bg-slate-50 p-4 font-semibold">
                  Task Name
                </div>
                <div className="flex flex-1">
                  {timeColumns.map((date, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex-1 border-r border-slate-200 p-2 text-center text-sm",
                        isToday(date) && "bg-blue-50 font-semibold text-blue-600"
                      )}
                      style={{ minWidth: viewMode === "day" ? "60px" : "100px" }}
                    >
                      {formatColumnHeader(date)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks */}
              <div className="relative">
                {tasks.map((task, taskIndex) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex border-b border-slate-200",
                      taskIndex % 2 === 0 ? "bg-white" : "bg-slate-50"
                    )}
                  >
                    {/* Task name column */}
                    <div className="sticky left-0 z-10 w-64 flex-shrink-0 border-r border-slate-200 bg-inherit p-4">
                      <div className="flex items-center gap-2">
                        {task.assignee?.image ? (
                          <img
                            src={task.assignee.image}
                            alt={task.assignee.name}
                            className="h-6 w-6 rounded-full"
                          />
                        ) : task.assignee ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-medium">
                            {task.assignee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        ) : null}
                        <div>
                          <div className="text-sm font-medium">{task.name}</div>
                          {task.category && (
                            <div className="text-xs text-muted-foreground">{task.category}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timeline column */}
                    <div className="relative flex-1" style={{ minHeight: "60px" }}>
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex">
                        {timeColumns.map((date, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex-1 border-r border-slate-100",
                              isToday(date) && "bg-blue-50/50"
                            )}
                            style={{ minWidth: viewMode === "day" ? "60px" : "100px" }}
                          />
                        ))}
                      </div>

                      {/* Task bar */}
                      <div className="absolute inset-y-0 left-0 right-0 flex items-center px-1">
                        <button
                          onClick={() => onTaskClick?.(task)}
                          className="relative h-8 rounded transition-all hover:opacity-90"
                          style={getTaskStyle(task)}
                        >
                          <div
                            className={cn(
                              "h-full rounded",
                              task.status ? statusColors[task.status] : "bg-blue-500"
                            )}
                          >
                            {/* Progress bar */}
                            <div
                              className="h-full rounded bg-black/20"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <div className="absolute inset-0 flex items-center px-2">
                            <span className="truncate text-xs font-medium text-white">
                              {task.name}
                            </span>
                          </div>
                        </button>
                      </div>

                      {/* Dependencies (simplified lines) */}
                      {task.dependencies?.map((depId) => {
                        const depTask = tasks.find((t) => t.id === depId);
                        if (!depTask) return null;

                        const depIndex = tasks.findIndex((t) => t.id === depId);
                        if (depIndex < taskIndex) {
                          // Draw line from dependency to this task
                          return (
                            <svg
                              key={depId}
                              className="pointer-events-none absolute inset-0"
                              style={{ overflow: "visible" }}
                            >
                              <line
                                x1="0"
                                y1="-30"
                                x2="0"
                                y2="30"
                                stroke="#94a3b8"
                                strokeWidth="2"
                                strokeDasharray="4"
                              />
                            </svg>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Today marker */}
              <div className="pointer-events-none absolute inset-0">
                <div className="relative h-full">
                  {timeColumns.map((date, index) => {
                    if (isToday(date)) {
                      return (
                        <div
                          key={index}
                          className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                          style={{
                            left: `calc(${(index / timeColumns.length) * 100}% + 256px)`,
                          }}
                        >
                          <div className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-red-500" />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-2">
                <div className={cn("h-4 w-4 rounded", color)} />
                <span className="text-sm capitalize">{status.replace("_", " ").toLowerCase()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
