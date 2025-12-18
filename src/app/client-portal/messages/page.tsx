import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { MessageList } from "@/components/client-portal/message-list";
import {
  MessageSquare,
  Inbox,
  Send,
  Archive,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default async function ClientMessagesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get client organization
  const membership = await prisma.organizationMember.findFirst({
    where: {
      userId: session.user.id,
      organization: {
        type: "CLIENT",
      },
    },
    include: {
      organization: {
        include: {
          parentOrganization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!membership) {
    redirect("/dashboard");
  }

  const orgId = membership.organizationId;

  // Get messages for this organization
  const messages = await prisma.gHLCommunication.findMany({
    where: {
      organizationId: orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  // Get notification stats
  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
      organizationId: orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  const stats = {
    totalMessages: messages.length,
    unreadNotifications: notifications.filter((n) => !n.read).length,
    thisWeek: messages.filter(
      (m) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(m.createdAt) > weekAgo;
      }
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
          <p className="mt-2 text-slate-600">
            Communication with your MSP{" "}
            {membership.organization.parentOrganization && (
              <span className="font-medium">
                ({membership.organization.parentOrganization.name})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Messages</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalMessages}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-3">
              <Inbox className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Unread Notifications</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.unreadNotifications}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">This Week</p>
              <p className="text-2xl font-bold text-slate-900">{stats.thisWeek}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Notifications Panel */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-4">
              <h2 className="font-semibold text-slate-900">Recent Notifications</h2>
            </div>
            <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />
                  <p className="mt-2 text-sm text-slate-600">All caught up!</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const getIcon = (type: string) => {
                    switch (type) {
                      case "TASK_ASSIGNED":
                      case "TASK_COMPLETED":
                        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
                      case "APPROVAL_NEEDED":
                        return <AlertCircle className="h-4 w-4 text-amber-600" />;
                      case "DEADLINE_APPROACHING":
                        return <AlertCircle className="h-4 w-4 text-red-600" />;
                      default:
                        return <MessageSquare className="h-4 w-4 text-blue-600" />;
                    }
                  };

                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 rounded-full p-2 ${
                            !notification.read ? "bg-blue-100" : "bg-slate-100"
                          }`}
                        >
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs text-slate-500">
                            {formatDateTime(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Messages Panel */}
        <div className="lg:col-span-2">
          <MessageList
            messages={messages}
            organizationId={orgId}
            userId={session.user.id}
          />
        </div>
      </div>
    </div>
  );
}
