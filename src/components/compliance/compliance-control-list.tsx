"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Upload,
  FileText,
  CheckSquare,
  Square,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Control {
  id: string;
  domain: string;
  practice: string;
  level: number;
  description: string;
  objective: string | null;
}

interface ControlInstance {
  id: string;
  status: string;
  evidence: Array<{
    id: string;
    title: string;
    status: string;
    type: string;
  }>;
  project: {
    id: string;
    name: string;
  };
}

interface ComplianceControlListProps {
  controlsByDomain: Record<string, Control[]>;
  controlInstanceMap: Record<string, ControlInstance[]>;
  organizationId: string;
}

export function ComplianceControlList({
  controlsByDomain,
  controlInstanceMap,
  organizationId,
}: ComplianceControlListProps) {
  const router = useRouter();
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [expandedControls, setExpandedControls] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);

  const toggleDomain = (domain: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domain)) {
      newExpanded.delete(domain);
    } else {
      newExpanded.add(domain);
    }
    setExpandedDomains(newExpanded);
  };

  const toggleControl = (controlId: string) => {
    const newExpanded = new Set(expandedControls);
    if (newExpanded.has(controlId)) {
      newExpanded.delete(controlId);
    } else {
      newExpanded.add(controlId);
    }
    setExpandedControls(newExpanded);
  };

  const handleCompleteControl = async (controlId: string, projectId: string, currentStatus: string) => {
    setLoading(controlId);
    try {
      const newStatus = currentStatus === "COMPLIANT" ? "IMPLEMENTED" : "COMPLIANT";

      const response = await fetch(`/api/compliance/controls/${controlId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update control status");
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating control:", error);
      alert(error instanceof Error ? error.message : "Failed to update control status");
    } finally {
      setLoading(null);
    }
  };

  const getControlStatus = (controlId: string) => {
    const instances = controlInstanceMap[controlId] || [];
    if (instances.length === 0) {
      return {
        status: "NOT_STARTED",
        evidenceCount: 0,
        approvedCount: 0,
        canComplete: false,
        projectId: null,
      };
    }

    // Find the most progressed instance
    const compliantInstance = instances.find((inst) => inst.status === "COMPLIANT");
    const instance = compliantInstance || instances[0];

    const evidenceCount = instance.evidence.length;
    const approvedCount = instance.evidence.filter((e) => e.status === "APPROVED").length;
    const canComplete = evidenceCount > 0 && evidenceCount === approvedCount;

    return {
      status: instance.status,
      evidenceCount,
      approvedCount,
      canComplete,
      projectId: instance.project.id,
    };
  };

  const domains = Object.keys(controlsByDomain).sort();

  return (
    <div className="space-y-4">
      {domains.map((domain) => {
        const controls = controlsByDomain[domain];
        const domainCompliantCount = controls.filter((control) => {
          const status = getControlStatus(control.id);
          return status.status === "COMPLIANT";
        }).length;
        const domainProgress = (domainCompliantCount / controls.length) * 100;

        const isExpanded = expandedDomains.has(domain);

        return (
          <Card key={domain}>
            <CardHeader className="cursor-pointer" onClick={() => toggleDomain(domain)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-slate-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-500" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{domain}</CardTitle>
                    <CardDescription>
                      {domainCompliantCount} of {controls.length} controls compliant
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-slate-900">
                    {domainProgress.toFixed(0)}%
                  </span>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-green-600 transition-all"
                      style={{ width: `${domainProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent className="space-y-2">
                {controls.map((control) => {
                  const status = getControlStatus(control.id);
                  const isControlExpanded = expandedControls.has(control.id);
                  const isCompliant = status.status === "COMPLIANT";

                  return (
                    <div
                      key={control.id}
                      className="rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        {/* Completion checkbox */}
                        <button
                          onClick={() =>
                            status.projectId &&
                            handleCompleteControl(control.id, status.projectId, status.status)
                          }
                          disabled={!status.canComplete || loading === control.id}
                          className={`mt-1 flex-shrink-0 ${
                            !status.canComplete
                              ? "cursor-not-allowed opacity-40"
                              : "cursor-pointer hover:opacity-80"
                          }`}
                          title={
                            !status.canComplete
                              ? "All evidence must be approved before marking as compliant"
                              : isCompliant
                              ? "Mark as not compliant"
                              : "Mark as compliant"
                          }
                        >
                          {isCompliant ? (
                            <CheckSquare className="h-5 w-5 text-green-600" />
                          ) : (
                            <Square className="h-5 w-5 text-slate-400" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div
                              className="flex-1 cursor-pointer"
                              onClick={() => toggleControl(control.id)}
                            >
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-slate-900">
                                  {control.id}
                                </h4>
                                <span
                                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                                    isCompliant
                                      ? "bg-green-100 text-green-700"
                                      : status.status === "IN_PROGRESS" ||
                                        status.status === "IMPLEMENTED" ||
                                        status.status === "TESTING"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {isCompliant
                                    ? "Compliant"
                                    : status.status.replace("_", " ")}
                                </span>
                                <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                  Level {control.level}
                                </span>
                              </div>
                              <p className="mt-1 text-sm font-medium text-slate-700">
                                {control.practice}
                              </p>
                            </div>

                            {/* Evidence status */}
                            <div className="ml-4 flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1 text-slate-600">
                                <FileText className="h-4 w-4" />
                                <span>
                                  {status.evidenceCount} evidence{" "}
                                  {status.approvedCount > 0 && (
                                    <span className="text-green-600">
                                      ({status.approvedCount} approved)
                                    </span>
                                  )}
                                </span>
                              </div>
                              {!status.canComplete && status.evidenceCount > 0 && (
                                <div
                                  className="flex items-center gap-1 text-orange-600"
                                  title="Not all evidence is approved"
                                >
                                  <AlertCircle className="h-4 w-4" />
                                  <span className="text-xs">Pending approval</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Expanded details */}
                          {isControlExpanded && (
                            <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
                              <div>
                                <h5 className="text-sm font-medium text-slate-700">
                                  Description
                                </h5>
                                <p className="mt-1 text-sm text-slate-600">
                                  {control.description}
                                </p>
                              </div>
                              {control.objective && (
                                <div>
                                  <h5 className="text-sm font-medium text-slate-700">
                                    Objective
                                  </h5>
                                  <p className="mt-1 text-sm text-slate-600">
                                    {control.objective}
                                  </p>
                                </div>
                              )}
                              <div>
                                <button
                                  onClick={() =>
                                    (window.location.href = `/evidence?control=${control.id}`)
                                  }
                                  className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                  <Upload className="h-4 w-4" />
                                  Upload Evidence
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            )}
          </Card>
        );
      })}

      {domains.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-slate-600">
              No CMMC controls found. Please ensure the database is seeded with CMMC controls.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
