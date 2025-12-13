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
      wellKnown: "https://zoom.us/.well-known/openid-configuration",
      authorization: {
        params: { scope: "openid profile email" },
      },
      clientId: process.env.ZOOM_CLIENT_ID || "",
      clientSecret: process.env.ZOOM_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
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
      if (!user.email) {
        return false;
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      // If new user, create a personal organization
      if (!existingUser && account) {
        const newUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });

        // Create personal organization
        const org = await prisma.organization.create({
          data: {
            name: `${user.name || user.email}'s Organization`,
            members: {
              create: {
                userId: newUser.id,
                role: "ADMIN",
              },
            },
          },
        });
      }

      return true;
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
