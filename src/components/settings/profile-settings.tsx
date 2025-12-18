"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Loader2 } from "lucide-react";

interface ProfileSettingsProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    position?: string | null;
  };
  orgRole?: string;
}

export function ProfileSettings({ user, orgRole }: ProfileSettingsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isOnboarding = searchParams.get("onboarding") === "true";

  const [isEditing, setIsEditing] = useState(isOnboarding);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [position, setPosition] = useState(user.position || "");
  const [error, setError] = useState("");

  // Auto-edit mode for onboarding
  useEffect(() => {
    if (isOnboarding) {
      setIsEditing(true);
    }
  }, [isOnboarding]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          position: position.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      setIsEditing(false);

      // If onboarding, redirect to dashboard
      if (isOnboarding) {
        router.push("/dashboard");
        router.refresh();
      } else {
        // Just refresh the page to show updated data
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user.name || "");
    setPosition(user.position || "");
    setError("");

    // If onboarding, don't allow cancel - they must complete profile
    if (!isOnboarding) {
      setIsEditing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          <CardTitle>
            {isOnboarding ? "Complete Your Profile" : "Profile Settings"}
          </CardTitle>
        </div>
        <CardDescription>
          {isOnboarding
            ? "Please provide your information to get started"
            : "Manage your personal information and preferences"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {isOnboarding && (
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                Welcome! Please complete your profile to continue.
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium text-slate-700">
                  Position / Title
                </label>
                <Input
                  id="position"
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Security Manager"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="bg-slate-50"
                />
                <p className="text-xs text-slate-500">Email cannot be changed</p>
              </div>

              {orgRole && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Organization Role</label>
                  <Input
                    type="text"
                    value={orgRole}
                    disabled
                    className="bg-slate-50"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isOnboarding ? "Complete Profile" : "Save Changes"}
              </Button>
              {!isOnboarding && (
                <Button onClick={handleCancel} variant="outline" disabled={loading}>
                  Cancel
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <p className="mt-1 text-sm text-slate-900">{user.name || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Position</label>
                <p className="mt-1 text-sm text-slate-900">{user.position || "Not set"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Email</label>
                <p className="mt-1 text-sm text-slate-900">{user.email || "Not set"}</p>
              </div>
              {orgRole && (
                <div>
                  <label className="text-sm font-medium text-slate-700">Organization Role</label>
                  <p className="mt-1 text-sm text-slate-900">{orgRole}</p>
                </div>
              )}
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
