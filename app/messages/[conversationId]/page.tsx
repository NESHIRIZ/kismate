import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { getConversationDetails } from "@/lib/services/conversationService";
import { getConversationMessages, markConversationAsRead } from "@/lib/services/messageService";
import { ConversationComposer } from "@/app/components/messages/ConversationComposer";

function formatMessageTime(dateString: string) {
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

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const { conversationId } = await params;
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

  const id = Number(conversationId);
  if (!Number.isFinite(id) || id <= 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center">
          <h1 className="text-2xl font-semibold">Conversation not found.</h1>
        </div>
      </main>
    );
  }

  const conversation = getConversationDetails(id, user.id);
  if (!conversation) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-[2rem] border border-border bg-card p-8 text-center">
          <h1 className="text-2xl font-semibold">This conversation is not available.</h1>
          <Link href="/messages" className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Back to messages
          </Link>
        </div>
      </main>
    );
  }

  const messages = getConversationMessages(id, user.id, 200);
  markConversationAsRead(id, user.id);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:py-8">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card p-4 md:p-5">
          <div className="flex items-center gap-3">
            <Link href="/messages" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-lg text-foreground">
              ←
            </Link>
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-muted">
              <Image src={conversation.otherParticipant.profilePhoto || "/images/profiles/profile-fallback.svg"} alt={conversation.otherParticipant.name} width={80} height={80} className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">{conversation.otherParticipant.name}</h1>
              <p className="text-sm text-muted-foreground">{conversation.otherParticipant.city}{conversation.otherParticipant.country ? `, ${conversation.otherParticipant.country}` : ""}</p>
            </div>
          </div>

          <Link href={`/discover/profile/${conversation.otherParticipant.id}`} className="inline-flex rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
            View profile
          </Link>
        </header>

        <div className="flex min-h-[420px] flex-col justify-between bg-background/40">
          <div className="space-y-4 p-4 md:p-5">
            {messages.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-border bg-card p-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Start the conversation</p>
                <h2 className="mt-3 text-xl font-semibold">Say hello and start getting to know each other.</h2>
              </div>
            ) : (
              messages.map((message) => {
                const isMine = message.senderId === user.id;

                return (
                  <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-[1.25rem] px-4 py-3 ${isMine ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground"}`}>
                      <p className="text-sm leading-6 whitespace-pre-wrap">{message.body}</p>
                      <p className={`mt-2 text-[10px] uppercase tracking-[0.12em] ${isMine ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                        {formatMessageTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <ConversationComposer conversationId={id} />
        </div>
      </div>
    </main>
  );
}
