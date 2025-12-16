import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { isMspAdmin, getAccessibleOrganizations } from "@/lib/msp/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, ShieldCheck, Building } from "lucide-react";
import Link from "next/link";

export default async function OrganizationsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Check if user is MSP admin or super admin
  const isMsp = await isMspAdmin(session.user.id);
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

  // Get organizations based on access level
  let organizations;

  if (isSuperAdmin) {
    // Super admins see all organizations
    organizations = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
        parentOrganization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else if (isMsp) {
    // MSP admins see their organization and all client organizations
    const accessibleOrgs = await getAccessibleOrganizations(session.user.id);
    const orgIds = accessibleOrgs.map((org) => org.id);

    organizations = await prisma.organization.findMany({
      where: {
        id: {
          in: orgIds,
        },
      },
      include: {
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
        parentOrganization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    // Regular users see only organizations they're members of
    const memberships = await prisma.organizationMember.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        organization: {
          include: {
            _count: {
              select: {
                members: true,
                projects: true,
              },
            },
            parentOrganization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    organizations = memberships.map((m) => m.organization);
  }

  const totalOrganizations = organizations.length;
  const mspOrganizations = organizations.filter((org) => org.type === "MSP").length;
  const clientOrganizations = organizations.filter((org) => org.type === "CLIENT").length;
  const totalMembers = organizations.reduce((sum, org) => sum + org._count.members, 0);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Organizations</h1>
        <p className="mt-2 text-slate-600">
          {isSuperAdmin
            ? "Manage all organizations across the platform"
            : isMsp
            ? "Manage your MSP and client organizations"
            : "View organizations you belong to"}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrganizations}</div>
            <p className="text-xs text-slate-600">All organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MSP Organizations</CardTitle>
            <ShieldCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mspOrganizations}</div>
            <p className="text-xs text-slate-600">Service providers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Organizations</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientOrganizations}</div>
            <p className="text-xs text-slate-600">Client companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-slate-600">Across all organizations</p>
          </CardContent>
        </Card>
      </div>

      {/* Organizations list */}
      <Card>
        <CardHeader>
          <CardTitle>All Organizations</CardTitle>
          <CardDescription>
            View and manage organization details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{org.name}</h3>
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                          org.type === "MSP"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {org.type}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{org._count.members} members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" />
                        <span>{org._count.projects} projects</span>
                      </div>
                    </div>
                    {org.parentOrganization && (
                      <div className="mt-1 text-xs text-slate-500">
                        Managed by: {org.parentOrganization.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/organizations/${org.id}`}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}

            {organizations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="h-12 w-12 text-slate-400" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No organizations found
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  You don&apos;t belong to any organizations yet
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
