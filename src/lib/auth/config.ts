import { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const authConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || "common"}/v2.0`,
      authorization: {
        params: {
          scope: "openid profile email User.Read Organization.Read.All Mail.Send offline_access",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    // Zoom OAuth moved to in-app connection (not for sign-in)
    // Users can connect Zoom account in settings for calendar integration
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Get full user data including role
        const fullUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });

        if (fullUser) {
          session.user.role = fullUser.role;
        }

        // Get user's organization memberships
        const memberships = await prisma.organizationMember.findMany({
          where: { userId: user.id },
          include: {
            organization: true,
          },
        });

        type Membership = typeof memberships[number];

        session.user.organizations = memberships.map((m: Membership) => ({
          id: m.organizationId,
          name: m.organization.name,
          role: m.role,
        }));

        // Set default organization (first one or create personal org)
        if (memberships.length > 0) {
          session.user.activeOrganization = memberships[0].organizationId;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow sign-in - the adapter will handle user creation
      if (!user.email) {
        return false;
      }

      // Handle account linking: if user exists but account doesn't, link them
      if (account && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: {
            accounts: {
              where: {
                provider: account.provider,
              },
            },
          },
        });

        // If user exists but has no account for this provider, allow linking
        if (existingUser && existingUser.accounts.length === 0) {
          // NextAuth adapter will create the Account record
          return true;
        }
      }

      return true;
    },
    async jwt({ token, user, account, profile }) {
      // After first sign-in, create/join organization
      if (user && user.id && account && profile) {
        const existingMembership = await prisma.organizationMember.findFirst({
          where: { userId: user.id },
        });

        if (!existingMembership) {
          // Extract organization name from OAuth provider
          let orgName = "";
          let orgSlug = "";
          let tenantId = "";

          // For Microsoft/Azure AD - fetch actual organization name from Microsoft Graph
          if (account.provider === "azure-ad" && account.access_token) {
            try {
              // Get tenant ID from profile or token
              tenantId = (profile as any).tid || "";

              // Fetch organization details from Microsoft Graph API
              const graphResponse = await fetch("https://graph.microsoft.com/v1.0/organization", {
                headers: {
                  Authorization: `Bearer ${account.access_token}`,
                },
              });

              if (graphResponse.ok) {
                const graphData = await graphResponse.json();
                const org = graphData.value?.[0];
                if (org?.displayName) {
                  orgName = org.displayName;
                  orgSlug = org.displayName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");
                }
              }
            } catch (error) {
              console.error("Failed to fetch organization from Microsoft Graph:", error);
            }

            // Fallback to domain-based naming if Graph API fails
            if (!orgName && profile.email) {
              const domain = profile.email.split("@")[1];
              orgName = domain
                .split(".")[0]
                .replace(/[-_]/g, " ")
                .split(" ")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
              orgSlug = domain.split(".")[0].toLowerCase();
            }
          }
          // For Google - use domain if not gmail
          else if (account.provider === "google" && profile.email) {
            const domain = profile.email.split("@")[1];
            if (domain !== "gmail.com") {
              orgName = domain
                .split(".")[0]
                .replace(/[-_]/g, " ")
                .split(" ")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
              orgSlug = domain.split(".")[0].toLowerCase();
            } else {
              // Personal Gmail account - create personal org
              orgName = `${user.name || user.email}'s Organization`;
              orgSlug = (user.name || user.email || "user")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            }
          }
          // For other providers - create personal org
          else {
            orgName = `${user.name || user.email}'s Organization`;
            orgSlug = (user.name || user.email || "user")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
          }

          // Check if organization already exists (for company domains)
          const existingOrg = await prisma.organization.findUnique({
            where: { slug: orgSlug },
          });

          if (existingOrg) {
            // Join existing organization
            await prisma.organizationMember.create({
              data: {
                organizationId: existingOrg.id,
                userId: user.id,
                role: "MEMBER",
              },
            });
          } else {
            // Create new organization
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
          }
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database" as const,
  },
} satisfies NextAuthConfig;
