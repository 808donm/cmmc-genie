"use client";

import { useState } from "react";
import { Send, MessageSquare, Calendar } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

type Message = {
  id: string;
  type: string;
  content: string | null;
  direction: string | null;
  createdAt: Date;
};

type MessageListProps = {
  messages: Message[];
  organizationId: string;
  userId: string;
};

export function MessageList({ messages, organizationId, userId }: MessageListProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      // TODO: Implement actual message sending
      // await fetch("/api/messages", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     organizationId,
      //     content: newMessage,
      //   }),
      // });

      alert("Message sending requires GHL integration configuration");
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <h2 className="font-semibold text-slate-900">Communication History</h2>
      </div>

      {/* Messages List */}
      <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-sm font-medium text-slate-900">
              No messages yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Start a conversation with your MSP below
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isInbound = message.direction === "inbound";

            return (
              <div
                key={message.id}
                className={`flex ${isInbound ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    isInbound
                      ? "bg-slate-100 text-slate-900"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {isInbound ? "MSP" : "You"}
                    </span>
                    <span
                      className={`text-xs ${
                        isInbound ? "text-slate-500" : "text-blue-100"
                      }`}
                    >
                      {formatDateTime(message.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content || "(No content)"}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs opacity-75">
                    <Calendar className="h-3 w-3" />
                    <span className="capitalize">{message.type.toLowerCase()}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Message Form */}
      <div className="border-t border-slate-200 p-4">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message to your MSP..."
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Messages are sent to your MSP team
            </p>
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
