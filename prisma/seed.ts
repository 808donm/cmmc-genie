import {
  CMMCLevel,
  OrganizationType,
  OrgRole,
  Priority,
  PrismaClient,
  ProjectStatus,
  TaskStatus,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const mspOrg = await prisma.organization.upsert({
    where: { slug: "genie-msp" },
    update: {
      description: "Managed service provider workspace for CMMC Genie demos.",
      industry: "Cybersecurity",
      website: "https://cmmcgenie.com",
      type: OrganizationType.MSP,
    },
    create: {
      name: "CMMC Genie MSP",
      slug: "genie-msp",
      description: "Managed service provider workspace for CMMC Genie demos.",
      industry: "Cybersecurity",
      website: "https://cmmcgenie.com",
      type: OrganizationType.MSP,
    },
  });

  const clientOrg = await prisma.organization.upsert({
    where: { slug: "defense-client" },
    update: {
      description: "Sample defense industry client for sandboxing project views.",
      parentOrganizationId: mspOrg.id,
      industry: "Aerospace & Defense",
      size: "250-500",
      type: OrganizationType.CLIENT,
    },
    create: {
      name: "Defense Client",
      slug: "defense-client",
      description: "Sample defense industry client for sandboxing project views.",
      parentOrganizationId: mspOrg.id,
      industry: "Aerospace & Defense",
      size: "250-500",
      type: OrganizationType.CLIENT,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@cmmcgenie.test" },
    update: {
      name: "CMMC Genie Admin",
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
    create: {
      email: "admin@cmmcgenie.test",
      name: "CMMC Genie Admin",
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: { organizationId: mspOrg.id, userId: adminUser.id },
    },
    update: { role: OrgRole.OWNER },
    create: {
      organizationId: mspOrg.id,
      userId: adminUser.id,
      role: OrgRole.OWNER,
      title: "MSP Owner",
    },
  });

  const clientLead = await prisma.user.upsert({
    where: { email: "client.lead@cmmcgenie.test" },
    update: {
      name: "Client Lead",
      role: UserRole.MANAGER,
      emailVerified: new Date(),
    },
    create: {
      email: "client.lead@cmmcgenie.test",
      name: "Client Lead",
      role: UserRole.MANAGER,
      emailVerified: new Date(),
    },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: { organizationId: clientOrg.id, userId: clientLead.id },
    },
    update: { role: OrgRole.MANAGER },
    create: {
      organizationId: clientOrg.id,
      userId: clientLead.id,
      role: OrgRole.MANAGER,
      department: "Compliance",
      title: "Compliance Lead",
      needsCUI: true,
    },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: { organizationId: clientOrg.id, userId: adminUser.id },
    },
    update: { role: OrgRole.ADMIN },
    create: {
      organizationId: clientOrg.id,
      userId: adminUser.id,
      role: OrgRole.ADMIN,
      title: "Engagement Manager",
    },
  });

  const existingProject = await prisma.project.findFirst({
    where: { organizationId: clientOrg.id, name: "Compliance Readiness" },
  });

  const project =
    existingProject ??
    (await prisma.project.create({
      data: {
        organizationId: clientOrg.id,
        name: "Compliance Readiness",
        description:
          "Baseline project to stand up policies, evidence collection, and task tracking for the client.",
        targetCMMCLevel: CMMCLevel.LEVEL_2,
        status: ProjectStatus.IN_PROGRESS,
        startDate: new Date(),
      },
    }));

  const tasks = [
    {
      title: "Kickoff + scope alignment",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      description: "Confirm in-scope systems, data flows, and stakeholders.",
      order: 1,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      assignee: "admin" as const,
    },
    {
      title: "Collect existing policies",
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      description: "Upload current policy set for gap analysis.",
      order: 2,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      assignee: "client" as const,
    },
    {
      title: "Schedule stakeholder workshops",
      status: TaskStatus.BACKLOG,
      priority: Priority.LOW,
      description: "Book sessions with IT, HR, and Security for control mapping.",
      order: 3,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21),
      assignee: "admin" as const,
    },
  ] as const;

  for (const task of tasks) {
    const existingTask = await prisma.task.findFirst({
      where: { projectId: project.id, title: task.title },
    });

    if (!existingTask) {
      const createdTask = await prisma.task.create({
        data: {
          projectId: project.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          order: task.order,
          dueDate: task.dueDate,
          createdById: adminUser.id,
          updatedById: adminUser.id,
        },
      });

      await prisma.taskAssignment.create({
        data: {
          taskId: createdTask.id,
          userId: task.assignee === "client" ? clientLead.id : adminUser.id,
          assignedAt: new Date(),
        },
      });
    }
  }

  console.log("Seed data created: MSP org, client org, demo users, and starter project tasks.");
}

main()
  .catch((e) => {
    console.error("Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
