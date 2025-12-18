import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectRequestForm } from "@/components/client-portal/project-request-form";
import { FolderKanban, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProjectPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Get client organization and check if user is admin
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

  // Check if user has permission to create projects (ADMIN or OWNER)
  const canCreateProjects = ["ADMIN", "OWNER"].includes(membership.role);

  if (!canCreateProjects) {
    redirect("/client-portal/projects");
  }

  const orgId = membership.organizationId;
  const mspOrgId = membership.organization.parentOrganizationId;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Link
          href="/client-portal/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3">
            <FolderKanban className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Request New Project</h1>
            <p className="mt-1 text-slate-600">
              Submit a project request to your MSP
              {membership.organization.parentOrganization && (
                <span className="font-medium">
                  {" "}({membership.organization.parentOrganization.name})
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Project Request Form */}
      <ProjectRequestForm
        organizationId={orgId}
        mspOrganizationId={mspOrgId}
        userId={session.user.id}
      />
    </div>
  );
}
