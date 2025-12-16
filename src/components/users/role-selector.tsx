"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface RoleSelectorProps {
  currentRole: string;
  availableRoles: Array<{ value: string; label: string; description?: string }>;
  onRoleChange: (newRole: string) => Promise<void>;
  disabled?: boolean;
  type: "org" | "system";
}

export function RoleSelector({
  currentRole,
  availableRoles,
  onRoleChange,
  disabled = false,
  type,
}: RoleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole || loading) return;

    setLoading(true);
    try {
      await onRoleChange(newRole);
      setIsOpen(false);
    } catch (error) {
      console.error("Error changing role:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentRoleData = availableRoles.find((r) => r.value === currentRole);

  const getRoleBadgeColor = (role: string) => {
    if (type === "org") {
      switch (role) {
        case "OWNER":
          return "bg-purple-100 text-purple-700 border-purple-200";
        case "ADMIN":
          return "bg-blue-100 text-blue-700 border-blue-200";
        case "MANAGER":
          return "bg-green-100 text-green-700 border-green-200";
        case "MEMBER":
          return "bg-slate-100 text-slate-700 border-slate-200";
        case "VIEWER":
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
        default:
          return "bg-slate-100 text-slate-700 border-slate-200";
      }
    } else {
      // System roles
      switch (role) {
        case "SUPER_ADMIN":
          return "bg-red-100 text-red-700 border-red-200";
        case "ADMIN":
          return "bg-blue-100 text-blue-700 border-blue-200";
        case "MANAGER":
          return "bg-green-100 text-green-700 border-green-200";
        case "USER":
          return "bg-slate-100 text-slate-700 border-slate-200";
        case "AUDITOR":
          return "bg-orange-100 text-orange-700 border-orange-200";
        case "VIEWER":
          return "bg-yellow-100 text-yellow-700 border-yellow-200";
        default:
          return "bg-slate-100 text-slate-700 border-slate-200";
      }
    }
  };

  if (disabled) {
    return (
      <span
        className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(
          currentRole
        )}`}
      >
        {currentRoleData?.label || currentRole}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors hover:opacity-80 ${getRoleBadgeColor(
          currentRole
        )} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? "Updating..." : currentRoleData?.label || currentRole}
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-1 w-56 rounded-md border border-slate-200 bg-white shadow-lg">
            <div className="p-1">
              {availableRoles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => handleRoleChange(role.value)}
                  className={`flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-slate-50 ${
                    role.value === currentRole ? "bg-slate-50" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{role.label}</span>
                      {role.value === currentRole && (
                        <Check className="h-3.5 w-3.5 text-blue-600" />
                      )}
                    </div>
                    {role.description && (
                      <p className="mt-0.5 text-xs text-slate-600">
                        {role.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
