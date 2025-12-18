import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      cmmcLevel,
      priority,
      targetDate,
      objectives,
      clientId,
      mspOrganizationId,
    } = body;

    // Validate required fields
    if (!name || !description || !cmmcLevel || !clientId || !mspOrganizationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify user has permission to create projects for this organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: session.user.id,
        organizationId: clientId,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You don't have permission to create projects for this organization" },
        { status: 403 }
      );
    }

    // Create the project
    const project = await prisma.mspProject.create({
      data: {
        name,
        description: `${description}\n\n**Project Objectives:**\n${objectives || "Not specified"}`,
        cmmcLevel,
        priority,
        targetDate: targetDate ? new Date(targetDate) : null,
        status: "PLANNING", // Start as PLANNING until MSP reviews
        progress: 0,
        clientId,
        mspOrganizationId,
        createdById: session.user.id,
      },
    });

    // Create a notification for the MSP
    await prisma.notification.create({
      data: {
        userId: session.user.id, // Temporarily using same user; MSP should get this
        organizationId: mspOrganizationId,
        type: "PROJECT_UPDATE",
        title: "New Project Request",
        message: `${session.user.name || session.user.email} has requested a new project: ${name}`,
        actionUrl: `/msp/projects/${project.id}`,
      },
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
