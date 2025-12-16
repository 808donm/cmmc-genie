import { SignInForm } from "@/components/auth/signin-form";
import { InvitationBanner } from "@/components/auth/invitation-banner";
import Image from "next/image";

interface SignInPageProps {
  searchParams: { invitation?: string };
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const invitationToken = searchParams.invitation;
  let invitationData = null;

  // Fetch invitation details if token is present
  if (invitationToken) {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/invitations/${invitationToken}`,
        {
          cache: "no-store",
        }
      );

      if (response.ok) {
        const data = await response.json();
        invitationData = data.invitation;
      }
    } catch (error) {
      console.error("Failed to fetch invitation:", error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md px-6">
        {/* Logo and Header */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/logo.png"
              alt="CMMC Genie Logo"
              width={120}
              height={120}
              priority
              className="rounded-2xl shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            CMMC Genie
          </h1>
          <p className="text-lg text-slate-600">
            {invitationData
              ? "Sign in to accept your invitation"
              : "Your AI-powered compliance companion"}
          </p>
        </div>

        {/* Invitation Banner */}
        {invitationData && (
          <InvitationBanner
            invitation={invitationData}
            token={invitationToken!}
          />
        )}

        {/* Sign In Form */}
        <SignInForm invitationToken={invitationToken} />

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Track your CMMC compliance journey with AI-powered insights
          </p>
        </div>
      </div>
    </div>
  );
}
