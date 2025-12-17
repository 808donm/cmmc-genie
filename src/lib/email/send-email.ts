import { prisma } from "@/lib/db";

export interface EmailMessage {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

export interface SendEmailResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

/**
 * Send email using the user's OAuth provider (Microsoft or Google)
 */
export async function sendEmailViaOAuth(
  userId: string,
  message: EmailMessage
): Promise<SendEmailResult> {
  try {
    // Get all user's OAuth accounts
    const accounts = await prisma.account.findMany({
      where: {
        userId,
        provider: {
          in: ["azure-ad", "google"],
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    if (accounts.length === 0) {
      return {
        success: false,
        error: "No OAuth account found. Please sign in with Microsoft or Google.",
      };
    }

    // Log account details for debugging (without exposing tokens)
    console.log(`Found ${accounts.length} OAuth accounts for user ${userId}:`,
      accounts.map(acc => ({
        provider: acc.provider,
        hasAccessToken: !!acc.access_token,
        hasRefreshToken: !!acc.refresh_token,
        expiresAt: acc.expires_at ? new Date(acc.expires_at * 1000).toISOString() : null,
        isExpired: acc.expires_at ? acc.expires_at * 1000 < Date.now() : null,
      }))
    );

    // Prefer accounts with refresh tokens and valid access tokens
    const validAccount = accounts.find(
      (acc) => acc.refresh_token && acc.access_token
    );

    // Fall back to any account with an access token
    const account = validAccount || accounts.find((acc) => acc.access_token);

    console.log(`Selected account: provider=${account?.provider}, hasRefreshToken=${!!account?.refresh_token}`);

    if (!account) {
      return {
        success: false,
        error: `Found ${accounts.length} OAuth account(s) but none have valid tokens. Please sign out and sign in again with Microsoft or Google to grant email permissions.`,
      };
    }

    if (!account.access_token) {
      return {
        success: false,
        error: "OAuth account found but missing access token. Please sign out and sign in again.",
      };
    }

    // Check if token is expired and refresh if needed
    let accessToken = account.access_token;
    if (account.expires_at && account.expires_at * 1000 < Date.now()) {
      if (!account.refresh_token) {
        return {
          success: false,
          error: "OAuth token expired and no refresh token available. Please sign in again.",
        };
      }

      // Refresh the token
      const refreshResult = await refreshAccessToken(account);
      if (!refreshResult.success || !refreshResult.accessToken) {
        return {
          success: false,
          error: refreshResult.error || "Failed to refresh access token",
        };
      }
      accessToken = refreshResult.accessToken;
    }

    if (!accessToken) {
      return {
        success: false,
        error: "No valid access token available",
      };
    }

    // Send email based on provider
    if (account.provider === "azure-ad") {
      return await sendEmailViaMicrosoft(accessToken, message);
    } else if (account.provider === "google") {
      return await sendEmailViaGmail(accessToken, message);
    }

    return {
      success: false,
      error: `Unsupported provider: ${account.provider}`,
    };
  } catch (error) {
    console.error("Error sending email via OAuth:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Refresh OAuth access token
 */
async function refreshAccessToken(account: {
  id: string;
  provider: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
}): Promise<{ success: boolean; accessToken?: string; error?: string }> {
  try {
    if (!account.refresh_token) {
      return { success: false, error: "No refresh token available" };
    }

    let tokenUrl = "";
    let clientId = "";
    let clientSecret = "";

    if (account.provider === "azure-ad") {
      tokenUrl = `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || "common"}/oauth2/v2.0/token`;
      clientId = process.env.AZURE_AD_CLIENT_ID || "";
      clientSecret = process.env.AZURE_AD_CLIENT_SECRET || "";
    } else if (account.provider === "google") {
      tokenUrl = "https://oauth2.googleapis.com/token";
      clientId = process.env.GOOGLE_CLIENT_ID || "";
      clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    } else {
      return { success: false, error: "Unsupported provider for token refresh" };
    }

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: account.refresh_token,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Token refresh failed:", error);
      return { success: false, error: "Failed to refresh token" };
    }

    const tokens = await response.json();

    // Update account with new tokens
    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: tokens.access_token,
        expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
        refresh_token: tokens.refresh_token || account.refresh_token,
      },
    });

    return { success: true, accessToken: tokens.access_token };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return { success: false, error: "Token refresh failed" };
  }
}

/**
 * Send email via Microsoft Graph API
 */
async function sendEmailViaMicrosoft(
  accessToken: string,
  message: EmailMessage
): Promise<SendEmailResult> {
  try {
    const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: message.subject,
          body: {
            contentType: "HTML",
            content: message.htmlBody,
          },
          toRecipients: [
            {
              emailAddress: {
                address: message.to,
              },
            },
          ],
        },
        saveToSentItems: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Microsoft Graph API error:", error);
      return {
        success: false,
        error: `Failed to send email via Microsoft: ${response.statusText}`,
      };
    }

    return {
      success: true,
      messageId: "sent-via-microsoft",
    };
  } catch (error) {
    console.error("Error sending email via Microsoft:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email via Gmail API
 */
async function sendEmailViaGmail(
  accessToken: string,
  message: EmailMessage
): Promise<SendEmailResult> {
  try {
    // Create RFC 2822 formatted email
    const emailLines = [
      `To: ${message.to}`,
      `Subject: ${message.subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
      "",
      message.htmlBody,
    ];

    const email = emailLines.join("\r\n");

    // Base64url encode the email
    const encodedEmail = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: encodedEmail,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Gmail API error:", error);
      return {
        success: false,
        error: `Failed to send email via Gmail: ${response.statusText}`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      messageId: result.id,
    };
  } catch (error) {
    console.error("Error sending email via Gmail:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create invitation email HTML
 */
export function createInvitationEmailHtml(params: {
  inviteeEmail: string;
  organizationName: string;
  inviterName: string;
  role: string;
  inviteLink: string;
  expiresAt: Date;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation to ${params.organizationName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
    <h1 style="color: #2563eb; margin-top: 0;">You're Invited!</h1>
    <p style="font-size: 16px; margin-bottom: 0;">
      <strong>${params.inviterName}</strong> has invited you to join <strong>${params.organizationName}</strong> on CMMC Genie.
    </p>
  </div>

  <div style="background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
    <h2 style="color: #1f2937; margin-top: 0;">Invitation Details</h2>
    <p><strong>Email:</strong> ${params.inviteeEmail}</p>
    <p><strong>Role:</strong> ${params.role}</p>
    <p><strong>Expires:</strong> ${params.expiresAt.toLocaleDateString()} at ${params.expiresAt.toLocaleTimeString()}</p>

    <div style="margin: 30px 0;">
      <a href="${params.inviteLink}" style="display: inline-block; background-color: #2563eb; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">
        Accept Invitation
      </a>
    </div>

    <p style="color: #6b7280; font-size: 14px;">
      Or copy and paste this link into your browser:<br>
      <a href="${params.inviteLink}" style="color: #2563eb; word-break: break-all;">${params.inviteLink}</a>
    </p>
  </div>

  <div style="color: #6b7280; font-size: 14px; text-align: center;">
    <p>This invitation will expire in 7 days.</p>
    <p>If you didn't expect this invitation, you can safely ignore this email.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Create plain text version of invitation email
 */
export function createInvitationEmailText(params: {
  inviteeEmail: string;
  organizationName: string;
  inviterName: string;
  role: string;
  inviteLink: string;
  expiresAt: Date;
}): string {
  return `
You're Invited!

${params.inviterName} has invited you to join ${params.organizationName} on CMMC Genie.

Invitation Details:
- Email: ${params.inviteeEmail}
- Role: ${params.role}
- Expires: ${params.expiresAt.toLocaleDateString()} at ${params.expiresAt.toLocaleTimeString()}

Accept your invitation by clicking this link:
${params.inviteLink}

This invitation will expire in 7 days.

If you didn't expect this invitation, you can safely ignore this email.
  `.trim();
}
