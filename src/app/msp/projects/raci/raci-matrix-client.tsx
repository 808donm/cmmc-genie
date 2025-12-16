"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  RACIChart,
  RACIPerson,
  RACIActivity,
  RACIAssignment,
  RACIRole,
} from "@/components/raci/raci-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, X, Users, CheckCircle2, AlertCircle } from "lucide-react";

interface MspTask {
  id: string;
  title: string;
  projectId: string;
  project: {
    id: string;
    name: string;
    client: {
      id: string;
      name: string;
    };
  };
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

interface Person {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
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

interface RACIMatrixClientProps {
  tasks: MspTask[];
  people: Person[];
  projects: Project[];
  clients: Client[];
  currentProjectId?: string;
  currentClientId?: string;
}

// Map MSP RACI role to component role format
const mapRole = (role: string): RACIRole => {
  switch (role) {
    case "RESPONSIBLE":
      return "R";
    case "ACCOUNTABLE":
      return "A";
    case "CONSULTED":
      return "C";
    case "INFORMED":
      return "I";
    default:
      return "R";
  }
};

// Map component role format back to MSP RACI role
const unmapRole = (role: RACIRole): string => {
  switch (role) {
    case "R":
      return "RESPONSIBLE";
    case "A":
      return "ACCOUNTABLE";
    case "C":
      return "CONSULTED";
    case "I":
      return "INFORMED";
  }
};

export function RACIMatrixClient({
  tasks,
  people,
  projects,
  clients,
  currentProjectId,
  currentClientId,
}: RACIMatrixClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Transform tasks to activities
  const activities: RACIActivity[] = useMemo(
    () =>
      tasks.map((task) => ({
        id: task.id,
        name: task.title,
        category: `${task.project.client.name} - ${task.project.name}`,
      })),
    [tasks]
  );

  // Transform people to RACIPerson format
  const raciPeople: RACIPerson[] = useMemo(
    () =>
      people.map((person) => ({
        id: person.id,
        name: person.name || person.email || "Unknown",
        image: person.image || undefined,
      })),
    [people]
  );

  // Transform RACI entries to assignments
  const assignments: RACIAssignment[] = useMemo(() => {
    const result: RACIAssignment[] = [];
    tasks.forEach((task) => {
      task.raciEntries.forEach((entry) => {
        result.push({
          activityId: task.id,
          personId: entry.userId,
          role: mapRole(entry.role),
        });
      });
    });
    return result;
  }, [tasks]);

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

  // Handle assignment change
  const handleAssignmentChange = async (
    activityId: string,
    personId: string,
    role: RACIRole | null
  ) => {
    setIsUpdating(true);
    try {
      const task = tasks.find((t) => t.id === activityId);
      if (!task) {
        console.error("Task not found");
        return;
      }

      // Find existing RACI entry
      const existingEntry = task.raciEntries.find(
        (e) => e.userId === personId && mapRole(e.role) === role
      );

      if (role === null) {
        // Delete the assignment - find the entry to delete
        const entryToDelete = task.raciEntries.find(
          (e) => e.userId === personId
        );
        if (entryToDelete) {
          await fetch(`/api/msp/raci/${entryToDelete.id}`, {
            method: "DELETE",
          });
        }
      } else {
        // Create or update assignment
        await fetch("/api/msp/raci", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: task.projectId,
            taskId: activityId,
            userId: personId,
            role: unmapRole(role),
          }),
        });
      }

      // Refresh the page to get updated data
      router.refresh();
    } catch (error) {
      console.error("Error updating RACI assignment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const totalAssignments = assignments.length;
    const tasksWithoutAccountable = tasks.filter(
      (task) =>
        !task.raciEntries.some((entry) => mapRole(entry.role) === "A")
    ).length;
    const tasksWithoutResponsible = tasks.filter(
      (task) =>
        !task.raciEntries.some((entry) => mapRole(entry.role) === "R")
    ).length;

    return {
      totalTasks,
      totalAssignments,
      tasksWithoutAccountable,
      tasksWithoutResponsible,
    };
  }, [tasks, assignments]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">RACI Matrix</h1>
          <p className="text-gray-600 mt-1">
            Assign roles and responsibilities for MSP tasks
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
        <Card className="mb-4">
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Client Filter */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Client
                </label>
                <Select
                  value={currentClientId || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("clientId", value)
                  }
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
                  onValueChange={(value) =>
                    handleFilterChange("projectId", value)
                  }
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
              <div className="flex items-center justify-center bg-blue-50 rounded-lg p-3">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-900">
                      {raciPeople.length}
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">Team Members</div>
                </div>
              </div>

              <div className="flex items-center justify-center bg-green-50 rounded-lg p-3">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <div className="text-2xl font-bold text-green-900">
                      {stats.totalAssignments}
                    </div>
                  </div>
                  <div className="text-xs text-green-600">Assignments</div>
                </div>
              </div>
            </div>

            {/* Validation Summary */}
            {(stats.tasksWithoutAccountable > 0 ||
              stats.tasksWithoutResponsible > 0) && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-semibold text-yellow-900">
                      Validation Issues
                    </div>
                    <ul className="mt-1 space-y-1 text-yellow-700">
                      {stats.tasksWithoutAccountable > 0 && (
                        <li>
                          {stats.tasksWithoutAccountable} task(s) without an
                          Accountable person
                        </li>
                      )}
                      {stats.tasksWithoutResponsible > 0 && (
                        <li>
                          {stats.tasksWithoutResponsible} task(s) without a
                          Responsible person
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info Banner */}
      {tasks.length === 0 ? (
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 text-sm">
              {hasActiveFilters
                ? "Try adjusting your filters or create tasks in the selected project."
                : "Create tasks in your MSP projects to assign RACI roles."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex-1 overflow-hidden">
          <RACIChart
            people={raciPeople}
            activities={activities}
            assignments={assignments}
            onAssignmentChange={handleAssignmentChange}
            editable={!isUpdating}
          />
        </div>
      )}
    </div>
  );
}
