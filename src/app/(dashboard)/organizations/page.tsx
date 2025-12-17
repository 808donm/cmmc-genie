import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { isMspAdmin, getAccessibleOrganizations } from "@/lib/msp/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, ShieldCheck, Building } from "lucide-react";
import { OrganizationList } from "@/components/organizations/organization-list";

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
    const orgIds = accessibleOrgs.map((org: { id: string }) => org.id);

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

    type Membership = typeof memberships[number];
    organizations = memberships.map((m: Membership) => m.organization);
  }

  type Organization = typeof organizations[number];

  const totalOrganizations = organizations.length;
  const mspOrganizations = organizations.filter((org: Organization) => org.type === "MSP").length;
  const clientOrganizations = organizations.filter((org: Organization) => org.type === "CLIENT").length;
  const totalMembers = organizations.reduce((sum: number, org: Organization) => sum + org._count.members, 0);

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
            Create new organizations and invite users from a global perspective
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationList
            organizations={organizations}
            canCreateOrganizations={isSuperAdmin || isMsp}
          />
        </CardContent>
      </Card>
    </div>
  );
}
