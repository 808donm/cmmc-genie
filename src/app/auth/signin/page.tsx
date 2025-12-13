import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { SignInForm } from "@/components/auth/signin-form";

export default async function SignInPage() {
  const session = await auth();

  // If already authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">CMMC Genie</h1>
          <p className="mt-2 text-slate-600">
            Track your CMMC compliance journey
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
