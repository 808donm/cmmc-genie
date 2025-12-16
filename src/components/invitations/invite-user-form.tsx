"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Copy, Check } from "lucide-react";

interface InviteUserFormProps {
  organizations: Array<{
    id: string;
    name: string;
    type: "MSP" | "CLIENT";
  }>;
}

export function InviteUserForm({ organizations }: InviteUserFormProps) {
  const [email, setEmail] = useState("");
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || "");
  const [role, setRole] = useState<"MEMBER" | "ADMIN">("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    setInviteLink("");

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          organizationId,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setInviteLink(data.invitation.inviteLink);
        setEmail("");
        // Show success message for 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to send invitation");
      }
    } catch (err) {
      setError("An error occurred while sending the invitation");
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label htmlFor="organization" className="text-sm font-medium text-slate-700">
              Organization
            </label>
            <select
              id="organization"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} {org.type === "MSP" ? "(MSP)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="role" className="text-sm font-medium text-slate-700">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "MEMBER" | "ADMIN")}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              disabled={loading || !email || !organizationId}
              className="w-full"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && inviteLink && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-900">
            Invitation sent successfully!
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 rounded-md border border-green-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyInviteLink}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-green-700">
            Share this link with the user to join the organization
          </p>
        </div>
      )}
    </div>
  );
}
