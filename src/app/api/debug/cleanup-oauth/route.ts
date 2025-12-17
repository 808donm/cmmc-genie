import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";

/**
 * Delete old OAuth accounts that don't have refresh tokens
 * This allows users to sign in fresh with new scopes
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find accounts without refresh tokens
    const accountsToDelete = await prisma.account.findMany({
      where: {
        userId: session.user.id,
        refresh_token: null,
      },
      select: {
        id: true,
        provider: true,
      },
    });

    if (accountsToDelete.length === 0) {
      return NextResponse.json({
        message: "No accounts to cleanup - all accounts have refresh tokens",
        deleted: 0,
      });
    }

    // Delete accounts without refresh tokens
    const result = await prisma.account.deleteMany({
      where: {
        userId: session.user.id,
        refresh_token: null,
      },
    });

    return NextResponse.json({
      message: `Deleted ${result.count} OAuth account(s) without refresh tokens`,
      deleted: result.count,
      accounts: accountsToDelete.map(acc => ({
        provider: acc.provider,
      })),
      nextSteps: [
        "Sign out of the application",
        "Sign back in with Microsoft or Google",
        "Grant the email sending permissions",
        "Try sending an invitation again"
      ],
    });
  } catch (error) {
    console.error("Error cleaning up OAuth accounts:", error);
    return NextResponse.json(
      { error: "Failed to cleanup OAuth accounts" },
      { status: 500 }
    );
  }
}
