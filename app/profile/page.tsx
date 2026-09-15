import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getLifestyleByUserId, getPreferencesByUserId, getProfileByUserId, getUserById, getUserInterests } from "@/lib/db";
import { calculateProfileCompletion } from "@/lib/services/profileService";
import { getInterestCatalog } from "@/lib/services/preferenceService";
import { ProfilePreview } from "@/app/components/profiles/ProfilePreview";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(KISMATE_SESSION_COOKIE)?.value;

  if (!token) {
    redirect("/signin");
  }

  const payload = verifyJwt(token);
  if (!payload) {
    redirect("/signin");
  }

  const user = getUserById(payload.sub);
  if (!user) {
    redirect("/signin");
  }

  const profile = getProfileByUserId(user.id) ?? null;
  const interests = getUserInterests(user.id).map((interest) => interest.interestId);
  const lifestyle = getLifestyleByUserId(user.id);
  const preferences = getPreferencesByUserId(user.id);
  const interestCatalog = getInterestCatalog();
  const completion = calculateProfileCompletion(profile, getUserInterests(user.id), lifestyle, preferences);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Profile</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">Your KISMATE profile</h1>
        </div>
        <a href="/profile/edit" className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_12px_32px_rgba(180,111,93,0.2)]">
          Edit profile
        </a>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <ProfilePreview
          profile={{
            displayName: profile?.displayName || user.name,
            age: profile?.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : 0,
            bio: profile?.bio || "Share a little about the life you want to build.",
            headline: profile?.headline || "New to KISMATE",
            relationshipIntent: profile?.relationshipIntent || "serious-dating",
            profilePhoto: profile?.profilePhoto || "/images/profiles/profile-fallback.svg",
            interests: interests.length ? interests.map((interestId) => interestCatalog.find((item) => item.id === interestId)?.name ?? interestId) : ["Music", "Travel", "Food"],
          }}
          className="w-full"
        />

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">Profile completeness</h2>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${completion.completionPercentage}%` }} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{completion.completionPercentage}% complete</p>
            {completion.missingFields.length > 0 ? (
              <p className="mt-2 text-sm text-amber-700">Add {completion.missingFields.join(", ")} to improve your profile.</p>
            ) : (
              <p className="mt-2 text-sm text-emerald-700">Your profile is looking strong.</p>
            )}
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6">
            <h2 className="text-xl font-semibold text-foreground">About you</h2>
            <dl className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex justify-between gap-4"><dt>Location</dt><dd className="text-right text-foreground">{profile?.city || "Not set"}{profile?.country ? `, ${profile.country}` : ""}</dd></div>
              <div className="flex justify-between gap-4"><dt>Gender</dt><dd className="text-right text-foreground">{profile?.gender || "Not set"}</dd></div>
              <div className="flex justify-between gap-4"><dt>Relationship goal</dt><dd className="text-right text-foreground">{profile?.relationshipIntent || "Not set"}</dd></div>
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}
