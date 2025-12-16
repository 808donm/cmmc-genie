"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { KanbanBoard } from "@/components/msp/kanban/kanban-board";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  column: string;
  position: number;
  dueDate: Date | string | null;
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
    controlId: string;
    title: string;
  } | null;
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

interface KanbanBoardClientProps {
  initialTasks: Task[];
  projects: Project[];
  clients: Client[];
  teamMembers: TeamMember[];
  currentProjectId?: string;
  currentClientId?: string;
}

export function KanbanBoardClient({
  initialTasks,
  projects,
  clients,
  teamMembers,
  currentProjectId,
  currentClientId,
}: KanbanBoardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600 mt-1">
            Manage tasks across all projects with drag-and-drop
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {initialTasks.length}
                </div>
                <div className="text-xs text-gray-600">Total Tasks</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard
          initialTasks={initialTasks}
          onTaskClick={(task) => {
            // TODO: Open task detail modal
            console.log("Task clicked:", task);
          }}
          onAddTask={(columnId) => {
            // TODO: Open add task modal
            console.log("Add task to column:", columnId);
          }}
        />
      </div>
    </div>
  );
}
