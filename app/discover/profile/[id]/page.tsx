import Image from "next/image";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getProfileByUserId, getUserById, getUserInterests } from "@/lib/db";
import { getLifestyleByUserId } from "@/lib/db";
import { buildPublicProfile } from "@/lib/services/publicProfileService";

export default async function DiscoverProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get(KISMATE_SESSION_COOKIE)?.value;
  const payload = token ? verifyJwt(token) : null;

  if (!payload) {
    notFound();
  }

  const viewer = getUserById(payload.sub);
  if (!viewer) {
    notFound();
  }

  const targetId = Number(id);
  const user = getUserById(targetId);
  const profile = user ? getProfileByUserId(user.id) : null;

  if (!user || !profile) {
    notFound();
  }

  const viewerInterests = getUserInterests(viewer.id).map((interest) => interest.interestId.toLowerCase());
  const publicProfile = buildPublicProfile(user, profile, getUserInterests(user.id).map((interest) => interest.interestId.toLowerCase()), getLifestyleByUserId(user.id), viewerInterests);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
          <Image src={publicProfile.profilePhoto} alt={publicProfile.name} width={1200} height={1500} className="h-[500px] w-full object-cover" />
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Public profile</p>
            <h1 className="mt-2 text-3xl font-semibold">{publicProfile.name}, {publicProfile.age}</h1>
            <p className="mt-2 text-muted-foreground">{publicProfile.city}{publicProfile.country ? `, ${publicProfile.country}` : ""}</p>
            <h2 className="mt-5 text-xl font-semibold">{publicProfile.headline}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{publicProfile.bio}</p>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6">
            <div className="flex flex-wrap gap-2">
              {publicProfile.interests.map((interest) => (
                <span key={interest} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">{interest}</span>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Compatibility</p>
            <p className="mt-3 text-lg font-semibold text-foreground">{publicProfile.compatibilityLabel}</p>
            <p className="mt-1 text-sm text-muted-foreground">{publicProfile.sharedInterests} shared interests</p>
          </section>
        </div>
      </div>
    </main>
  );
}
