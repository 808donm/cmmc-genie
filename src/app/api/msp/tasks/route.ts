import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get MSP organization
    const mspOrg = await getMspOrganization(session.user.id);

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");
    const assigneeId = searchParams.get("assigneeId");
    const priority = searchParams.get("priority");

    // Build where clause
    const where: any = {
      project: {
        mspOrganizationId: mspOrg.id,
      },
    };

    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;
    if (priority) where.priority = priority;
    if (clientId) where.project = { ...where.project, clientId };

    // Get tasks
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

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get MSP organization
    const mspOrg = await getMspOrganization(session.user.id);

    const body = await request.json();
    const {
      projectId,
      title,
      description,
      status,
      priority,
      column,
      assigneeId,
      controlId,
      dueDate,
      startDate,
      estimatedHours,
    } = body;

    // Verify project belongs to MSP
    const project = await prisma.mspProject.findFirst({
      where: {
        id: projectId,
        mspOrganizationId: mspOrg.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Get the highest position in the target column
    const lastTask = await prisma.mspTask.findFirst({
      where: {
        projectId,
        column: column || "todo",
      },
      orderBy: { position: "desc" },
    });

    const position = lastTask ? lastTask.position + 1 : 0;

    // Create task
    const task = await prisma.mspTask.create({
      data: {
        projectId,
        title,
        description,
        status: status || "TODO",
        priority: priority || "MEDIUM",
        column: column || "todo",
        position,
        assigneeId,
        controlId,
        dueDate: dueDate ? new Date(dueDate) : null,
        startDate: startDate ? new Date(startDate) : null,
        estimatedHours,
      },
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
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
