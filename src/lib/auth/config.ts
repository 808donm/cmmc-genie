import { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const authConfig = {
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
        },
      },
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || "common"}/v2.0`,
    }),
    // Zoom OAuth provider (custom configuration)
    {
      id: "zoom",
      name: "Zoom",
      type: "oauth",
      authorization: {
        url: "https://zoom.us/oauth/authorize",
        params: { scope: "user:read" },
      },
      token: "https://zoom.us/oauth/token",
      userinfo: "https://api.zoom.us/v2/users/me",
      clientId: process.env.ZOOM_CLIENT_ID || "",
      clientSecret: process.env.ZOOM_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.id,
          name: `${profile.first_name} ${profile.last_name}`,
          email: profile.email,
          image: profile.pic_url,
        };
      },
    },
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Get user's organization memberships
        const memberships = await prisma.organizationMember.findMany({
          where: { userId: user.id },
          include: {
            organization: true,
          },
        });

        session.user.organizations = memberships.map((m) => ({
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
    async signIn({ user, account }) {
      // Allow sign-in - the adapter will handle user creation
      if (!user.email) {
        return false;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // After first sign-in, create organization if it doesn't exist
      if (user && account) {
        const existingOrg = await prisma.organizationMember.findFirst({
          where: { userId: user.id },
        });

        if (!existingOrg) {
          // Create personal organization with slug
          const baseSlug = (user.name || user.email || "user")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          const slug = `${baseSlug}-${Date.now()}`;

          await prisma.organization.create({
            data: {
              name: `${user.name || user.email}'s Organization`,
              slug,
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
