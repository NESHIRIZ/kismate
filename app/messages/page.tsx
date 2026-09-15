import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { getUserConversations } from "@/lib/services/conversationService";

function formatConversationTime(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Now";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function MessagesPage() {
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

  const conversations = getUserConversations(user.id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Messages</p>
          <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Your conversations</h1>
        </div>
        <Link href="/discover" className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted md:inline-flex">
          Explore matches
        </Link>
      </div>

      {conversations.length === 0 ? (
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Start here</p>
          <h2 className="mt-3 text-2xl font-semibold">Meaningful connections start with a simple hello.</h2>
          <p className="mt-3 text-muted-foreground">Conversations appear here after a mutual match.</p>
          <Link href="/discover" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Back to Discover
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <Link key={conversation.id} href={`/messages/${conversation.id}`} className="block rounded-[1.5rem] border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-muted/50 md:p-5">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border bg-muted">
                  <Image src={conversation.otherParticipant.profilePhoto || "/images/profiles/profile-fallback.svg"} alt={conversation.otherParticipant.name} width={80} height={80} className="h-full w-full object-cover" />
                  {conversation.unreadCount > 0 ? (
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                      {conversation.unreadCount}
                    </span>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-foreground">{conversation.otherParticipant.name}, {conversation.otherParticipant.age}</h3>
                      <p className="truncate text-sm text-muted-foreground">{conversation.otherParticipant.city}{conversation.otherParticipant.country ? `, ${conversation.otherParticipant.country}` : ""}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{formatConversationTime(conversation.lastMessageAt)}</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="truncate text-sm text-muted-foreground">{conversation.lastMessagePreview}</p>
                    {conversation.unreadCount > 0 ? <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary">Unread</span> : null}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
