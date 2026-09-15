"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { KismateLogo } from "@/app/components/branding/KismateLogo";

type SessionUser = {
  id: number;
  name: string;
  email: string;
};

function getDashboardHref(role: string | null) {
  return role === "organizer" || role === "attendee"
    ? `/dashboard?role=${role}`
    : "/dashboard";
}

export function SigninClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  const showRegisteredNotice = searchParams.get("registered") === "1";

  useEffect(() => {
    fetch("/api/auth/session")
      .then((response) => {
        if (!response.ok) throw new Error("No session");
        return response.json() as Promise<{ user: SessionUser }>;
      })
      .then((data) => setSessionUser(data.user))
      .catch(() => setSessionUser(null));
  }, []);

  useEffect(() => {
    if (!sessionUser) return;
    router.refresh();
    router.replace(getDashboardHref(searchParams.get("role")));
  }, [router, searchParams, sessionUser]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as {
      message?: string;
      user?: SessionUser;
    };

    if (!response.ok) {
      setError(data.message ?? "Login failed.");
      setSubmitting(false);
      return;
    }

    setSessionUser(data.user ?? null);
    form.reset();
    setSubmitting(false);
    setMessage(null);
    router.refresh();
    router.push(getDashboardHref(searchParams.get("role")));
  }

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-border bg-card p-6 shadow-[0_20px_55px_rgba(30,42,56,0.08)] md:p-8">
      <div className="flex justify-center">
        <KismateLogo variant="full" color="brand" className="text-foreground" />
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to continue your journey.</p>
      </div>

      {showRegisteredNotice ? (
        <p className="mt-5 rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
          Account created. Please sign in.
        </p>
      ) : null}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Email</span>
          <input
            type="email"
            name="email"
            required
            className="h-12 w-full rounded-2xl border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="you@example.com"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Password</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              className="h-12 w-full rounded-2xl border border-border bg-background px-3.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_16px_40px_rgba(180,111,93,0.2)] transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {sessionUser ? (
        <p className="mt-4 rounded-2xl bg-blue-500/10 px-3 py-2 text-sm text-blue-700">
          Signed in as {sessionUser.name} ({sessionUser.email}).
        </p>
      ) : null}

      {message ? (
        <p className="mt-4 rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">{message}</p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-2xl bg-red-500/10 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Need an account? <Link href="/signup" className="font-medium text-primary">Create one</Link>
      </p>
    </div>
  );
}
