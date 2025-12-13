"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Download } from "lucide-react";

export type RACIRole = "R" | "A" | "C" | "I";

export interface RACIAssignment {
  activityId: string;
  personId: string;
  role: RACIRole;
}

export interface RACIPerson {
  id: string;
  name: string;
  title?: string;
  image?: string;
}

export interface RACIActivity {
  id: string;
  name: string;
  category?: string;
}

interface RACIChartProps {
  people: RACIPerson[];
  activities: RACIActivity[];
  assignments: RACIAssignment[];
  onAssignmentChange?: (activityId: string, personId: string, role: RACIRole | null) => void;
  onAddPerson?: () => void;
  onAddActivity?: () => void;
  editable?: boolean;
}

const roleColors = {
  R: "bg-blue-500 text-white hover:bg-blue-600",
  A: "bg-green-500 text-white hover:bg-green-600",
  C: "bg-yellow-500 text-white hover:bg-yellow-600",
  I: "bg-purple-500 text-white hover:bg-purple-600",
};

const roleDescriptions = {
  R: "Responsible - Does the work",
  A: "Accountable - Ultimately answerable",
  C: "Consulted - Provides input",
  I: "Informed - Kept updated",
};

export function RACIChart({
  people,
  activities,
  assignments,
  onAssignmentChange,
  onAddPerson,
  onAddActivity,
  editable = false,
}: RACIChartProps) {
  const [hoveredRole, setHoveredRole] = useState<RACIRole | null>(null);

  const getAssignment = (activityId: string, personId: string): RACIRole | null => {
    const assignment = assignments.find(
      (a) => a.activityId === activityId && a.personId === personId
    );
    return assignment?.role || null;
  };

  const handleCellClick = (activityId: string, personId: string, currentRole: RACIRole | null) => {
    if (!editable || !onAssignmentChange) return;

    // Cycle through roles: null -> R -> A -> C -> I -> null
    const roles: (RACIRole | null)[] = [null, "R", "A", "C", "I"];
    const currentIndex = roles.indexOf(currentRole);
    const nextRole = roles[(currentIndex + 1) % roles.length];

    onAssignmentChange(activityId, personId, nextRole);
  };

  const exportToCSV = () => {
    const headers = ["Activity", ...people.map((p) => p.name)];
    const rows = activities.map((activity) => [
      activity.name,
      ...people.map((person) => getAssignment(activity.id, person.id) || ""),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "raci-chart.csv";
    a.click();
  };

  // Group activities by category
  const categorizedActivities = activities.reduce((acc, activity) => {
    const category = activity.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(activity);
    return acc;
  }, {} as Record<string, RACIActivity[]>);

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">RACI Chart</h2>
          <p className="text-sm text-muted-foreground">
            Responsibility Assignment Matrix
          </p>
        </div>
        <div className="flex gap-2">
          {editable && onAddPerson && (
            <Button onClick={onAddPerson} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Person
            </Button>
          )}
          {editable && onAddActivity && (
            <Button onClick={onAddActivity} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          )}
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {(Object.entries(roleDescriptions) as [RACIRole, string][]).map(([role, description]) => (
              <div
                key={role}
                className="flex items-center gap-2"
                onMouseEnter={() => setHoveredRole(role)}
                onMouseLeave={() => setHoveredRole(null)}
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded font-semibold", roleColors[role])}>
                  {role}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{description.split(" - ")[0]}</div>
                  <div className="text-xs text-muted-foreground">{description.split(" - ")[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RACI Matrix */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="sticky left-0 z-10 bg-slate-50 p-4 text-left font-semibold">
                    Activity
                  </th>
                  {people.map((person) => (
                    <th key={person.id} className="min-w-[120px] p-4 text-center">
                      <div className="flex flex-col items-center gap-2">
                        {person.image ? (
                          <img
                            src={person.image}
                            alt={person.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-medium">
                            {person.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        )}
                        <div className="text-sm font-medium">{person.name}</div>
                        {person.title && (
                          <div className="text-xs text-muted-foreground">{person.title}</div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorizedActivities).map(([category, categoryActivities]) => (
                  <>
                    <tr key={`category-${category}`} className="border-b border-slate-200 bg-slate-100">
                      <td colSpan={people.length + 1} className="p-2 text-sm font-semibold">
                        {category}
                      </td>
                    </tr>
                    {categoryActivities.map((activity) => (
                      <tr key={activity.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="sticky left-0 z-10 bg-white p-4 font-medium hover:bg-slate-50">
                          {activity.name}
                        </td>
                        {people.map((person) => {
                          const role = getAssignment(activity.id, person.id);
                          return (
                            <td key={person.id} className="p-4 text-center">
                              <button
                                onClick={() => handleCellClick(activity.id, person.id, role)}
                                disabled={!editable}
                                className={cn(
                                  "inline-flex h-10 w-10 items-center justify-center rounded font-semibold transition-all",
                                  role
                                    ? roleColors[role]
                                    : editable
                                    ? "border-2 border-dashed border-slate-300 hover:border-slate-400"
                                    : "",
                                  hoveredRole && role === hoveredRole && "ring-2 ring-offset-2",
                                  !editable && !role && "opacity-0"
                                )}
                              >
                                {role}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Validation warnings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validation</CardTitle>
          <CardDescription>RACI chart best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {activities.map((activity) => {
              const activityAssignments = assignments.filter((a) => a.activityId === activity.id);
              const accountableCount = activityAssignments.filter((a) => a.role === "A").length;
              const responsibleCount = activityAssignments.filter((a) => a.role === "R").length;

              const warnings = [];
              if (accountableCount === 0) warnings.push("No one accountable");
              if (accountableCount > 1) warnings.push("Multiple people accountable");
              if (responsibleCount === 0) warnings.push("No one responsible");

              if (warnings.length > 0) {
                return (
                  <li key={activity.id} className="flex items-start gap-2">
                    <span className="text-yellow-600">⚠️</span>
                    <span>
                      <strong>{activity.name}:</strong> {warnings.join(", ")}
                    </span>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
