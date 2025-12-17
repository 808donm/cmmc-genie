"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  X,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  Circle,
  ArrowUpDown,
  Trash2,
  UserPlus,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MspTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  column: string;
  position: number;
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
  control: {
    id: string;
    domain: string;
    practice: string;
  } | null;
  raciEntries: {
    id: string;
    userId: string;
    role: string;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  }[];
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

interface TeamMember {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Filters {
  projectId?: string;
  clientId?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  search?: string;
}

interface MspTasksClientProps {
  tasks: MspTask[];
  projects: Project[];
  clients: Client[];
  teamMembers: TeamMember[];
  filters: Filters;
}

const statusConfig = {
  TODO: { label: "To Do", icon: Circle, color: "text-gray-500", bg: "bg-gray-100" },
  IN_PROGRESS: { label: "In Progress", icon: Clock, color: "text-blue-500", bg: "bg-blue-100" },
  UNDER_REVIEW: { label: "Under Review", icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-100" },
  BLOCKED: { label: "Blocked", icon: Ban, color: "text-red-500", bg: "bg-red-100" },
  COMPLETED: { label: "Completed", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-100" },
  CANCELLED: { label: "Cancelled", icon: X, color: "text-gray-400", bg: "bg-gray-100" },
};

const priorityConfig = {
  LOW: { label: "Low", color: "text-gray-600", bg: "bg-gray-100" },
  MEDIUM: { label: "Medium", color: "text-blue-600", bg: "bg-blue-100" },
  HIGH: { label: "High", color: "text-orange-600", bg: "bg-orange-100" },
  CRITICAL: { label: "Critical", color: "text-red-600", bg: "bg-red-100" },
};

export function MspTasksClient({
  tasks,
  projects,
  clients,
  teamMembers,
  filters,
}: MspTasksClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();

    // Preserve existing filters
    Object.entries(filters).forEach(([k, v]) => {
      if (v && k !== key) params.set(k, v);
    });

    // Add or remove the new filter
    if (value && value !== "all") {
      params.set(key, value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
    setSearchInput("");
  };

  const handleSearch = (value: string) => {
    setSearchInput(value);
    if (value.length >= 2 || value.length === 0) {
      updateFilter("search", value);
    }
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined);

  const toggleTaskSelection = (taskId: string) => {
    const newSelection = new Set(selectedTasks);
    if (newSelection.has(taskId)) {
      newSelection.delete(taskId);
    } else {
      newSelection.add(taskId);
    }
    setSelectedTasks(newSelection);
  };

  const selectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map((t) => t.id)));
    }
  };

