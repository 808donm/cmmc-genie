"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, UserPlus, Mail, Trash2, Copy, ChevronDown } from "lucide-react";
import Link from "next/link";

type Organization = {
  id: string;
  name: string;
};

type Invitation = {
  id: string;
  email: string;
  role: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  invitedBy: {
    name: string | null;
    email: string | null;
  } | null;
};

type Props = {
  organization: Organization;
  pendingInvitations: Invitation[];
  currentUserRole: string;
  backUrl?: string;
};

const ROLE_OPTIONS = [
  { value: "MEMBER", label: "Member", description: "Can view and participate" },
  { value: "MANAGER", label: "Manager", description: "Can manage projects and tasks" },
  { value: "ADMIN", label: "Admin", description: "Can manage team and settings" },
];

export function InviteTeamMemberClient({ organization, pendingInvitations, currentUserRole, backUrl = "/settings/team" }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedToken, setCopiedToken] = useState("");

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          organizationId: organization.id,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation");
      }

      setSuccess(`Invitation sent to ${email}`);
      setEmail("");

      // Refresh the page to show new invitation
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = (token: string, inviteEmail: string) => {
    const inviteLink = `${window.location.origin}/auth/signin?invitation=${token}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(""), 2000);
  };

  const selectedRoleLabel = ROLE_OPTIONS.find((r) => r.value === role)?.label || "Select role";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href={backUrl}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invite Team Member</h1>
          <p className="mt-2 text-slate-600">
            Invite someone to join {organization.name}
          </p>
        </div>
      </div>

      {/* Invite Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send Invitation</CardTitle>
          <CardDescription>
            Enter the email address and role for the new team member
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600">
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-900">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-slate-900">
                Role
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedRoleLabel}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {ROLE_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setRole(option.value)}
                    >
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-slate-500">{option.description}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <UserPlus className="mr-2 h-4 w-4" />
                {loading ? "Sending..." : "Send Invitation"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={backUrl}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>
              Invitations waiting to be accepted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvitations.map((invitation) => (
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
                        Role: {invitation.role} • Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyInviteLink(invitation.token, invitation.email)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copiedToken === invitation.token ? "Copied!" : "Copy Link"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
