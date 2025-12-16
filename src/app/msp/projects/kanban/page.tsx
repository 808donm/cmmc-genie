import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getMspOrganization } from "@/lib/msp/utils";
import { prisma } from "@/lib/db";
import { KanbanBoardClient } from "./kanban-board-client";

export const metadata = {
  title: "Kanban Board - MSP Portal",
  description: "Manage tasks across all projects with a Kanban board",
};

export default async function KanbanBoardPage({
  searchParams,
}: {
  searchParams: { projectId?: string; clientId?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get MSP organization
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
      control: {
        select: {
          id: true,
          controlId: true,
          title: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          clientId: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: [{ column: "asc" }, { position: "asc" }],
  });

  // Get all projects for filter dropdown
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

  // Get all clients for filter dropdown
  const clients = await prisma.organization.findMany({
    where: {
      type: "CLIENT",
      mspProjects: {
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

  // Get team members for assignee filter
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
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });

  return (
    <KanbanBoardClient
      initialTasks={tasks}
      projects={projects}
      clients={clients}
      teamMembers={teamMembers.map((m) => m.user)}
      currentProjectId={searchParams.projectId}
      currentClientId={searchParams.clientId}
    />
  );
}
