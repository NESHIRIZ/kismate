"use client";

import { useEffect, useState } from "react";
import { DiscoverCard } from "@/app/components/discovery/DiscoverCard";
import type { PublicProfileSummary } from "@/lib/services/publicProfileService";

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<PublicProfileSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfiles() {
      setLoading(true);
      try {
        const response = await fetch("/api/discover");
        if (!response.ok) {
          throw new Error("Unable to load discover queue.");
        }
        const data = await response.json();
        setProfiles(Array.isArray(data.profiles) ? data.profiles : []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Discovery is unavailable.");
      } finally {
        setLoading(false);
      }
    }

    void loadProfiles();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-12 w-48 rounded-full bg-muted" />
          <div className="h-[520px] rounded-[2rem] border border-border bg-card" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Discover</p>
          <h1 className="mt-3 text-3xl font-semibold">Something went wrong</h1>
          <p className="mt-3 text-muted-foreground">{error}</p>
        </div>
      </main>
    );
  }

  if (profiles.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">No more profiles</p>
          <h1 className="mt-3 text-3xl font-semibold">You’ve reached the end for now.</h1>
          <p className="mt-3 text-muted-foreground">Adjust your preferences or come back later to keep exploring meaningful connections.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Discover</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Meet people who match your pace.</h1>
        </div>
        <div className="rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground">
          {profiles.length} profiles
        </div>
      </div>

      <div className="mx-auto max-w-[36rem]">
        <DiscoverCard profile={profiles[0]} />
      </div>
    </main>
  );
}
