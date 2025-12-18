import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { DocumentUploadSection } from "@/components/client-portal/document-upload";
import {
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Folder,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { formatDate, formatFileSize } from "@/lib/utils";

export default async function ClientDocumentsPage() {
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
      organization: true,
    },
  });

  if (!membership) {
    redirect("/dashboard");
  }

  const orgId = membership.organizationId;

  // Get projects for this organization first
  const projects = await prisma.project.findMany({
    where: {
      organizationId: orgId,
    },
    select: {
      id: true,
    },
  });

  const projectIds = projects.map((p) => p.id);

  // Get all evidence/documents for these projects
  const documents = await prisma.evidence.findMany({
    where: {
      projectId: {
        in: projectIds,
      },
    },
    include: {
      controlInstance: {
        include: {
          control: {
            select: {
              controlId: true,
              practice: true,
              domain: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get controls that need evidence
  const controlInstances = await prisma.controlInstance.findMany({
    where: {
      projectId: {
        in: projectIds,
      },
      status: {
        not: "COMPLIANT",
      },
    },
    include: {
      control: {
        select: {
          controlId: true,
          practice: true,
          domain: true,
        },
      },
      evidence: true,
    },
    orderBy: {
      control: {
        controlId: "asc",
      },
    },
  });

  const stats = {
    total: documents.length,
    thisMonth: documents.filter(
      (d) =>
        new Date(d.createdAt).getMonth() === new Date().getMonth() &&
        new Date(d.createdAt).getFullYear() === new Date().getFullYear()
    ).length,
    controlsNeedingEvidence: controlInstances.filter((c) => c.evidence.length === 0).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Documents & Evidence</h1>
          <p className="mt-2 text-slate-600">
            Upload and manage compliance documentation
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Documents</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Uploaded This Month</p>
              <p className="text-2xl font-bold text-slate-900">{stats.thisMonth}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-3">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Controls Need Evidence</p>
              <p className="text-2xl font-bold text-slate-900">
                {stats.controlsNeedingEvidence}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <DocumentUploadSection organizationId={orgId} controls={controlInstances} />

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {/* Documents List */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900">All Documents</h2>
        </div>

        {documents.length === 0 ? (
          <div className="p-12 text-center">
            <Folder className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-sm font-medium text-slate-900">No documents yet</h3>
            <p className="mt-2 text-sm text-slate-500">
              Upload your first compliance document to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    File Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Control
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {doc.fileName}
                          </p>
                          {doc.description && (
                            <p className="text-xs text-slate-500 line-clamp-1">
                              {doc.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {doc.controlInstance.control.controlId}
                        </p>
                        <p className="text-xs text-slate-500">
                          {doc.controlInstance.control.domain}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900">
                        {doc.uploadedBy || "Unknown"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {formatDate(doc.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {doc.fileUrl ? (
                          <>
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                            <a
                              href={doc.fileUrl}
                              download
                              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">No file</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
