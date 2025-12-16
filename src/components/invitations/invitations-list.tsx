"use client";

import { Mail, CheckCircle2, XCircle, Clock, Ban } from "lucide-react";

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: Date;
  createdAt: Date;
  acceptedAt?: Date | null;
  organization: {
    id: string;
    name: string;
    type: "MSP" | "CLIENT";
  };
  invitedBy: {
    name?: string | null;
    email?: string | null;
  };
}

interface InvitationsListProps {
  invitations: Invitation[];
}

export function InvitationsList({ invitations }: InvitationsListProps) {
  if (invitations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Mail className="h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">No invitations yet</h3>
        <p className="mt-2 text-sm text-slate-600">
          Send your first invitation to add users to your organization
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "EXPIRED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "CANCELLED":
        return <Ban className="h-4 w-4 text-slate-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "EXPIRED":
        return "bg-red-100 text-red-700";
      case "CANCELLED":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => {
        const isExpired = new Date(invitation.expiresAt) < new Date();
        const daysUntilExpiry = Math.ceil(
          (new Date(invitation.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        return (
          <div
            key={invitation.id}
            className="flex items-start justify-between rounded-lg border border-slate-200 p-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-900">{invitation.email}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                    invitation.status
                  )}`}
                >
                  {getStatusIcon(invitation.status)}
                  {invitation.status}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                <span>{invitation.organization.name}</span>
                <span>•</span>
                <span>Role: {invitation.role}</span>
                {invitation.status === "PENDING" && !isExpired && (
                  <>
                    <span>•</span>
                    <span>
                      Expires in {daysUntilExpiry} {daysUntilExpiry === 1 ? "day" : "days"}
                    </span>
                  </>
                )}
                {invitation.status === "ACCEPTED" && invitation.acceptedAt && (
                  <>
                    <span>•</span>
                    <span>
                      Accepted on {new Date(invitation.acceptedAt).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Invited by {invitation.invitedBy.name || invitation.invitedBy.email} on{" "}
                {new Date(invitation.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
