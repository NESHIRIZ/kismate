"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import type { PublicProfileSummary } from "@/lib/services/publicProfileService";

export function DiscoverCard({ profile }: { profile: PublicProfileSummary }) {
  const photos = useMemo(() => (profile.photos.length > 0 ? profile.photos : [profile.profilePhoto]), [profile.photos, profile.profilePhoto]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isPassing, setIsPassing] = useState(false);

  async function handleAction(action: "like" | "pass") {
    const loadingState = action === "like" ? setIsLiking : setIsPassing;
    loadingState(true);

    try {
      const response = await fetch(`/api/${action === "like" ? "likes" : "passes"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: profile.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        window.alert(data.error ?? `Unable to ${action} this profile.`);
        return;
      }

      window.location.reload();
    } finally {
      loadingState(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="relative h-[420px] overflow-hidden bg-muted">
        <Image
          src={photos[photoIndex] ?? profile.profilePhoto}
          alt={profile.name}
          width={900}
          height={1200}
          className="h-full w-full object-cover"
        />

        {photos.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setPhotoIndex((value) => (value === 0 ? photos.length - 1 : value - 1))}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/20 text-lg text-white backdrop-blur-sm"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setPhotoIndex((value) => (value + 1) % photos.length)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/20 text-lg text-white backdrop-blur-sm"
            >
              ›
            </button>
          </>
        ) : null}

        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl border border-white/40 bg-slate-950/35 px-3 py-2 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-white">{profile.name}</h2>
              <span className="text-sm text-white/80">{profile.age}</span>
            </div>
            <p className="text-sm text-white/75">{profile.city}{profile.country ? `, ${profile.country}` : ""}</p>
          </div>
          <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">
            KISMATE
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{profile.relationshipIntent}</p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">{profile.headline}</h3>
          </div>
          <div className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
            {profile.compatibilityLabel}
          </div>
        </div>

        <p className="text-sm leading-7 text-muted-foreground">{profile.bio}</p>

        <div className="flex flex-wrap gap-2">
          {profile.interests.slice(0, 6).map((interest) => (
            <span key={interest} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
              {interest}
            </span>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Shared interests</p>
            <p className="mt-2 text-base font-semibold text-foreground">{profile.sharedInterests} in common</p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Lifestyle</p>
            <p className="mt-2 text-base font-semibold text-foreground">{profile.lifestyle?.occupation ?? "Thoughtful"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={() => handleAction("pass")} disabled={isPassing || isLiking}>
            {isPassing ? "Passing..." : "Pass"}
          </Button>
          <Button className="flex-1" onClick={() => handleAction("like")} disabled={isPassing || isLiking}>
            {isLiking ? "Liking..." : "Like"}
          </Button>
        </div>

        <Link href={`/discover/profile/${profile.id}`} className="inline-flex items-center text-sm font-semibold text-primary">
          View full profile
        </Link>
      </div>
    </div>
  );
}
