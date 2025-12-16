import { auth } from "@/lib/auth/auth";
import {
  getMspOrganization,
  getMspClientsWithProgress,
} from "@/lib/msp/utils";
import {
  Building2,
  Users,
  FolderKanban,
  TrendingUp,
  Search,
  Plus,
  Filter,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";

export default async function MspClientsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) return <div>No MSP organization found</div>;

  const clients = await getMspClientsWithProgress(mspOrg.id);

  // Sort clients by compliance progress (ascending - show clients needing most help first)
  const sortedClients = [...clients].sort(
    (a, b) => a.complianceProgress - b.complianceProgress
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Client Management</h1>
          <p className="mt-2 text-slate-600">
            Manage and monitor your client organizations
          </p>
        </div>
        <Link
          href="/organizations/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Total Clients</p>
              <p className="text-xl font-bold text-slate-900">{clients.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Fully Compliant</p>
              <p className="text-xl font-bold text-slate-900">
                {clients.filter((c) => c.complianceProgress === 100).length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-2">
              <FolderKanban className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">In Progress</p>
              <p className="text-xl font-bold text-slate-900">
                {
                  clients.filter(
                    (c) => c.complianceProgress > 0 && c.complianceProgress < 100
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2">
              <Building2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600">Not Started</p>
              <p className="text-xl font-bold text-slate-900">
                {clients.filter((c) => c.complianceProgress === 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Compliance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Active Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {sortedClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Building2 className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-4 text-sm font-medium text-slate-900">
                      No clients yet
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Get started by creating your first client organization
                    </p>
                  </td>
                </tr>
              ) : (
                sortedClients.map((client) => {
                  const getComplianceStatus = (progress: number) => {
                    if (progress === 100)
                      return {
                        label: "Compliant",
                        color: "bg-green-100 text-green-700",
                      };
                    if (progress >= 50)
                      return {
                        label: "On Track",
                        color: "bg-blue-100 text-blue-700",
                      };
                    if (progress >= 25)
                      return {
                        label: "In Progress",
                        color: "bg-amber-100 text-amber-700",
                      };
                    if (progress > 0)
                      return {
                        label: "Started",
                        color: "bg-orange-100 text-orange-700",
                      };
                    return {
                      label: "Not Started",
                      color: "bg-slate-100 text-slate-700",
                    };
                  };

                  const status = getComplianceStatus(client.complianceProgress);

                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            href={`/msp/clients/${client.id}`}
                            className="font-medium text-slate-900 hover:text-blue-600"
                          >
                            {client.name}
                          </Link>
                          {client.slug && (
                            <p className="text-xs text-slate-500">@{client.slug}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {client.industry || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[120px]">
                            <div className="h-2 w-full rounded-full bg-slate-200">
                              <div
                                className={`h-2 rounded-full ${
                                  client.complianceProgress >= 80
                                    ? "bg-green-600"
                                    : client.complianceProgress >= 50
                                    ? "bg-blue-600"
                                    : client.complianceProgress >= 25
                                    ? "bg-amber-600"
                                    : "bg-red-600"
                                }`}
                                style={{
                                  width: `${client.complianceProgress}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {client.complianceProgress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Users className="h-4 w-4" />
                          <span>{client.members.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <FolderKanban className="h-4 w-4" />
                          <span>{client.activeProjects}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/msp/clients/${client.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            View
                          </Link>
                          <button className="text-slate-400 hover:text-slate-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
