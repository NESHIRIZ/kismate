import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { markConversationAsRead } from "@/lib/services/messageService";
import { getConversationById } from "@/lib/db";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(KISMATE_SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthenticated." }, { status: 401 });
  }

  const payload = verifyJwt(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid session." }, { status: 401 });
  }

  const user = getUserById(payload.sub);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const conversationId = Number(id);
  if (!Number.isFinite(conversationId) || conversationId <= 0) {
    return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
  }

  const conversation = getConversationById(conversationId);
  if (!conversation || !conversation.participantIds.includes(user.id)) {
    return NextResponse.json({ error: "You do not have access to this conversation." }, { status: 403 });
  }

  const updatedCount = markConversationAsRead(conversationId, user.id);
  return NextResponse.json({ ok: true, updatedCount });
}
