"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfilePreview } from "@/app/components/profiles/ProfilePreview";
import { GENDER_OPTIONS, RELATIONSHIP_INTENT_OPTIONS, type ProfileRecord } from "@/lib/kismate";
import { getInterestCatalog } from "@/lib/services/preferenceService";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<ProfileRecord> & { age?: number; interests?: string[]; profilePhoto?: string }>({
    displayName: "",
    firstName: "",
    headline: "",
    bio: "",
    city: "",
    country: "",
    gender: "prefer-not-to-say",
    relationshipIntent: "serious-dating",
    interests: [],
    profilePhoto: "/images/profiles/profile-fallback.svg",
  });
  const [error, setError] = useState<string | null>(null);
  const interests = getInterestCatalog();

  useEffect(() => {
    async function loadProfile() {
      const response = await fetch("/api/profile", { cache: "no-store" });
      if (!response.ok) {
        setError("Unable to load profile. Please sign in again.");
        setLoading(false);
        return;
      }

      const data = await response.json();
      const nextProfile = {
        ...data.profile,
        age: data.profile?.dateOfBirth ? new Date().getFullYear() - new Date(data.profile.dateOfBirth).getFullYear() : 0,
        interests: (data.interests ?? []).map((interestId: string) => interestId),
        profilePhoto: data.profile?.profilePhoto || "/images/profiles/profile-fallback.svg",
      };

      setProfile(nextProfile);
      setLoading(false);
    }

    void loadProfile();
  }, []);

  function updateField(field: string, value: string | string[]) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...profile,
        name: profile.displayName,
        interests: profile.interests,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Profile update failed.");
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push("/profile");
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Edit profile</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">Shape your KISMATE profile</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-24">
          <ProfilePreview profile={profile} className="w-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <section className="rounded-[2rem] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">Basic information</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>First name</span>
                <input value={profile.firstName ?? ""} onChange={(event) => updateField("firstName", event.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-3" />
              </label>
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>Display name</span>
                <input value={profile.displayName ?? ""} onChange={(event) => updateField("displayName", event.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-3" />
              </label>
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>Date of birth</span>
                <input type="date" value={profile.dateOfBirth ?? ""} onChange={(event) => updateField("dateOfBirth", event.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-3" />
              </label>
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>Gender</span>
                <select value={profile.gender ?? "prefer-not-to-say"} onChange={(event) => updateField("gender", event.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-3">
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">Location</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>City</span>
                <input value={profile.city ?? ""} onChange={(event) => updateField("city", event.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-3" />
              </label>
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>Region</span>
                <input value={profile.region ?? ""} onChange={(event) => updateField("region", event.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-3" />
              </label>
              <label className="space-y-2 text-sm text-muted-foreground">
                <span>Country</span>
                <input value={profile.country ?? ""} onChange={(event) => updateField("country", event.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-3" />
              </label>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">About me</h2>
            <div className="mt-4 space-y-4">
              <label className="block space-y-2 text-sm text-muted-foreground">
                <span>Headline</span>
                <input value={profile.headline ?? ""} onChange={(event) => updateField("headline", event.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-3" />
              </label>
              <label className="block space-y-2 text-sm text-muted-foreground">
                <span>Bio</span>
                <textarea value={profile.bio ?? ""} onChange={(event) => updateField("bio", event.target.value)} rows={5} className="w-full rounded-2xl border border-border bg-background px-3 py-3" />
              </label>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">Interests</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {interests.map((interest) => {
                const selected = (profile.interests ?? []).includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? (profile.interests ?? []).filter((item) => item !== interest.id)
                        : [...(profile.interests ?? []), interest.id];
                      updateField("interests", next);
                    }}
                    className={`rounded-full border px-3 py-2 text-sm font-medium ${selected ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground"}`}
                  >
                    {interest.name}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">Relationship intent</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {RELATIONSHIP_INTENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField("relationshipIntent", option.value)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm ${profile.relationshipIntent === option.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => router.push("/profile")} className="inline-flex h-11 items-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground">
              Cancel
            </button>
            <button type="submit" disabled={saving || loading} className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_12px_32px_rgba(180,111,93,0.2)] disabled:opacity-70">
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
