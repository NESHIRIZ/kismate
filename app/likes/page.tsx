import Image from "next/image";
import { cookies } from "next/headers";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { getPeopleYouLiked } from "@/lib/services/matchingService";

export default async function LikesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(KISMATE_SESSION_COOKIE)?.value;

  if (!token) {
    return <main className="mx-auto max-w-5xl px-4 py-16"><div className="rounded-[2rem] border border-border bg-card p-8 text-center">Please sign in to view likes.</div></main>;
  }

  const payload = verifyJwt(token);
  if (!payload) {
    return <main className="mx-auto max-w-5xl px-4 py-16"><div className="rounded-[2rem] border border-border bg-card p-8 text-center">Your session is invalid.</div></main>;
  }

  const user = getUserById(payload.sub);
  if (!user) {
    return <main className="mx-auto max-w-5xl px-4 py-16"><div className="rounded-[2rem] border border-border bg-card p-8 text-center">User not found.</div></main>;
  }

  const likes = getPeopleYouLiked(user.id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Likes</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-5xl">People you’ve liked</h1>
      </div>

      {likes.length === 0 ? (
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-muted-foreground">
          No one here yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {likes.map((item) => (
            <div key={item.id} className="rounded-[2rem] border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <Image src="/images/profiles/profile-fallback.svg" alt={item.user?.name ?? "Profile"} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-foreground">{item.user?.name ?? "Profile"}</p>
                  <p className="text-sm text-muted-foreground">Liked on {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
