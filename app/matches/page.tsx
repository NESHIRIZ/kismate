import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getProfileByUserId, getUserById } from "@/lib/db";
import { ensureConversationForMatch } from "@/lib/services/conversationService";
import { getMatchesForUser } from "@/lib/services/matchingService";

export default async function MatchesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(KISMATE_SESSION_COOKIE)?.value;

  if (!token) {
    return <main className="mx-auto max-w-5xl px-4 py-16"><div className="rounded-[2rem] border border-border bg-card p-8 text-center">Please sign in to view matches.</div></main>;
  }

  const payload = verifyJwt(token);
  if (!payload) {
    return <main className="mx-auto max-w-5xl px-4 py-16"><div className="rounded-[2rem] border border-border bg-card p-8 text-center">Your session is invalid.</div></main>;
  }

  const user = getUserById(payload.sub);
  if (!user) {
    return <main className="mx-auto max-w-5xl px-4 py-16"><div className="rounded-[2rem] border border-border bg-card p-8 text-center">User not found.</div></main>;
  }

  const matches = getMatchesForUser(user.id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Matches</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Your mutual matches</h1>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center text-muted-foreground">
          You haven’t matched with anyone yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {matches.map((match) => {
            const matchUserId = match.userAId === user.id ? match.userBId : match.userAId;
            const matchUser = getUserById(matchUserId);
            const matchProfile = matchUser ? getProfileByUserId(matchUserId) : null;
            if (!matchUser || !matchProfile) return null;

            return (
              <div key={match.id} className="overflow-hidden rounded-[2rem] border border-border bg-card">
                <Image src={matchProfile.profilePhoto ?? "/images/profiles/profile-fallback.svg"} alt={matchUser.name} width={800} height={600} className="h-64 w-full object-cover" />
                <div className="p-5">
                  <h2 className="text-xl font-semibold">{matchUser.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{matchProfile.city}, {matchProfile.country}</p>
                  <p className="mt-3 text-sm text-muted-foreground">Matched {new Date(match.createdAt).toLocaleDateString()}</p>
                  <div className="mt-4 flex gap-3">
                    {(() => {
                      const conversation = ensureConversationForMatch(match.id, user.id);
                      if (!conversation) {
                        return null;
                      }

                      return (
                        <Link href={`/messages/${conversation.id}`} className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                          Message
                        </Link>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
