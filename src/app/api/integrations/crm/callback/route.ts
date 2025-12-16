import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  exchangeCodeForToken,
  getLocationInfo,
  testGHLConnection,
} from "@/lib/ghl/oauth";

/**
 * GET /api/ghl/callback
 * OAuth callback endpoint
 * GHL redirects here after user authorizes the app
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth error
    if (error) {
      console.error("GHL OAuth error:", error);
      return NextResponse.redirect(
        new URL(
          `/settings/integrations?error=${encodeURIComponent(
            error
          )}&message=GHL+connection+failed`,
          request.url
        )
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL(
          "/settings/integrations?error=missing_params&message=Invalid+OAuth+callback",
          request.url
        )
      );
    }

    // Decode state data
    let stateData: {
      token: string;
      organizationId: string;
      userId: string;
    };

    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString("utf-8"));
    } catch (e) {
      return NextResponse.redirect(
        new URL(
          "/settings/integrations?error=invalid_state&message=Invalid+state+parameter",
          request.url
        )
      );
    }

    // Verify state token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: `ghl-oauth-${stateData.userId}`,
          token: stateData.token,
        },
      },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.redirect(
        new URL(
          "/settings/integrations?error=invalid_state&message=State+token+expired+or+invalid",
          request.url
        )
      );
    }

    // Delete used verification token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: `ghl-oauth-${stateData.userId}`,
          token: stateData.token,
        },
      },
    });

    // Exchange authorization code for access token
    const tokenResponse = await exchangeCodeForToken(code);

    // Get location information
    const locationId = tokenResponse.locationId || "";
    let locationInfo = null;

    if (locationId) {
      try {
        locationInfo = await getLocationInfo(tokenResponse.access_token, locationId);
      } catch (error) {
        console.error("Failed to get location info:", error);
      }
    }

    // Calculate token expiration
    const expiresAt = tokenResponse.expires_in
      ? new Date(Date.now() + tokenResponse.expires_in * 1000)
      : null;

    // Test the connection
    const connectionWorks = await testGHLConnection(
      tokenResponse.access_token,
      locationId
    );

    if (!connectionWorks) {
      return NextResponse.redirect(
        new URL(
          "/settings/integrations?error=connection_failed&message=Could+not+verify+GHL+connection",
          request.url
        )
      );
    }

    // Store integration in database
    // Note: In production, you should encrypt the tokens
    await prisma.gHLIntegration.upsert({
      where: {
        organizationId: stateData.organizationId,
      },
      create: {
        organizationId: stateData.organizationId,
        userId: stateData.userId,
        ghlLocationId: locationId,
        ghlLocationName: locationInfo?.name || null,
        accessToken: tokenResponse.access_token, // TODO: Encrypt in production
        refreshToken: tokenResponse.refresh_token || null, // TODO: Encrypt in production
        tokenType: tokenResponse.token_type,
        expiresAt,
        scope: tokenResponse.scope,
        companyId: tokenResponse.companyId || locationInfo?.companyId || null,
        isActive: true,
        metadata: locationInfo
          ? JSON.parse(
              JSON.stringify({
                locationInfo,
                connectedVia: "oauth",
              })
            )
          : {
              connectedVia: "oauth",
            },
      },
      update: {
        userId: stateData.userId,
        ghlLocationId: locationId,
        ghlLocationName: locationInfo?.name || null,
        accessToken: tokenResponse.access_token, // TODO: Encrypt in production
        refreshToken: tokenResponse.refresh_token || null, // TODO: Encrypt in production
        tokenType: tokenResponse.token_type,
        expiresAt,
        scope: tokenResponse.scope,
        companyId: tokenResponse.companyId || locationInfo?.companyId || null,
        isActive: true,
        metadata: locationInfo
          ? JSON.parse(
              JSON.stringify({
                locationInfo,
                connectedVia: "oauth",
                reconnectedAt: new Date().toISOString(),
              })
            )
          : {
              connectedVia: "oauth",
              reconnectedAt: new Date().toISOString(),
            },
        syncError: null,
      },
    });

    // Redirect to settings page with success message
    return NextResponse.redirect(
      new URL(
        "/settings/integrations?success=true&message=GHL+connected+successfully",
        request.url
      )
    );
  } catch (error) {
    console.error("Error in GHL OAuth callback:", error);
    return NextResponse.redirect(
      new URL(
        `/settings/integrations?error=callback_failed&message=${encodeURIComponent(
          error instanceof Error ? error.message : "Unknown error"
        )}`,
        request.url
      )
    );
  }
}
