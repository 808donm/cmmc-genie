import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { isMspUser } from "@/lib/msp/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is MSP user
    const isMsp = await isMspUser(session.user.id);
    if (!isMsp) {
      return NextResponse.json(
        { error: "Only MSP users can update tasks" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { column, position, status, assigneeId, priority, dueDate } = body;

    // Get the task to verify it belongs to MSP's organization
    const task = await prisma.mspTask.findUnique({
      where: { id: params.id },
      include: {
        project: {
          include: {
            mspOrganization: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    type Member = typeof task.project.mspOrganization.members[number];

    // Verify user has access to this MSP organization
    const hasAccess = task.project.mspOrganization.members.some(
      (member: Member) => member.userId === session.user.id
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Build update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (column !== undefined) updateData.column = column;
    if (position !== undefined) updateData.position = position;
    if (status !== undefined) updateData.status = status;
    if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    // If status is COMPLETED, set completedAt
    if (status === "COMPLETED") {
      updateData.completedAt = new Date();
    } else if (task.status === "COMPLETED" && status !== "COMPLETED") {
      // If moving from COMPLETED to another status, clear completedAt
      updateData.completedAt = null;
    }

    // Update the task
    const updatedTask = await prisma.mspTask.update({
      where: { id: params.id },
      data: updateData,
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
            domain: true,
            practice: true,
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

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is MSP user
    const isMsp = await isMspUser(session.user.id);
    if (!isMsp) {
      return NextResponse.json(
        { error: "Only MSP users can delete tasks" },
        { status: 403 }
      );
    }

    // Get the task to verify access
    const task = await prisma.mspTask.findUnique({
      where: { id: params.id },
      include: {
        project: {
          include: {
            mspOrganization: {
              include: {
                members: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    type DeleteMember = typeof task.project.mspOrganization.members[number];

    // Verify user has access
    const hasAccess = task.project.mspOrganization.members.some(
      (member: DeleteMember) => member.userId === session.user.id
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Delete the task
    await prisma.mspTask.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
