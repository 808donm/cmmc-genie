import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";
import { redirect } from "next/navigation";
import { RACIMatrixClient } from "./raci-matrix-client";

export default async function RACIMatrixPage({
  searchParams,
}: {
  searchParams: { projectId?: string; clientId?: string };
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
  const taskWhere: any = {
    project: {
      mspOrganizationId: mspOrg.id,
    },
  };

  if (searchParams.projectId) {
    taskWhere.projectId = searchParams.projectId;
  }

  if (searchParams.clientId) {
    taskWhere.project = {
      ...taskWhere.project,
      clientId: searchParams.clientId,
    };
  }

  // Fetch tasks with their RACI assignments
  const tasks = await prisma.mspTask.findMany({
    where: taskWhere,
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
    orderBy: [{ project: { name: "asc" } }, { title: "asc" }],
  });

  // Get all unique team members (users who have RACI assignments)
  type Task = typeof tasks[number];
  type RaciEntry = Task['raciEntries'][number];

  const teamMemberIds = new Set<string>();
  tasks.forEach((task: Task) => {
    task.raciEntries.forEach((entry: RaciEntry) => {
      teamMemberIds.add(entry.userId);
    });
  });

  // Fetch full user details for team members
  const teamMembers = await prisma.user.findMany({
    where: {
      id: {
        in: Array.from(teamMemberIds),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  // Also get all organization members who could be assigned
  const orgMembers = await prisma.organizationMember.findMany({
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

  // Combine team members with org members (deduplicated)
  type OrgMember = typeof orgMembers[number];
  type User = OrgMember['user'];

  const allPeople = [
    ...teamMembers,
    ...orgMembers
      .map((m: OrgMember) => m.user)
      .filter((u: User) => !teamMemberIds.has(u.id)),
  ];

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
    <RACIMatrixClient
      tasks={tasks}
      people={allPeople}
      projects={projects}
      clients={clients}
      currentProjectId={searchParams.projectId}
      currentClientId={searchParams.clientId}
    />
  );
}
