"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, Crown, Shield, Users } from "lucide-react";

type Invitation = {
  id: string;
  email: string;
  role: string;
  createdAt: Date;
  invitedBy: {
    name: string | null;
    email: string | null;
  } | null;
};

type Props = {
  invitations: Invitation[];
};

// Helper functions moved into the client component
const getRoleIcon = (role: string) => {
  switch (role) {
    case "OWNER":
      return <Crown className="h-4 w-4 text-amber-600" />;
    case "ADMIN":
      return <Shield className="h-4 w-4 text-blue-600" />;
    default:
      return <Users className="h-4 w-4 text-slate-600" />;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "OWNER":
      return "bg-amber-100 text-amber-700";
    case "ADMIN":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export function PendingInvitationsCard({ invitations }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async (invitationId: string) => {
    if (!confirm("Are you sure you want to delete this invitation?")) {
      return;
    }

    setDeletingId(invitationId);
    setError("");

    try {
      const response = await fetch(`/api/invitations/${invitationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete invitation");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete invitation");
      console.error("Delete invitation error:", err);
    } finally {
      setDeletingId("");
    }
  };

  if (invitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          Invitations waiting to be accepted
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <Mail className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{invitation.email}</h3>
                  <p className="text-sm text-slate-500">
                    Invited by {invitation.invitedBy?.name || invitation.invitedBy?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(invitation.role)}`}>
                  {getRoleIcon(invitation.role)}
                  {invitation.role}
                </span>
                <span className="text-sm text-slate-500">
                  {new Date(invitation.createdAt).toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(invitation.id)}
                  disabled={deletingId === invitation.id}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
