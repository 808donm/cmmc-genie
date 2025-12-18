"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Crown, Shield, Trash2 } from "lucide-react";

interface TeamMember {
  id: string;
  role: string;
  joinedAt: Date;
  userId: string;
  organizationId: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface TeamMembersCardProps {
  members: TeamMember[];
  organizationId: string;
  currentUserId: string;
  currentUserRole: string;
}

export function TeamMembersCard({
  members,
  organizationId,
  currentUserId,
  currentUserRole,
}: TeamMembersCardProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canDelete = currentUserRole === "ADMIN" || currentUserRole === "OWNER";

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

  const handleDelete = async (memberId: string, memberName: string, memberRole: string) => {
    if (
      !confirm(
        `Are you sure you want to remove ${memberName} from the organization? This action cannot be undone.`
      )
    ) {
      return;
    }

    // Additional confirmation for removing owners
    if (memberRole === "OWNER") {
      if (
        !confirm(
          `WARNING: You are about to remove an OWNER. This is a critical action. Are you absolutely sure?`
        )
      ) {
        return;
      }
    }

    setDeletingId(memberId);

    try {
      const response = await fetch(
        `/api/organizations/${organizationId}/members/${memberId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to remove member");
        return;
      }

      // Refresh the page to show updated list
      router.refresh();
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove member. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          All active members of your MSP organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => {
            const isCurrentUser = member.userId === currentUserId;
            const canDeleteThisMember =
              canDelete &&
              !isCurrentUser &&
              !(currentUserRole === "ADMIN" && member.role === "OWNER");

            return (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
              >
                <div className="flex items-center gap-4">
                  {member.user.image ? (
                    <img
                      src={member.user.image}
                      alt={member.user.name || "User"}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                      <Users className="h-5 w-5 text-slate-600" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-slate-900">
                        {member.user.name || "Unnamed User"}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-slate-500">(You)</span>
                        )}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(
                          member.role
                        )}`}
                      >
                        {getRoleIcon(member.role)}
                        {member.role}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm text-slate-500">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </div>
                  {canDeleteThisMember && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDelete(
                          member.id,
                          member.user.name || member.user.email || "this user",
                          member.role
                        )
                      }
                      disabled={deletingId === member.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
