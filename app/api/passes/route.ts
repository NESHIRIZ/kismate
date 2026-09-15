import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { createPass, getUserById, hasLiked, hasPassed } from "@/lib/db";

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

  const body = (await request.json()) as { targetUserId?: number };
  const targetUserId = Number(body.targetUserId);

  if (!Number.isFinite(targetUserId) || targetUserId <= 0) {
    return NextResponse.json({ error: "A valid target profile is required." }, { status: 400 });
  }

  if (targetUserId === user.id) {
    return NextResponse.json({ error: "You cannot pass on yourself." }, { status: 400 });
  }

  const targetUser = getUserById(targetUserId);
  if (!targetUser || targetUser.status !== "active") {
    return NextResponse.json({ error: "That profile is unavailable." }, { status: 400 });
  }

  if (hasPassed(user.id, targetUserId)) {
    return NextResponse.json({ error: "You already passed on this profile." }, { status: 409 });
  }

  if (hasLiked(user.id, targetUserId)) {
    return NextResponse.json({ error: "This profile was already liked. Update your decision to pass instead." }, { status: 409 });
  }

  const pass = createPass(user.id, targetUserId);
  if (!pass) {
    return NextResponse.json({ error: "Unable to record pass." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, passed: true });
}
