import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all accounts for this user
    const accounts = await prisma.account.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        provider: true,
        type: true,
        scope: true,
        expires_at: true,
        token_type: true,
        access_token: true,
        refresh_token: true,
      },
    });

    // Transform to show token presence without exposing values
    const accountsInfo = accounts.map((acc) => ({
      id: acc.id,
      provider: acc.provider,
      type: acc.type,
      scope: acc.scope,
      expires_at: acc.expires_at,
      expires_at_date: acc.expires_at ? new Date(acc.expires_at * 1000).toISOString() : null,
      token_type: acc.token_type,
      has_access_token: !!acc.access_token,
      has_refresh_token: !!acc.refresh_token,
      is_expired: acc.expires_at ? acc.expires_at * 1000 < Date.now() : null,
    }));

    return NextResponse.json({
      userId: session.user.id,
      accounts: accountsInfo,
      currentTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error checking OAuth status:", error);
    return NextResponse.json(
      { error: "Failed to check OAuth status" },
      { status: 500 }
    );
  }
}
