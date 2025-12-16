import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { getMspOrganization } from "@/lib/msp/utils";

// DELETE /api/msp/raci/[id] - Delete RACI entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Find the RACI entry and verify access
    const raciEntry = await prisma.mspRACIEntry.findUnique({
      where: { id: params.id },
      include: {
        project: {
          select: {
            mspOrganizationId: true,
          },
        },
      },
    });

    if (!raciEntry) {
      return NextResponse.json(
        { error: "RACI entry not found" },
        { status: 404 }
      );
    }

    if (raciEntry.project.mspOrganizationId !== mspOrg.id) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    // Delete the entry
    await prisma.mspRACIEntry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting RACI entry:", error);
    return NextResponse.json(
      { error: "Failed to delete RACI entry" },
      { status: 500 }
    );
  }
}
