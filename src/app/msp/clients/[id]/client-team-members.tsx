"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Crown, Shield, Users } from "lucide-react";
import Link from "next/link";

interface TeamMember {
  id: string;
  role: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface ClientTeamMembersProps {
  clientId: string;
  members: TeamMember[];
  currentUserId: string;
  globalUserRole?: string;
}

export function ClientTeamMembers({
  clientId,
  members,
  currentUserId,
  globalUserRole,
}: ClientTeamMembersProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Global admins can delete anyone in client orgs
  const isGlobalAdmin = globalUserRole === "SUPER_ADMIN";

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

  const handleDelete = async (memberId: string, memberName: string, memberRole: string) => {
    if (
      !confirm(
        `Are you sure you want to remove ${memberName} from this organization? This action cannot be undone.`
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
        `/api/organizations/${clientId}/members/${memberId}`,
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
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
        <Link
          href={`/msp/clients/${clientId}/invite`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Plus className="h-4 w-4" />
          Invite Member
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          const canDeleteThisMember = isGlobalAdmin && !isCurrentUser;

          return (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-4"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {member.user.name?.charAt(0) || member.user.email?.charAt(0) || "?"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {member.user.name || "Unnamed User"}
                    {isCurrentUser && (
                      <span className="ml-1 text-xs text-slate-500">(You)</span>
                    )}
                  </p>
                  {canDeleteThisMember && (
                    <button
                      onClick={() =>
                        handleDelete(
                          member.id,
                          member.user.name || member.user.email || "this user",
                          member.role
                        )
                      }
                      disabled={deletingId === member.id}
                      className="ml-auto text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                      title="Remove user"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-600 truncate">
                  {member.user.email || "No email"}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getRoleIcon(member.role)}
                  <p className="text-xs text-slate-500">{member.role || "MEMBER"}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
