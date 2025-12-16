import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { revokeGHLToken } from "@/lib/ghl/oauth";

/**
 * POST /api/ghl/disconnect
 * Disconnect GHL integration for an organization
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { organizationId } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Verify user has access to this organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "You must be an admin or owner to disconnect GHL" },
        { status: 403 }
      );
    }

    // Get integration
    const integration = await prisma.gHLIntegration.findUnique({
      where: {
        organizationId,
      },
    });

    if (!integration) {
      return NextResponse.json(
        { error: "GHL is not connected for this organization" },
        { status: 404 }
      );
    }

    // Try to revoke token with GHL (best effort)
    try {
      await revokeGHLToken(integration.accessToken);
    } catch (error) {
      console.error("Failed to revoke GHL token (continuing anyway):", error);
    }

    // Delete integration from database
    await prisma.gHLIntegration.delete({
      where: {
        organizationId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "GHL disconnected successfully",
    });
  } catch (error) {
    console.error("Error disconnecting GHL:", error);
    return NextResponse.json(
      { error: "Failed to disconnect GHL" },
      { status: 500 }
    );
  }
}
