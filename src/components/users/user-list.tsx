"use client";

import { useState } from "react";
import { RoleSelector } from "./role-selector";
import { User, Mail, Building2, Calendar, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  createdAt: Date;
  organizationMember: Array<{
    role: string;
    organization: {
      id: string;
      name: string;
      type: "MSP" | "CLIENT";
    };
  }>;
}

interface UserListProps {
  users: UserData[];
  isMspAdmin: boolean;
  currentUserId: string;
}

const ORG_ROLES = [
  { value: "OWNER", label: "Owner", description: "Full access and billing control" },
  { value: "ADMIN", label: "Admin", description: "Manage users and settings" },
  { value: "MANAGER", label: "Manager", description: "Manage compliance tasks" },
  { value: "MEMBER", label: "Member", description: "Standard access" },
  { value: "VIEWER", label: "Viewer", description: "Read-only access" },
];

const SYSTEM_ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin", description: "Full system access" },
  { value: "ADMIN", label: "Admin", description: "Administrative access" },
  { value: "MANAGER", label: "Manager", description: "Management access" },
  { value: "USER", label: "User", description: "Standard user" },
  { value: "AUDITOR", label: "Auditor", description: "Audit and compliance review" },
  { value: "VIEWER", label: "Viewer", description: "Read-only access" },
];

export function UserList({ users, isMspAdmin, currentUserId }: UserListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const handleOrgRoleChange = async (
    userId: string,
    organizationId: string,
    newRole: string
  ) => {
    setUpdating(userId);
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId,
          orgRole: newRole,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update role");
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating role:", error);
      alert(error instanceof Error ? error.message : "Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  const handleSystemRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    try {
      const response = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userRole: newRole,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update role");
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating role:", error);
      alert(error instanceof Error ? error.message : "Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.organizationMember.some((m) =>
        m.organization.name.toLowerCase().includes(search)
      )
    );
  });

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User className="h-12 w-12 text-slate-400" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">No users found</h3>
        <p className="mt-2 text-sm text-slate-600">
          Users will appear here once they join the organization
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search users by name, email, or organization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Users list */}
      <div className="space-y-3">
        {filteredUsers.map((user) => {
          const isCurrentUser = user.id === currentUserId;

          return (
            <div
              key={user.id}
              className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* User info */}
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {user.name || "Unnamed User"}
                        </h3>
                        {isCurrentUser && (
                          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                            You
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* System role (only for MSP admins) */}
                  {isMspAdmin && (
                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                      <span className="text-xs font-medium text-slate-700">
                        System Role:
                      </span>
                      <RoleSelector
                        currentRole={user.role}
                        availableRoles={SYSTEM_ROLES}
                        onRoleChange={(newRole) => handleSystemRoleChange(user.id, newRole)}
                        disabled={updating === user.id || isCurrentUser}
                        type="system"
                      />
                    </div>
                  )}

                  {/* Organization roles */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-xs font-medium text-slate-700">
                      Organization Roles:
                    </span>
                    <div className="space-y-2">
                      {user.organizationMember.map((membership) => (
                        <div
                          key={membership.organization.id}
                          className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-900">
                              {membership.organization.name}
                            </span>
                            {membership.organization.type === "MSP" && (
                              <span className="rounded-md bg-purple-100 px-1.5 py-0.5 text-xs font-medium text-purple-700">
                                MSP
                              </span>
                            )}
                          </div>
                          <RoleSelector
                            currentRole={membership.role}
                            availableRoles={ORG_ROLES}
                            onRoleChange={(newRole) =>
                              handleOrgRoleChange(
                                user.id,
                                membership.organization.id,
                                newRole
                              )
                            }
                            disabled={updating === user.id}
                            type="org"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && searchTerm && (
        <div className="py-12 text-center">
          <p className="text-sm text-slate-600">
            No users found matching &quot;{searchTerm}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
