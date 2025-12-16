import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";

// GET /api/msp/raci - Fetch RACI entries
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mspOrg = await getMspOrganization(session.user.id);
    if (!mspOrg) {
      return NextResponse.json(
        { error: "MSP organization not found" },
        { status: 404 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const taskId = searchParams.get("taskId");
    const clientId = searchParams.get("clientId");

    const where: any = {
      project: {
        mspOrganizationId: mspOrg.id,
      },
    };

    if (projectId) {
      where.projectId = projectId;
    }

    if (clientId) {
      where.project.clientId = clientId;
    }

    if (taskId) {
      where.taskId = taskId;
    }

    const raciEntries = await prisma.mspRACIEntry.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
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
      },
      orderBy: [{ taskId: "asc" }, { userId: "asc" }],
    });

    return NextResponse.json(raciEntries);
  } catch (error) {
    console.error("Error fetching RACI entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch RACI entries" },
      { status: 500 }
    );
  }
}

// POST /api/msp/raci - Create or update RACI assignment
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mspOrg = await getMspOrganization(session.user.id);
    if (!mspOrg) {
      return NextResponse.json(
        { error: "MSP organization not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { projectId, taskId, userId, role, controlId } = body;

    // Validate required fields
    if (!projectId || !userId || !role) {
      return NextResponse.json(
        { error: "Missing required fields: projectId, userId, role" },
        { status: 400 }
      );
    }

    // Validate that the project belongs to the MSP organization
    const project = await prisma.mspProject.findUnique({
      where: { id: projectId },
    });

    if (!project || project.mspOrganizationId !== mspOrg.id) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // If taskId provided, validate it belongs to the project
    if (taskId) {
      const task = await prisma.mspTask.findUnique({
        where: { id: taskId },
      });

      if (!task || task.projectId !== projectId) {
        return NextResponse.json(
          { error: "Task not found or does not belong to project" },
          { status: 404 }
        );
      }
    }

    // Create or update the RACI entry
    // The unique constraint handles duplicates
    const raciEntry = await prisma.mspRACIEntry.upsert({
      where: {
        projectId_taskId_userId_role: {
          projectId,
          taskId: taskId || null,
          userId,
          role,
        },
      },
      update: {
        controlId: controlId || null,
        updatedAt: new Date(),
      },
      create: {
        projectId,
        taskId: taskId || null,
        userId,
        role,
        controlId: controlId || null,
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
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(raciEntry);
  } catch (error) {
    console.error("Error creating RACI entry:", error);
    return NextResponse.json(
      { error: "Failed to create RACI entry" },
      { status: 500 }
    );
  }
}
