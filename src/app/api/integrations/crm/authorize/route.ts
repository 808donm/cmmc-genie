import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getGHLAuthorizationUrl } from "@/lib/ghl/oauth";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";

/**
 * GET /api/ghl/authorize
 * Initiates GHL OAuth flow
 * Redirects user to GHL authorization page
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get organization ID from query params
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organizationId");

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
        { error: "You must be an admin or owner to connect GHL" },
        { status: 403 }
      );
    }

    // Generate CSRF state token
    const state = randomBytes(32).toString("hex");

    // Store state in session/database for verification on callback
    // Using a temporary record that expires in 10 minutes
    await prisma.verificationToken.create({
      data: {
        identifier: `ghl-oauth-${session.user.id}`,
        token: state,
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Also store organization ID in the state for callback
    const stateData = {
      token: state,
      organizationId,
      userId: session.user.id,
    };

    // Encode state data as base64
    const encodedState = Buffer.from(JSON.stringify(stateData)).toString("base64");

    // Get authorization URL
    const authUrl = getGHLAuthorizationUrl(encodedState);

    // Redirect to GHL authorization page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error initiating GHL OAuth:", error);
    return NextResponse.json(
      { error: "Failed to initiate GHL connection" },
      { status: 500 }
    );
  }
}
