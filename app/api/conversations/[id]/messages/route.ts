import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { createMessageForConversation, getConversationMessages } from "@/lib/services/messageService";
import { getConversationById } from "@/lib/db";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
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

  return NextResponse.json({ messages: getConversationMessages(conversationId, user.id, 200) });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
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

  const body = (await request.json()) as { body?: string };
  const message = createMessageForConversation(conversationId, user.id, body.body ?? "");

  if (!message) {
    return NextResponse.json({ error: "Message must be a non-empty plain-text message under 2000 characters." }, { status: 400 });
  }

  return NextResponse.json({ message });
}
