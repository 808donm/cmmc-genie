import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { hasOrganizationAccess } from "@/lib/msp/utils";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { controlId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { controlId } = params;
    const body = await request.json();
    const { projectId, status } = body;

    if (!projectId || !status) {
      return NextResponse.json(
        { error: "Project ID and status are required" },
        { status: 400 }
      );
    }

    // Get the project to check organization
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { organizationId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user has access to this organization
    const hasAccess = await hasOrganizationAccess(
      session.user.id,
      project.organizationId
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "You don't have permission to manage this project" },
        { status: 403 }
      );
    }

    // If marking as COMPLIANT, verify all evidence is approved
    if (status === "COMPLIANT") {
      const controlInstance = await prisma.controlInstance.findFirst({
        where: {
          projectId,
          controlId,
        },
        include: {
          evidence: true,
        },
      });

      if (controlInstance) {
        const totalEvidence = controlInstance.evidence.length;
        const approvedEvidence = controlInstance.evidence.filter(
          (e) => e.status === "APPROVED"
        ).length;

        if (totalEvidence === 0) {
          return NextResponse.json(
            { error: "Cannot mark as compliant without any evidence" },
            { status: 400 }
          );
        }

        if (approvedEvidence !== totalEvidence) {
          return NextResponse.json(
            {
              error: `Cannot mark as compliant. ${approvedEvidence} of ${totalEvidence} evidence items are approved.`,
            },
            { status: 400 }
          );
        }
      }
    }

    // Update or create control instance
    const controlInstance = await prisma.controlInstance.upsert({
      where: {
        projectId_controlId: {
          projectId,
          controlId,
        },
      },
      update: {
        status,
        assessedAt: new Date(),
        assessedBy: session.user.id,
      },
      create: {
        projectId,
        controlId,
        status,
        assessedAt: new Date(),
        assessedBy: session.user.id,
      },
      include: {
        control: true,
        evidence: true,
      },
    });

    return NextResponse.json({
      message: "Control status updated successfully",
      controlInstance,
    });
  } catch (error) {
    console.error("Error updating control status:", error);
    return NextResponse.json(
      { error: "Failed to update control status" },
      { status: 500 }
    );
  }
}
