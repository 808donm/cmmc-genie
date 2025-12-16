import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { shouldShowMspDashboard } from "@/lib/msp/utils";
import { MspNav } from "@/components/layout/msp-nav";
import { UserMenu } from "@/components/layout/user-menu";
import Image from "next/image";

export default async function MspLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  // Check if user should see MSP dashboard
  const isMsp = await shouldShowMspDashboard(session.user.id);

  if (!isMsp) {
    // Redirect client users to regular dashboard
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center border-b border-slate-200 py-4">
            <Image
              src="/logo.png"
              alt="CMMC Genie"
              width={150}
              height={150}
              className="rounded-xl"
            />
            <div className="mt-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              MSP Portal
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <MspNav />
          </div>

          {/* Organization info */}
          <div className="border-t border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-700">
              {session.user.organizations?.[0]?.name || "MSP Organization"}
            </p>
            <p className="text-xs text-slate-500">MSP Account</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-slate-900">
                MSP Portal
              </h1>
            </div>
            <UserMenu user={session.user} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
