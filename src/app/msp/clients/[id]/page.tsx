import { auth } from "@/lib/auth/auth";
import { getMspOrganization, hasOrganizationAccess } from "@/lib/msp/utils";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import {
  Building2,
  Users,
  FolderKanban,
  TrendingUp,
  Mail,
  Calendar,
  ArrowLeft,
  Plus,
  Settings,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default async function ClientDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) {
    return <div>No MSP organization found</div>;
  }

  // Check access
  const hasAccess = await hasOrganizationAccess(session.user.id, params.id);
  if (!hasAccess) {
    notFound();
  }

  // Get client organization with detailed data
  const client = await prisma.organization.findUnique({
    where: { id: params.id },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          role: "asc",
        },
      },
      mspClientProjects: {
        where: {
          status: {
            in: ["PLANNING", "ACTIVE", "AT_RISK"],
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!client) {
    notFound();
  }

  // Get control instances and calculate compliance by domain
  const controlInstances = await prisma.controlInstance.findMany({
    where: {
      project: {
        organizationId: params.id,
      },
    },
    include: {
      control: true,
    },
  });

  const totalControls = controlInstances.length;
  const completedControls = controlInstances.filter(
    (c) => c.status === "IMPLEMENTED" || c.status === "TESTING" || c.status === "COMPLIANT"
  ).length;
  const complianceProgress =
    totalControls > 0 ? Math.round((completedControls / totalControls) * 100) : 0;

  // Group controls by domain
  const controlsByDomain = controlInstances.reduce((acc, instance) => {
    const domain = instance.control.domain || "Other";
    if (!acc[domain]) {
      acc[domain] = { total: 0, completed: 0 };
    }
    acc[domain].total++;
    if (instance.status === "IMPLEMENTED" || instance.status === "TESTING" || instance.status === "COMPLIANT") {
      acc[domain].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  const domainStats = Object.entries(controlsByDomain).map(
    ([domain, stats]) => ({
      domain,
      total: stats.total,
      completed: stats.completed,
      progress: Math.round((stats.completed / stats.total) * 100),
    })
  );

  // Get active project count
  const activeProjectCount = await prisma.mspProject.count({
    where: {
      clientId: params.id,
      status: {
        in: ["PLANNING", "ACTIVE"],
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/msp/clients"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-blue-100 p-3">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{client.name}</h1>
            {client.industry && (
              <p className="mt-1 text-slate-600">{client.industry}</p>
            )}
            {client.slug && (
              <p className="mt-1 text-sm text-slate-500">@{client.slug}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <Link
            href={`/msp/projects/new?client=${client.id}`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-3">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">
                Compliance Progress
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {complianceProgress}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <FolderKanban className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Active Projects</p>
              <p className="text-2xl font-bold text-slate-900">
                {activeProjectCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Team Members</p>
              <p className="text-2xl font-bold text-slate-900">
                {client.members.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Controls Done</p>
              <p className="text-2xl font-bold text-slate-900">
                {completedControls}/{totalControls}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compliance by Domain */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Compliance by Domain
          </h2>
          <div className="space-y-4">
            {domainStats.length === 0 ? (
              <p className="text-sm text-slate-600">
                No CMMC controls configured yet
              </p>
            ) : (
              domainStats
                .sort((a, b) => a.progress - b.progress)
                .map((domain) => (
                  <div key={domain.domain}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-slate-900">
                        {domain.domain}
                      </span>
                      <span className="text-slate-600">
                        {domain.completed}/{domain.total} ({domain.progress}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div
                        className={`h-2 rounded-full ${
                          domain.progress >= 80
                            ? "bg-green-600"
                            : domain.progress >= 50
                            ? "bg-blue-600"
                            : domain.progress >= 25
                            ? "bg-amber-600"
                            : "bg-red-600"
                        }`}
                        style={{ width: `${domain.progress}%` }}
                      />
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Active Projects */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Active Projects
            </h2>
            <Link
              href={`/msp/projects?client=${client.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {client.mspClientProjects.length === 0 ? (
              <p className="text-sm text-slate-600">No active projects</p>
            ) : (
              client.mspClientProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:border-blue-300 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-slate-900">
                      {project.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          project.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : project.status === "AT_RISK"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {project.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {project.progress}% complete
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/msp/projects/${project.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Plus className="h-4 w-4" />
            Invite Member
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {client.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-4"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {member.user.name?.charAt(0) || member.user.email.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {member.user.name || "Unnamed User"}
                </p>
                <p className="text-xs text-slate-600 truncate">
                  {member.user.email}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {member.role || "MEMBER"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
