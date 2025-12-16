import { auth } from "@/lib/auth/auth";
import {
  getMspOrganization,
  getMspClientsWithProgress,
  getMspDashboardStats,
} from "@/lib/msp/utils";
import {
  Building2,
  Users,
  FolderKanban,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default async function MspDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) return <div>No MSP organization found</div>;

  const clients = await getMspClientsWithProgress(mspOrg.id);
  const stats = await getMspDashboardStats(mspOrg.id);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">MSP Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Manage your client portfolio and compliance projects
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Clients</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <FolderKanban className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Active Projects</p>
              <p className="text-2xl font-bold text-slate-900">{stats.activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-3">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Compliance</p>
              <p className="text-2xl font-bold text-slate-900">{stats.avgCompliance}%</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-3">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">At Risk</p>
              <p className="text-2xl font-bold text-slate-900">{stats.atRiskProjects}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Overdue Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{stats.overdueTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Cards Grid */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Client Organizations</h2>

        {clients.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-900">No clients yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              Get started by creating your first client organization
            </p>
            <a
              href="/organizations"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create Client
            </a>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => {
              // Determine progress bar color based on compliance percentage
              const getProgressColor = (progress: number) => {
                if (progress >= 80) return "bg-green-600";
                if (progress >= 50) return "bg-blue-600";
                if (progress >= 25) return "bg-amber-600";
                return "bg-red-600";
              };

              const progressColor = getProgressColor(client.complianceProgress);

              return (
                <div
                  key={client.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">{client.name}</h3>
                      {client.industry && (
                        <p className="mt-1 text-sm text-slate-600">{client.industry}</p>
                      )}
                    </div>
                    {client.complianceProgress === 100 && (
                      <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Compliant
                      </div>
                    )}
                  </div>

                  {/* Compliance Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Compliance Progress</span>
                      <span className="font-medium text-slate-900">
                        {client.complianceProgress}%
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                      <div
                        className={`h-2 rounded-full ${progressColor} transition-all`}
                        style={{ width: `${client.complianceProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{client.members.length} users</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FolderKanban className="h-4 w-4" />
                      <span>{client.activeProjects} active</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <Link
                      href={`/msp/clients/${client.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
