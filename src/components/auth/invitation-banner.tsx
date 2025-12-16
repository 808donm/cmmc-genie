"use client";

import { Building2, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvitationBannerProps {
  invitation: {
    email: string;
    role: string;
    expiresAt: string;
    organization: {
      name: string;
      description?: string;
    };
    invitedBy: {
      name?: string;
      email?: string;
    };
  };
  token: string;
}

export function InvitationBanner({ invitation }: InvitationBannerProps) {
  const expiryDate = new Date(invitation.expiresAt);
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-blue-600" />
          You&apos;ve Been Invited!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-sm font-medium text-slate-900">
            {invitation.invitedBy.name || invitation.invitedBy.email} has invited you to join:
          </p>
          <p className="mt-1 text-lg font-semibold text-blue-900">
            {invitation.organization.name}
          </p>
          {invitation.organization.description && (
            <p className="mt-1 text-sm text-slate-600">
              {invitation.organization.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-slate-600">Role</p>
              <p className="font-medium text-slate-900">{invitation.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-slate-600">Expires</p>
              <p className="font-medium text-slate-900">
                {daysUntilExpiry > 0
                  ? `in ${daysUntilExpiry} ${daysUntilExpiry === 1 ? "day" : "days"}`
                  : "Soon"}
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600">
          Sign in with <span className="font-medium">{invitation.email}</span> to accept this
          invitation
        </p>
      </CardContent>
    </Card>
  );
}
