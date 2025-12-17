import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmailViaOAuth } from "@/lib/email/send-email";

// Generate 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/email/send-code - Send verification code
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    // Generate 6-digit code
    const code = generateVerificationCode();

    // Store code in database (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete any existing verification codes for this email
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: code,
        expires: expiresAt,
      },
    });

    // Send email with code
    // For now, we'll use a simple approach - in production, you'd use a transactional email service
    // Since we need OAuth to send emails, we'll return the code for now and you can implement email sending separately

    // TODO: Implement email sending with verification code
    // You can use a service like Resend, SendGrid, or AWS SES for this
    console.log(`Verification code for ${email}: ${code}`);

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      // Remove this in production - only for development
      ...(process.env.NODE_ENV === "development" && { code }),
    });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
}
