/**
 * GoHighLevel OAuth 2.0 Integration
 * Handles OAuth flow for connecting GHL accounts to CMMC Genie
 */

export interface GHLOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  baseUrl: string;
}

export interface GHLTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  locationId?: string;
  companyId?: string;
  userId?: string;
}

export interface GHLLocationInfo {
  id: string;
  name: string;
  companyId: string;
  email?: string;
  phone?: string;
  address?: string;
}

/**
 * Get GHL OAuth configuration from environment variables
 */
export function getGHLOAuthConfig(): GHLOAuthConfig {
  const clientId = process.env.GHL_CLIENT_ID;
  const clientSecret = process.env.GHL_CLIENT_SECRET;
  const redirectUri = process.env.GHL_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error(
      "GHL OAuth not configured. Please set GHL_CLIENT_ID, GHL_CLIENT_SECRET, and GHL_REDIRECT_URI environment variables."
    );
  }

  return {
    clientId,
    clientSecret,
    redirectUri,
    baseUrl: process.env.GHL_BASE_URL || "https://rest.gohighlevel.com",
  };
}

/**
 * Generate GHL OAuth authorization URL
 * This is where users will be redirected to authorize the app
 */
export function getGHLAuthorizationUrl(state: string, scopes: string[] = []): string {
  const config = getGHLOAuthConfig();

  // Default scopes for basic functionality
  const defaultScopes = [
    "contacts.readonly",
    "contacts.write",
    "conversations.readonly",
    "conversations.write",
    "conversations/message.readonly",
    "conversations/message.write",
    "locations.readonly",
  ];

  const requestedScopes = scopes.length > 0 ? scopes : defaultScopes;

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: requestedScopes.join(" "),
    state, // CSRF protection token
  });

  return `https://marketplace.gohighlevel.com/oauth/chooselocation?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  code: string
): Promise<GHLTokenResponse> {
  const config = getGHLOAuthConfig();

  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
  });

  const response = await fetch(`${config.baseUrl}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  const data: GHLTokenResponse = await response.json();
  return data;
}

/**
 * Refresh an expired access token
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<GHLTokenResponse> {
  const config = getGHLOAuthConfig();

  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(`${config.baseUrl}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  const data: GHLTokenResponse = await response.json();
  return data;
}

/**
 * Get location information using access token
 */
export async function getLocationInfo(
  accessToken: string,
  locationId: string
): Promise<GHLLocationInfo> {
  const config = getGHLOAuthConfig();

  const response = await fetch(
    `${config.baseUrl}/v1/locations/${locationId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Version: process.env.GHL_API_VERSION || "2021-07-28",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get location info: ${error}`);
  }

  const data = await response.json();
  return data.location || data;
}

/**
 * Test GHL API connection
 */
export async function testGHLConnection(accessToken: string, locationId: string): Promise<boolean> {
  try {
    await getLocationInfo(accessToken, locationId);
    return true;
  } catch (error) {
    console.error("GHL connection test failed:", error);
    return false;
  }
}

/**
 * Revoke GHL access token (disconnect)
 */
export async function revokeGHLToken(accessToken: string): Promise<void> {
  const config = getGHLOAuthConfig();

  const response = await fetch(`${config.baseUrl}/oauth/revoke`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      token: accessToken,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to revoke token: ${error}`);
  }
}
