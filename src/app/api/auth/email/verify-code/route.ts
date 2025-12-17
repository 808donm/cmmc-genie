import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth/auth";

// POST /api/auth/email/verify-code - Verify code and sign in
export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: code,
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Check if expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token: code,
          },
        },
      });

      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Code is valid - find or create user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          emailVerified: new Date(),
        },
      });

      // Create personal organization for new user
      const orgName = `${email.split("@")[0]}'s Organization`;
      const orgSlug = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");

      await prisma.organization.create({
        data: {
          name: orgName,
          slug: orgSlug,
          members: {
            create: {
              userId: user.id,
              role: "ADMIN",
            },
          },
        },
      });
    } else if (!user.emailVerified) {
      // Update email verification status
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    }

    // Delete used verification token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: code,
        },
      },
    });

    // Create session
    // Note: NextAuth doesn't have a direct API for creating sessions from custom flows
    // We'll need to create a session manually
    const sessionToken = crypto.randomUUID();
    const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires: sessionExpiry,
      },
    });

    return NextResponse.json({
      success: true,
      sessionToken,
      userId: user.id,
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json(
      { error: "Failed to verify code" },
      { status: 500 }
    );
  }
}
