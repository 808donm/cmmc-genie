import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

// Generate 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Lazy initialization of Resend client
function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
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

    // Send email with verification code using Resend
    const resend = getResendClient();

    if (resend) {
      try {
        await resend.emails.send({
          from: "CMMC Genie <noreply@cmmcgenie.app>",
          to: email,
          subject: "Your CMMC Genie Verification Code",
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">CMMC Genie</h1>
              <p style="margin: 8px 0 0; color: #e0e7ff; font-size: 14px;">Your AI-powered CMMC compliance companion</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px; color: #1e293b; font-size: 20px; font-weight: 600;">Your Verification Code</h2>
              <p style="margin: 0 0 24px; color: #64748b; font-size: 16px; line-height: 24px;">
                You requested to sign in to CMMC Genie. Use the verification code below to complete your sign-in:
              </p>

              <!-- Verification Code Box -->
              <div style="background-color: #f1f5f9; border-radius: 8px; padding: 24px; text-align: center; margin: 0 0 24px;">
                <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace;">
                  ${code}
                </div>
              </div>

              <p style="margin: 0 0 16px; color: #64748b; font-size: 14px; line-height: 20px;">
                This code will expire in <strong style="color: #1e293b;">10 minutes</strong>.
              </p>

              <p style="margin: 0 0 16px; color: #64748b; font-size: 14px; line-height: 20px;">
                If you didn't request this code, you can safely ignore this email.
              </p>

              <!-- Security Notice -->
              <div style="margin-top: 32px; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 18px;">
                  <strong>Security Notice:</strong> Never share this code with anyone. CMMC Genie will never ask you for this code via email or phone.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; line-height: 16px; text-align: center;">
                Need help? Contact us at <a href="mailto:info@ent-techsolutions.com" style="color: #667eea; text-decoration: none;">info@ent-techsolutions.com</a>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 11px; line-height: 16px; text-align: center;">
                © ${new Date().getFullYear()} CMMC Genie. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `,
      });

        console.log(`Verification code sent to ${email}`);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the request if email sending fails - still return success
        // In development, we can still use the code from the response
        console.log(`Verification code for ${email}: ${code}`);
      }
    } else {
      // Resend not configured - log code to console for development
      console.log(`Verification code for ${email}: ${code}`);
      console.warn("RESEND_API_KEY not configured - email not sent");
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      // Include code in development mode for testing
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
