import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  FileText,
  MessageSquare,
  ShieldCheck,
  Bell,
  User,
  LogOut,
  Menu,
} from "lucide-react";

export default async function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get user's organization (client organization)
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organization: {
        type: "CLIENT", // Only CLIENT orgs in client portal
      },
    },
    include: {
      organization: true,
    },
  });

  if (!membership) {
    // User doesn't have access to a client organization
    // Redirect to main dashboard or show error
    redirect("/dashboard");
  }

  const organization = membership.organization;

  // Get unread notifications count
  const unreadCount = await prisma.notification.count({
    where: {
      userId: session.user.id,
      read: false,
    },
  });

  const navItems = [
    {
      name: "Dashboard",
      href: "/client-portal/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Projects",
      href: "/client-portal/projects",
      icon: FolderKanban,
    },
    {
      name: "Tasks",
      href: "/client-portal/tasks",
      icon: CheckSquare,
    },
    {
      name: "Documents",
      href: "/client-portal/documents",
      icon: FileText,
    },
    {
      name: "Messages",
      href: "/client-portal/messages",
      icon: MessageSquare,
    },
    {
      name: "Compliance",
      href: "/client-portal/compliance",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo and Organization Name */}
          <div className="flex items-center gap-4">
            <Link href="/client-portal/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                {organization.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-900">
                  {organization.name}
                </h1>
                <p className="text-xs text-slate-500">Client Portal</p>
              </div>
            </Link>
          </div>

          {/* Right Side - Notifications & User */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link
              href="/client-portal/notifications"
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-slate-900">{session.user.name || session.user.email}</div>
                <div className="text-xs text-slate-500 capitalize">{membership.role.toLowerCase()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="border-t border-slate-200 bg-white px-6">
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-slate-600 hover:border-blue-500 hover:text-blue-600"
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
