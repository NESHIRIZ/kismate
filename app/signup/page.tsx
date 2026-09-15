"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { KismateLogo } from "@/app/components/branding/KismateLogo";
import { Container } from "../components/container";

export default function SignupPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    const role = String(formData.get("role") ?? "attendee");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setError(data.message ?? "Registration failed.");
      setSubmitting(false);
      return;
    }

    form.reset();
    setSubmitting(false);
    setMessage(null);
    router.push(`/signin?registered=1&role=${encodeURIComponent(role)}`);
  }

  return (
    <main className="py-14 md:py-20">
      <Container>
        <div className="mx-auto max-w-xl rounded-[2rem] border border-border bg-card p-6 shadow-[0_20px_55px_rgba(30,42,56,0.08)] md:p-8">
          <div className="flex justify-center">
            <KismateLogo variant="full" color="brand" className="text-foreground" />
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Create your profile</h1>
            <p className="mt-2 text-sm text-muted-foreground">Find people who genuinely match your values and intentions.</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Full name</span>
              <input
                name="name"
                required
                className="h-12 w-full rounded-2xl border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Your name"
              />
            </label>

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
                  minLength={8}
                  required
                  className="h-12 w-full rounded-2xl border border-border bg-background px-3.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="At least 8 characters"
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
              <span className="text-xs text-muted-foreground">Minimum 8 characters.</span>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Looking for</span>
              <select
                name="role"
                defaultValue="attendee"
                className="h-12 w-full rounded-2xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="attendee">A serious connection</option>
                <option value="organizer">A meaningful relationship</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_16px_40px_rgba(180,111,93,0.2)] transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          {message ? (
            <p className="mt-4 rounded-2xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">{message}</p>
          ) : null}

          {error ? (
            <p className="mt-4 rounded-2xl bg-red-500/10 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/signin" className="font-medium text-primary">Sign in</Link>
          </p>
        </div>
      </Container>
    </main>
  );
}
