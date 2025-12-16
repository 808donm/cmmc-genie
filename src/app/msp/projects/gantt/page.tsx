import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { getMspOrganization } from "@/lib/msp/utils";
import { prisma } from "@/lib/db";
import { GanttChartClient } from "./gantt-chart-client";

export const metadata = {
  title: "GANTT Chart - MSP Portal",
  description: "Visualize project timelines and dependencies",
};

export default async function GanttChartPage({
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

  // Build where clause
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

  // Fetch tasks with dependencies
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
      dependencies: {
        include: {
          dependsOn: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
    orderBy: [{ startDate: "asc" }, { project: { name: "asc" } }],
  });

  // Fetch milestones
  const milestones = await prisma.mspMilestone.findMany({
    where: {
      project: {
        mspOrganizationId: mspOrg.id,
        ...(searchParams.clientId ? { clientId: searchParams.clientId } : {}),
      },
      ...(searchParams.projectId ? { projectId: searchParams.projectId } : {}),
    },
    include: {
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
    },
    orderBy: { dueDate: "asc" },
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

  return (
    <GanttChartClient
      tasks={tasks}
      milestones={milestones}
      projects={projects}
      clients={clients}
      currentProjectId={searchParams.projectId}
      currentClientId={searchParams.clientId}
    />
  );
}
