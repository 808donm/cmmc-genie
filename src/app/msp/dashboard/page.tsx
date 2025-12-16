import { auth } from "@/lib/auth/auth";
import { getMspOrganization, getMspClients } from "@/lib/msp/utils";
import { Building2, Users, FolderKanban, TrendingUp } from "lucide-react";

export default async function MspDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) return <div>No MSP organization found</div>;

  const clients = await getMspClients(mspOrg.id);

  const stats = {
    totalClients: clients.length,
    activeProjects: 0, // Will be calculated from projects
    totalUsers: clients.reduce((sum, client) => sum + client.members.length, 0),
    avgCompliance: 0, // Will be calculated from compliance data
  };

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="rounded-full bg-orange-100 p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Avg Compliance</p>
              <p className="text-2xl font-bold text-slate-900">{stats.avgCompliance}%</p>
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
            {clients.map((client) => (
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
                </div>

                {/* Progress Bar Placeholder */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Compliance Progress</span>
                    <span className="font-medium text-slate-900">0%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: "0%" }} />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{client.members.length} users</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FolderKanban className="h-4 w-4" />
                    <span>{client._count.projects} projects</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <a
                    href={`/msp/clients/${client.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Details →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
