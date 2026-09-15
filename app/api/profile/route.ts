import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { KISMATE_SESSION_COOKIE, verifyJwt } from "@/lib/auth";
import { createOrUpdateProfile, getProfileByUserId, getUserById, updateUser } from "@/lib/db";
import { calculateProfileCompletion } from "@/lib/services/profileService";
import { getUserInterests } from "@/lib/db";
import { getLifestyleByUserId, getPreferencesByUserId } from "@/lib/db";
import { type Gender, type RelationshipIntent, sanitizeDateOfBirth, isAdult } from "@/lib/kismate";

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

  const profile = getProfileByUserId(user.id) ?? null;
  const interests = getUserInterests(user.id);
  const lifestyle = getLifestyleByUserId(user.id);
  const preferences = getPreferencesByUserId(user.id);
  const completion = calculateProfileCompletion(profile, interests, lifestyle, preferences);

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    profile,
    interests: interests.map((interest) => interest.interestId),
    lifestyle,
    preferences,
    completion,
  });
}

export async function PUT(request: Request) {
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

  const body = (await request.json()) as Record<string, unknown>;
  const dateOfBirth = typeof body.dateOfBirth === "string" ? sanitizeDateOfBirth(body.dateOfBirth) : null;
  const validGenders: Gender[] = ["woman", "man", "non-binary", "other", "prefer-not-to-say"];
  const validRelationshipIntents: RelationshipIntent[] = [
    "long-term-relationship",
    "marriage",
    "serious-dating",
    "getting-to-know-someone",
    "friendship-first",
  ];

  if (dateOfBirth && !isAdult(dateOfBirth)) {
    return NextResponse.json({ error: "You must be at least 18 to use KISMATE." }, { status: 400 });
  }

  const gender = typeof body.gender === "string" && validGenders.includes(body.gender as Gender) ? (body.gender as Gender) : undefined;
  const relationshipIntent =
    typeof body.relationshipIntent === "string" && validRelationshipIntents.includes(body.relationshipIntent as RelationshipIntent)
      ? (body.relationshipIntent as RelationshipIntent)
      : undefined;

  const nextProfile = createOrUpdateProfile(user.id, {
    firstName: typeof body.firstName === "string" ? body.firstName : undefined,
    displayName: typeof body.displayName === "string" ? body.displayName : undefined,
    dateOfBirth: dateOfBirth ?? undefined,
    gender,
    pronouns: typeof body.pronouns === "string" ? body.pronouns : undefined,
    city: typeof body.city === "string" ? body.city : undefined,
    region: typeof body.region === "string" ? body.region : undefined,
    country: typeof body.country === "string" ? body.country : undefined,
    bio: typeof body.bio === "string" ? body.bio : undefined,
    headline: typeof body.headline === "string" ? body.headline : undefined,
    relationshipIntent,
    profilePhoto: typeof body.profilePhoto === "string" ? body.profilePhoto : undefined,
  });

  const updatedUser = updateUser(user.id, {
    name: typeof body.name === "string" ? body.name.trim() : user.name,
    emailVerified: typeof body.emailVerified === "boolean" ? body.emailVerified : user.emailVerified,
    profileCompleted: true,
    onboardingCompleted: Boolean(nextProfile && nextProfile.bio && nextProfile.headline),
  });

  return NextResponse.json({
    profile: nextProfile,
    user: updatedUser,
  });
}
