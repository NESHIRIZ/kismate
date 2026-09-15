"use client";

import { useMemo, useState } from "react";
import { ProfilePreview } from "@/app/components/profiles/ProfilePreview";
import { GENDER_OPTIONS, RELATIONSHIP_INTENT_OPTIONS, type ProfileRecord } from "@/lib/kismate";
import { getInterestCatalog } from "@/lib/services/preferenceService";

const TOTAL_STEPS = 8;

const initialProfile: Partial<ProfileRecord> & { age?: number; interests?: string[]; profilePhoto?: string } = {
  firstName: "",
  displayName: "",
  dateOfBirth: "",
  gender: "prefer-not-to-say",
  city: "",
  region: "",
  country: "",
  headline: "",
  bio: "",
  relationshipIntent: "serious-dating",
  interests: [],
  profilePhoto: "/images/profiles/profile-fallback.svg",
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const interestCatalog = useMemo(() => getInterestCatalog(), []);

  const steps = useMemo(
    () => [
      { title: "Welcome", description: "Create a profile built for real intent." },
      { title: "Basic information", description: "Your name and age help us keep the experience mature and intentional." },
      { title: "Location", description: "Share the city and region you call home." },
      { title: "Profile photo", description: "Choose a warm, genuine first impression." },
      { title: "About you", description: "Write a short profile that reflects your values." },
      { title: "Interests", description: "Pick the things that make you feel like yourself." },
      { title: "Relationship intent", description: "Tell us what kind of connection you want." },
      { title: "Preview", description: "Make sure your profile feels like you." },
    ],
    [],
  );

  function updateField(field: string, value: string | string[]) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit() {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          name: profile.displayName ?? profile.firstName,
          interests: profile.interests,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Unable to save onboarding profile.");
      }

      if (currentStep < steps.length - 1) {
        setCurrentStep((value) => value + 1);
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 rounded-[2rem] border border-border bg-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">KISMATE onboarding</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">Build your profile</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{currentStep + 1}</span>
            <span>/</span>
            <span>{TOTAL_STEPS}</span>
          </div>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-border bg-card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Step {currentStep + 1}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">{steps[currentStep].title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{steps[currentStep].description}</p>

          {error ? <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

          {currentStep === 0 ? (
            <div className="mt-8 space-y-4">
              <p className="text-base leading-7 text-muted-foreground">KISMATE is built for people who want meaningful relationships rooted in compatibility, trust, and honest chemistry.</p>
              <button type="button" onClick={() => setCurrentStep(1)} className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">Start</button>
            </div>
          ) : null}

          {currentStep === 1 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
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
                  {GENDER_OPTIONS.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                </select>
              </label>
            </div>
          ) : null}

          {currentStep === 2 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-3">
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
          ) : null}

          {currentStep === 3 ? (
            <div className="mt-8">
              <div className="rounded-[2rem] border border-dashed border-border bg-muted/40 p-8 text-center text-sm text-muted-foreground">
                Upload a primary profile photo. Local project-based image storage is supported in this phase and designed to migrate to object storage later.
              </div>
            </div>
          ) : null}

          {currentStep === 4 ? (
            <div className="mt-8 space-y-4">
              <label className="block space-y-2 text-sm text-muted-foreground">
                <span>Headline</span>
                <input value={profile.headline ?? ""} onChange={(event) => updateField("headline", event.target.value)} className="h-12 w-full rounded-2xl border border-border bg-background px-3" />
              </label>
              <label className="block space-y-2 text-sm text-muted-foreground">
                <span>Bio</span>
                <textarea rows={5} value={profile.bio ?? ""} onChange={(event) => updateField("bio", event.target.value)} className="w-full rounded-2xl border border-border bg-background px-3 py-3" />
              </label>
            </div>
          ) : null}

          {currentStep === 5 ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {interestCatalog.map((interest) => {
                const selected = (profile.interests ?? []).includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => {
                      const next = selected ? (profile.interests ?? []).filter((item) => item !== interest.id) : [...(profile.interests ?? []), interest.id];
                      updateField("interests", next);
                    }}
                    className={`rounded-full border px-3 py-2 text-sm font-medium ${selected ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground"}`}
                  >
                    {interest.name}
                  </button>
                );
              })}
            </div>
          ) : null}

          {currentStep === 6 ? (
            <div className="mt-8 grid gap-3 md:grid-cols-2">
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
          ) : null}

          {currentStep === 7 ? (
            <div className="mt-8">
              <ProfilePreview
                profile={{
                  ...profile,
                  age: profile.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : 0,
                  profilePhoto: profile.profilePhoto ?? "/images/profiles/profile-fallback.svg",
                  interests: profile.interests ?? [],
                }}
              />
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep((value) => Math.max(0, value - 1))}
              className="inline-flex h-11 items-center rounded-full border border-border bg-background px-5 text-sm font-semibold text-foreground"
              disabled={currentStep === 0}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_12px_32px_rgba(180,111,93,0.2)] disabled:opacity-70"
            >
              {saving ? "Saving..." : currentStep === steps.length - 1 ? "Finish onboarding" : "Continue"}
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <ProfilePreview
            profile={{
              ...profile,
              age: profile.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : 0,
              profilePhoto: profile.profilePhoto ?? "/images/profiles/profile-fallback.svg",
              interests: profile.interests ?? [],
            }}
          />
        </div>
      </div>
    </main>
  );
}
