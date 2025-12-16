"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function acceptInvitation() {
      if (!token) {
        setStatus("error");
        setMessage("No invitation token provided");
        return;
      }

      try {
        const response = await fetch(`/api/invitations/${token}/accept`, {
          method: "POST",
        });

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Successfully accepted invitation!");

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to accept invitation");
        }
      } catch (error) {
        console.error("Error accepting invitation:", error);
        setStatus("error");
        setMessage("An error occurred while accepting the invitation");
      }
    }

    acceptInvitation();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {status === "loading" && "Accepting Invitation..."}
              {status === "success" && "Invitation Accepted!"}
              {status === "error" && "Error"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6">
              {status === "loading" && (
                <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              )}
              {status === "success" && (
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              )}
              {status === "error" && <XCircle className="h-16 w-16 text-red-600" />}

              <p className="mt-4 text-center text-slate-700">{message}</p>

              {status === "success" && (
                <p className="mt-2 text-sm text-slate-500">
                  Redirecting to dashboard...
                </p>
              )}
            </div>

            {status === "error" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/auth/signin")}
                >
                  Back to Sign In
                </Button>
                <Button className="flex-1" onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
