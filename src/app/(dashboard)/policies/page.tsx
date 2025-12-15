import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default async function PoliciesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Get user's organization
  const orgMembership = await prisma.organizationMember.findFirst({
    where: { userId: session.user.id },
    include: { organization: true },
  });

  // Get policies for the organization
  const policies = orgMembership
    ? await prisma.policy.findMany({
        where: { organizationId: orgMembership.organizationId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Policies</h1>
          <p className="mt-2 text-slate-600">
            Manage your organizational policies and documentation
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Policy
        </Button>
      </div>

      {/* Policies list */}
      {policies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No policies yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              Create your first policy or use AI to generate from templates
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Policy
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {policies.map((policy) => (
            <Card key={policy.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{policy.title}</CardTitle>
                    <CardDescription>{policy.description || "No description"}</CardDescription>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      policy.status === "PUBLISHED"
                        ? "bg-green-100 text-green-700"
                        : policy.status === "APPROVED"
                        ? "bg-blue-100 text-blue-700"
                        : policy.status === "PENDING_REVIEW"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {policy.status.replace("_", " ")}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>Version {policy.version}</span>
                  {policy.category && <span>• {policy.category}</span>}
                  {policy.effectiveDate && (
                    <span>
                      • Effective: {new Date(policy.effectiveDate).toLocaleDateString()}
                    </span>
                  )}
                  {policy.aiGenerated && (
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                      AI Generated
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
