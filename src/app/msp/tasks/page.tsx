import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";
import { redirect } from "next/navigation";
import { MspTasksClient } from "./tasks-client";

export default async function MspTasksPage({
  searchParams,
}: {
  searchParams: {
    projectId?: string;
    clientId?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
    search?: string;
  };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const mspOrg = await getMspOrganization(session.user.id);
  if (!mspOrg) {
    redirect("/dashboard");
  }

  // Build where clause for tasks
  const where: any = {
    project: {
      mspOrganizationId: mspOrg.id,
    },
  };

  if (searchParams.projectId) {
    where.projectId = searchParams.projectId;
  }

  if (searchParams.clientId) {
    where.project = {
      ...where.project,
      clientId: searchParams.clientId,
    };
  }

  if (searchParams.status) {
    where.status = searchParams.status;
  }

  if (searchParams.priority) {
    where.priority = searchParams.priority;
  }

  if (searchParams.assigneeId) {
    where.assigneeId = searchParams.assigneeId;
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  // Fetch tasks
  const tasks = await prisma.mspTask.findMany({
    where,
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      control: {
        select: {
          id: true,
          domain: true,
          practice: true,
        },
      },
      raciEntries: {
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
      },
    },
    orderBy: [
      { priority: "desc" },
      { dueDate: "asc" },
      { createdAt: "desc" },
    ],
  });

  // Get all projects for filter
  const projects = await prisma.mspProject.findMany({
    where: {
      mspOrganizationId: mspOrg.id,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  // Get all clients for filter
  const clients = await prisma.organization.findMany({
    where: {
      type: "CLIENT",
      mspClientProjects: {
        some: {
          mspOrganizationId: mspOrg.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  // Get all team members for filter
  const teamMembers = await prisma.organizationMember.findMany({
    where: {
      organizationId: mspOrg.id,
    },
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
  });

  return (
    <MspTasksClient
      tasks={tasks}
      projects={projects}
      clients={clients}
      teamMembers={teamMembers.map((m) => m.user)}
      filters={{
        projectId: searchParams.projectId,
        clientId: searchParams.clientId,
        status: searchParams.status,
        priority: searchParams.priority,
        assigneeId: searchParams.assigneeId,
        search: searchParams.search,
      }}
    />
  );
}