  const handleBulkAction = async (action: string, value?: string) => {
    if (selectedTasks.size === 0) return;

    const taskIds = Array.from(selectedTasks);

    try {
      // Bulk update tasks
      for (const taskId of taskIds) {
        const updateData: any = {};

        if (action === "status" && value) updateData.status = value;
        if (action === "priority" && value) updateData.priority = value;
        if (action === "assignee" && value) updateData.assigneeId = value;

        await fetch(`/api/msp/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
      }

      // Refresh the page
      router.refresh();
      setSelectedTasks(new Set());
    } catch (error) {
      console.error("Bulk action failed:", error);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedTasks.size === 0 || !confirm(`Delete ${selectedTasks.size} task(s)?`)) return;

    try {
      for (const taskId of Array.from(selectedTasks)) {
        await fetch(`/api/msp/tasks/${taskId}`, {
          method: "DELETE",
        });
      }
      router.refresh();
      setSelectedTasks(new Set());
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const isOverdue = (task: MspTask) => {
    if (!task.dueDate || task.status === "COMPLETED" || task.status === "CANCELLED") {
      return false;
    }
    return new Date(task.dueDate) < new Date();
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "TODO").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    const overdue = tasks.filter((t) => isOverdue(t)).length;
    const blocked = tasks.filter((t) => t.status === "BLOCKED").length;

    return { total, todo, inProgress, completed, overdue, blocked };
  }, [tasks]);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage tasks across all MSP projects and clients
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
              {Object.values(filters).filter(Boolean).length}
            </span>
          )}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-600">{stats.todo}</div>
            <div className="text-xs text-gray-600">To Do</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-xs text-blue-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-green-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-xs text-red-600">Overdue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">{stats.blocked}</div>
            <div className="text-xs text-red-500">Blocked</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
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

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={searchInput}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Client */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Client
                </label>
                <Select
                  value={filters.clientId || "all"}
                  onValueChange={(value) => updateFilter("clientId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
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

              {/* Project */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Project
                </label>
                <Select
                  value={filters.projectId || "all"}
                  onValueChange={(value) => updateFilter("projectId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
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

              {/* Status */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Status
                </label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => updateFilter("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Priority
                </label>
                <Select
                  value={filters.priority || "all"}
                  onValueChange={(value) => updateFilter("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions Bar */}
      {selectedTasks.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedTasks.size} task(s) selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTasks(new Set())}
                >
                  Clear selection
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Flag className="w-4 h-4 mr-2" />
                      Set Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <DropdownMenuItem
                        key={key}
                        onClick={() => handleBulkAction("status", key)}
                      >
                        {config.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign To
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {teamMembers.map((member) => (
                      <DropdownMenuItem
                        key={member.id}
                        onClick={() => handleBulkAction("assignee", member.id)}
                      >
                        {member.name || member.email}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task List */}
      <Card>
        <CardContent className="p-0">
          {tasks.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-600 text-sm">
                {hasActiveFilters
                  ? "Try adjusting your filters."
                  : "Create tasks in your MSP projects to see them here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={selectedTasks.size === tasks.length && tasks.length > 0}
                        onCheckedChange={selectAll}
                      />
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Task
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Project / Client
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Priority
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Assignee
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">
                      Due Date
                    </th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => {
                    const StatusIcon = statusConfig[task.status as keyof typeof statusConfig]?.icon || Circle;
                    const overdue = isOverdue(task);

                    return (
                      <tr
                        key={task.id}
                        className={cn(
                          "border-b border-gray-100 hover:bg-gray-50 transition-colors",
                          selectedTasks.has(task.id) && "bg-blue-50"
                        )}
                      >
                        <td className="p-4">
                          <Checkbox
                            checked={selectedTasks.has(task.id)}
                            onCheckedChange={() => toggleTaskSelection(task.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-gray-900">{task.title}</div>
                            {task.description && (
                              <div className="text-sm text-gray-500 truncate max-w-md mt-1">
                                {task.description}
                              </div>
                            )}
                            {task.control && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {task.control.id}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {task.project.name}
                            </div>
                            <div className="text-gray-500">
                              {task.project.client.name}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              "flex items-center gap-1 w-fit",
                              statusConfig[task.status as keyof typeof statusConfig]?.bg,
                              statusConfig[task.status as keyof typeof statusConfig]?.color
                            )}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[task.status as keyof typeof statusConfig]?.label}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              "w-fit",
                              priorityConfig[task.priority as keyof typeof priorityConfig]?.bg,
                              priorityConfig[task.priority as keyof typeof priorityConfig]?.color
                            )}
                          >
                            {priorityConfig[task.priority as keyof typeof priorityConfig]?.label}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {task.assignee ? (
                            <div className="flex items-center gap-2">
                              {task.assignee.image ? (
                                <img
                                  src={task.assignee.image}
                                  alt={task.assignee.name || ""}
                                  className="w-6 h-6 rounded-full"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                                  {(task.assignee.name || task.assignee.email || "?")
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}
                              <span className="text-sm text-gray-700">
                                {task.assignee.name || task.assignee.email}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Unassigned</span>
                          )}
                        </td>
                        <td className="p-4">
                          {task.dueDate ? (
                            <span
                              className={cn(
                                "text-sm",
                                overdue ? "text-red-600 font-medium" : "text-gray-700"
                              )}
                            >
                              {new Date(task.dueDate).toLocaleDateString()}
                              {overdue && " (Overdue)"}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">No due date</span>
                          )}
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Task</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
