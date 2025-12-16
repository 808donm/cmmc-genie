import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { DisconnectGHLButton } from "@/components/integrations/disconnect-ghl-button";

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: { success?: string; error?: string; message?: string };
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get user's organization memberships (admin/owner only)
  const memberships = await prisma.organizationMember.findMany({
    where: {
      userId: session.user.id,
      role: {
        in: ["OWNER", "ADMIN"],
      },
    },
    include: {
      organization: {
        include: {
          ghlIntegration: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Integrations</h1>
        <p className="mt-2 text-slate-600">
          Connect external services to enhance CMMC Genie functionality
        </p>
      </div>

      {/* Success/Error Messages */}
      {searchParams.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-sm font-medium text-green-900">
              {searchParams.message || "Operation completed successfully"}
            </p>
          </div>
        </div>
      )}

      {searchParams.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-900">
                {searchParams.message || "An error occurred"}
              </p>
              <p className="mt-1 text-xs text-red-700">
                Error code: {searchParams.error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Integrations List */}
      <div className="space-y-4">
        {/* GoHighLevel Integration */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* GoHighLevel Logo/Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-sm font-bold text-white">HL</span>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  GoHighLevel
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Send emails, SMS, and manage communications through your
                  GoHighLevel account
                </p>

                {/* Features List */}
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Email & SMS notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Contact synchronization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Communication tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Engagement analytics
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Organization Connections */}
          <div className="mt-6 space-y-4">
            {memberships.length === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <p className="text-sm text-amber-900">
                    You need to be an admin or owner of an organization to
                    connect integrations
                  </p>
                </div>
              </div>
            ) : (
              memberships.map((membership) => {
                const integration = membership.organization.ghlIntegration;
                const isConnected = integration && integration.isActive;

                return (
                  <div
                    key={membership.organizationId}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-slate-900">
                            {membership.organization.name}
                          </h3>
                          {isConnected ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                              <CheckCircle2 className="h-3 w-3" />
                              Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                              <XCircle className="h-3 w-3" />
                              Not Connected
                            </span>
                          )}
                        </div>

                        {isConnected && integration && (
                          <div className="mt-2 space-y-1 text-xs text-slate-600">
                            <p>
                              <span className="font-medium">Location:</span>{" "}
                              {integration.ghlLocationName || integration.ghlLocationId}
                            </p>
                            <p>
                              <span className="font-medium">Connected:</span>{" "}
                              {new Date(integration.connectedAt).toLocaleDateString()}
                            </p>
                            {integration.lastSyncedAt && (
                              <p>
                                <span className="font-medium">Last Synced:</span>{" "}
                                {new Date(integration.lastSyncedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}

                        {isConnected && integration?.syncError && (
                          <div className="mt-2 rounded bg-red-50 p-2">
                            <p className="text-xs text-red-700">
                              <span className="font-medium">Sync Error:</span>{" "}
                              {integration.syncError}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isConnected ? (
                          <>
                            <Link
                              href="/communications"
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                              View Communications
                            </Link>
                            <DisconnectGHLButton
                              organizationId={membership.organizationId}
                            />
                          </>
                        ) : (
                          <Link
                            href={`/api/integrations/crm/authorize?organizationId=${membership.organizationId}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-purple-700"
                          >
                            Connect GoHighLevel
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Setup Instructions */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">
              Setup Instructions
            </summary>
            <div className="mt-4 space-y-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-medium text-slate-900">
                To connect GoHighLevel:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Click the &ldquo;Connect GoHighLevel&rdquo; button for your organization
                </li>
                <li>You&apos;ll be redirected to GoHighLevel&apos;s authorization page</li>
                <li>Select the location you want to connect</li>
                <li>
                  Authorize CMMC Genie to access your GHL account
                </li>
                <li>
                  You&apos;ll be redirected back here with a success message
                </li>
              </ol>
              <p className="mt-4 text-xs text-slate-500">
                <span className="font-medium">Note:</span> You&apos;ll need to have
                a GoHighLevel account and the necessary permissions to authorize
                third-party applications.
              </p>
            </div>
          </details>
        </div>

        {/* Future Integrations Placeholder */}
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-600">
              More integrations coming soon
            </p>
            <p className="mt-1 text-xs text-slate-500">
              SendGrid, Slack, Microsoft Teams, and more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
