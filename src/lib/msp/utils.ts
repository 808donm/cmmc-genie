import { prisma } from "@/lib/db";

/**
 * Check if a user belongs to an MSP organization
 */
export async function isMspUser(userId: string): Promise<boolean> {
  const mspMembership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organization: {
        type: "MSP",
      },
    },
  });

  return !!mspMembership;
}

/**
 * Check if a user is an admin in an MSP organization
 */
export async function isMspAdmin(userId: string): Promise<boolean> {
  const mspMembership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organization: {
        type: "MSP",
      },
      role: {
        in: ["OWNER", "ADMIN"],
      },
    },
  });

  return !!mspMembership;
}

/**
 * Get the MSP organization for a user (if they belong to one)
 */
export async function getMspOrganization(userId: string) {
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organization: {
        type: "MSP",
      },
    },
    include: {
      organization: true,
    },
  });

  return membership?.organization || null;
}

/**
 * Get all organizations accessible by a user
 * - Regular users: only their own organization(s)
 * - MSP admins: their MSP org + all client orgs
 */
export async function getAccessibleOrganizations(userId: string) {
  const isMsp = await isMspAdmin(userId);

  if (isMsp) {
    // MSP admin - get MSP org and all client orgs
    const mspOrg = await getMspOrganization(userId);

    if (!mspOrg) return [];

    const clientOrgs = await prisma.organization.findMany({
      where: {
        parentOrganizationId: mspOrg.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return [mspOrg, ...clientOrgs];
  } else {
    // Regular user - get their organization(s)
    const memberships = await prisma.organizationMember.findMany({
      where: {
        userId,
      },
      include: {
        organization: true,
      },
      orderBy: {
        organization: {
          name: "asc",
        },
      },
    });

    type Membership = typeof memberships[number];

    return memberships.map((m: Membership) => m.organization);
  }
}

/**
 * Check if a user has access to a specific organization
 */
export async function hasOrganizationAccess(
  userId: string,
  organizationId: string
): Promise<boolean> {
  // Check if user is a direct member
  const directMembership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      organizationId,
    },
  });

  if (directMembership) return true;

  // Check if user is an MSP admin
  const isMsp = await isMspAdmin(userId);
  if (!isMsp) return false;

  // Check if the organization is a client of the user's MSP
  const mspOrg = await getMspOrganization(userId);
  if (!mspOrg) return false;

  const clientOrg = await prisma.organization.findFirst({
    where: {
      id: organizationId,
      parentOrganizationId: mspOrg.id,
    },
  });

  return !!clientOrg;
}

/**
 * Get all client organizations for an MSP
 */
export async function getMspClients(mspOrganizationId: string) {
  return await prisma.organization.findMany({
    where: {
      parentOrganizationId: mspOrganizationId,
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          projects: true,
          members: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

/**
 * Get user's primary organization and determine if it's MSP or Client
 */
export async function getUserOrganizationType(userId: string): Promise<"MSP" | "CLIENT" | null> {
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
    },
    include: {
      organization: true,
    },
  });

  return membership?.organization.type || null;
}

/**
 * Get user's active organization with full details
 */
export async function getUserActiveOrganization(userId: string) {
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId,
    },
    include: {
      organization: true,
    },
    orderBy: {
      joinedAt: 'asc', // First organization they joined
    },
  });

  return membership?.organization || null;
}

/**
 * Check if user should see MSP dashboard (is MSP member)
 * vs Client dashboard (is client member)
 */
export async function shouldShowMspDashboard(userId: string): Promise<boolean> {
  const orgType = await getUserOrganizationType(userId);
  return orgType === "MSP";
}

/**
 * Get dashboard route for user based on their organization type
 */
export async function getUserDashboardRoute(userId: string): Promise<string> {
  const isMsp = await shouldShowMspDashboard(userId);
  return isMsp ? "/msp/dashboard" : "/dashboard";
}

/**
 * Calculate compliance progress for a client organization
 */
export async function getClientComplianceProgress(clientId: string): Promise<number> {
  // Get all control instances for the client's projects
  const controlInstances = await prisma.controlInstance.findMany({
    where: {
      project: {
        organizationId: clientId,
      },
    },
  });

  if (controlInstances.length === 0) return 0;

  type ControlInstance = typeof controlInstances[number];

  // Count completed controls (those with status IMPLEMENTED or TESTING or COMPLIANT)
  const completedControls = controlInstances.filter(
    (c: ControlInstance) => c.status === "IMPLEMENTED" || c.status === "TESTING" || c.status === "COMPLIANT"
  );

  // Calculate percentage
  return Math.round((completedControls.length / controlInstances.length) * 100);
}

/**
 * Get MSP clients with enhanced data including compliance progress
 */
export async function getMspClientsWithProgress(mspOrganizationId: string) {
  const clients = await getMspClients(mspOrganizationId);

  type Client = typeof clients[number];

  // Calculate compliance progress for each client
  const clientsWithProgress = await Promise.all(
    clients.map(async (client: Client) => {
      const complianceProgress = await getClientComplianceProgress(client.id);

      // Get active projects count
      const activeProjects = await prisma.mspProject.count({
        where: {
          clientId: client.id,
          status: {
            in: ["PLANNING", "ACTIVE"],
          },
        },
      });

      return {
        ...client,
        complianceProgress,
        activeProjects,
      };
    })
  );

  return clientsWithProgress;
}

/**
 * Get MSP dashboard statistics
 */
export async function getMspDashboardStats(mspOrganizationId: string) {
  const clients = await getMspClients(mspOrganizationId);

  type Client = typeof clients[number];

  // Total active projects across all clients
  const activeProjects = await prisma.mspProject.count({
    where: {
      mspOrganizationId,
      status: {
        in: ["PLANNING", "ACTIVE"],
      },
    },
  });

  // Total users across all clients
  const totalUsers = clients.reduce((sum: number, client: Client) => sum + client.members.length, 0);

  // Calculate average compliance across all clients
  const complianceScores = await Promise.all(
    clients.map((client: Client) => getClientComplianceProgress(client.id))
  );

  const avgCompliance =
    complianceScores.length > 0
      ? Math.round(complianceScores.reduce((a, b) => a + b, 0) / complianceScores.length)
      : 0;

  // Count at-risk projects
  const atRiskProjects = await prisma.mspProject.count({
    where: {
      mspOrganizationId,
      status: "AT_RISK",
    },
  });

  // Count overdue tasks
  const overdueTasks = await prisma.mspTask.count({
    where: {
      project: {
        mspOrganizationId,
      },
      status: {
        not: "COMPLETED",
      },
      dueDate: {
        lt: new Date(),
      },
    },
  });

  return {
    totalClients: clients.length,
    activeProjects,
    totalUsers,
    avgCompliance,
    atRiskProjects,
    overdueTasks,
  };
}
