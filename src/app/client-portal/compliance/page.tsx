import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  FileText,
  TrendingUp,
} from "lucide-react";

export default async function ClientCompliancePage() {
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

  // Get projects for this organization first
  const projects = await prisma.project.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      id: true,
    },
  });

  const projectIds = projects.map((p) => p.id);

  // Get control instances for these projects
  const controlInstances = await prisma.controlInstance.findMany({
    where: {
      projectId: {
        in: projectIds,
      },
    },
    include: {
      control: {
        select: {
          id: true,
          practice: true,
          domain: true,
          level: true,
          description: true,
        },
      },
      evidence: {
        select: {
          id: true,
          fileName: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      control: {
        id: "asc",
      },
    },
  });

  // Calculate stats
  const stats = {
    total: controlInstances.length,
    implemented: controlInstances.filter(
      (c) => c.status === "IMPLEMENTED" || c.status === "COMPLIANT"
    ).length,
    inProgress: controlInstances.filter((c) => c.status === "IN_PROGRESS").length,
    notStarted: controlInstances.filter((c) => c.status === "NOT_STARTED").length,
    nonCompliant: controlInstances.filter((c) => c.status === "NON_COMPLIANT").length,
  };

  const compliancePercentage =
    stats.total > 0 ? Math.round((stats.implemented / stats.total) * 100) : 0;

  // Group by domain
  const domains = controlInstances.reduce((acc, instance) => {
    const domain = instance.control.domain;
    if (!acc[domain]) {
      acc[domain] = [];
    }
    acc[domain].push(instance);
    return acc;
  }, {} as Record<string, typeof controlInstances>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IMPLEMENTED":
      case "COMPLIANT":
        return "bg-green-100 text-green-700 border-green-300";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "NOT_STARTED":
        return "bg-slate-100 text-slate-700 border-slate-300";
      case "NON_COMPLIANT":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "IMPLEMENTED":
      case "COMPLIANT":
        return <CheckCircle2 className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4" />;
      case "NOT_STARTED":
        return <AlertTriangle className="h-4 w-4" />;
      case "NON_COMPLIANT":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Compliance Tracker</h1>
          <p className="mt-2 text-slate-600">
            Track your CMMC control implementation progress
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Overall Compliance Progress
          </h2>
          <span className="text-3xl font-bold text-blue-600">
            {compliancePercentage}%
          </span>
        </div>
        <div className="h-4 w-full rounded-full bg-slate-200">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-blue-600 to-green-600 transition-all"
            style={{ width: `${compliancePercentage}%` }}
          />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-slate-900">
                {stats.implemented}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">Implemented</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">
                {stats.inProgress}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">In Progress</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-slate-600" />
              <span className="text-2xl font-bold text-slate-900">
                {stats.notStarted}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">Not Started</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-slate-900">
                {stats.nonCompliant}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">Non-Compliant</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search controls..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Controls by Domain */}
      <div className="space-y-4">
        {Object.entries(domains).map(([domain, controls]) => {
          const domainStats = {
            total: controls.length,
            implemented: controls.filter(
              (c) => c.status === "IMPLEMENTED" || c.status === "COMPLIANT"
            ).length,
          };
          const domainPercentage =
            domainStats.total > 0
              ? Math.round((domainStats.implemented / domainStats.total) * 100)
              : 0;

          return (
            <div key={domain} className="rounded-lg border border-slate-200 bg-white">
              {/* Domain Header */}
              <div className="border-b border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{domain}</h3>
                    <p className="text-sm text-slate-600">
                      {domainStats.implemented} of {domainStats.total} controls
                      implemented
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">
                      {domainPercentage}%
                    </div>
                    <div className="mt-1 h-2 w-24 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${domainPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls List */}
              <div className="divide-y divide-slate-200">
                {controls.map((instance) => (
                  <div key={instance.id} className="p-4 hover:bg-slate-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm font-semibold text-blue-600">
                            {instance.control.id}
                          </span>
                          <span className="text-xs text-slate-500">
                            Level {instance.control.level}
                          </span>
                        </div>
                        <p className="text-sm text-slate-900 mb-2">
                          {instance.control.practice}
                        </p>
                        {instance.control.description && (
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {instance.control.description}
                          </p>
                        )}
                        {instance.evidence.length > 0 && (
                          <div className="mt-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-400" />
                            <span className="text-xs text-slate-600">
                              {instance.evidence.length} evidence file
                              {instance.evidence.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                        {instance.implementationNotes && (
                          <div className="mt-2 rounded-lg bg-blue-50 border border-blue-200 p-2">
                            <p className="text-xs text-blue-900">{instance.implementationNotes}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                            instance.status
                          )}`}
                        >
                          {getStatusIcon(instance.status)}
                          {instance.status.replace("_", " ")}
                        </span>
                        {instance.maturityScore !== null && (
                          <div className="text-right">
                            <p className="text-xs text-slate-600">Maturity Score</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {instance.maturityScore}/100
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
