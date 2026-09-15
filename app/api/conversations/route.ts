import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { getUserById } from "@/lib/db";
import { ensureConversationForMatch, getUserConversations } from "@/lib/services/conversationService";
import { getMatchesByUserId } from "@/lib/db";

export async function GET() {
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

  return NextResponse.json({ conversations: getUserConversations(user.id) });
}

export async function POST(request: Request) {
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

  const body = (await request.json()) as { matchId?: number };
  const matchId = Number(body.matchId);

  if (!Number.isFinite(matchId) || matchId <= 0) {
    return NextResponse.json({ error: "A valid match is required." }, { status: 400 });
  }

  const match = getMatchesByUserId(user.id).find((entry) => entry.id === matchId);
  if (!match) {
    return NextResponse.json({ error: "You can only start a conversation with a valid match." }, { status: 400 });
  }

  const conversation = ensureConversationForMatch(matchId, user.id);
  if (!conversation) {
    return NextResponse.json({ error: "Unable to create conversation." }, { status: 400 });
  }

  return NextResponse.json({ conversation });
}
