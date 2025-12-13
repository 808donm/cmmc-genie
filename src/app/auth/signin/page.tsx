import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { SignInForm } from "@/components/auth/signin-form";
import Image from "next/image";

export default async function SignInPage() {
  const session = await auth();

  // If already authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard");
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
            Your AI-powered compliance companion
          </p>
        </div>

        {/* Sign In Form */}
        <SignInForm />

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
