"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

interface DisconnectGHLButtonProps {
  organizationId: string;
}

export function DisconnectGHLButton({ organizationId }: DisconnectGHLButtonProps) {
  const router = useRouter();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);

    try {
      const response = await fetch("/api/ghl/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizationId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to disconnect");
      }

      // Redirect with success message
      router.push(
        "/settings/integrations?success=true&message=GHL+disconnected+successfully"
      );
      router.refresh();
    } catch (error) {
      console.error("Error disconnecting GHL:", error);
      router.push(
        `/settings/integrations?error=disconnect_failed&message=${encodeURIComponent(
          error instanceof Error ? error.message : "Unknown error"
        )}`
      );
    } finally {
      setIsDisconnecting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isDisconnecting}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDisconnect}
          disabled={isDisconnecting}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isDisconnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Disconnecting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Confirm Disconnect
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
      Disconnect
    </button>
  );
}
