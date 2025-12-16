import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      organizations?: {
        id: string;
        name: string;
        role: string;
      }[];
      activeOrganization?: string;
    } & DefaultSession["user"];
  }
}
