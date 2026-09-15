import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { createLike, getUserById, hasLiked, hasPassed } from "@/lib/db";
import { createMutualMatchIfNeeded } from "@/lib/services/matchingService";

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
    return NextResponse.json({ error: "You cannot like yourself." }, { status: 400 });
  }

  const targetUser = getUserById(targetUserId);
  if (!targetUser || targetUser.status !== "active") {
    return NextResponse.json({ error: "That profile is unavailable." }, { status: 400 });
  }

  if (hasLiked(user.id, targetUserId)) {
    return NextResponse.json({ error: "You already liked this profile." }, { status: 409 });
  }

  if (hasPassed(user.id, targetUserId)) {
    return NextResponse.json({ error: "You already passed on this profile." }, { status: 409 });
  }

  const like = createLike(user.id, targetUserId);
  if (!like) {
    return NextResponse.json({ error: "Unable to create like." }, { status: 400 });
  }

  const mutualMatch = createMutualMatchIfNeeded(user.id, targetUserId);

  return NextResponse.json({
    ok: true,
    liked: true,
    matchCreated: Boolean(mutualMatch),
    match: mutualMatch ?? null,
  });
}
