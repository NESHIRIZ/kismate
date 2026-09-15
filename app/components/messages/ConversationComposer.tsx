"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";

export function ConversationComposer({ conversationId }: { conversationId: number }) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();

    if (!trimmed) {
      setError("Please write a thoughtful message before sending.");
      return;
    }

    setSending(true);
    setError(null);

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed }),
      });

      const data = (await response.json()) as { error?: string; message?: { id: number } };
      if (!response.ok) {
        setError(data.error ?? "Message could not be sent.");
        return;
      }

      setValue("");
      window.location.reload();
    } catch {
      setError("Unable to send right now. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-card p-4 md:p-5">
      <label className="block text-sm font-medium text-foreground" htmlFor="message-body">
        Message
      </label>
      <textarea
        id="message-body"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={2000}
        rows={3}
        placeholder="Say hello and start getting to know each other."
        className="mt-2 w-full rounded-2xl border border-border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">{value.trim().length}/2000</span>
        <Button type="submit" disabled={sending || !value.trim()} size="md">
          {sending ? "Sending..." : "Send message"}
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
