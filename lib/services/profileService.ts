import {
  type DatingPreferencesRecord,
  type LifestyleRecord,
  type ProfileRecord,
  type UserInterestRecord,
  type UserRecord,
  getProfileAge,
} from "@/lib/kismate";

export type ProfileCompletionSummary = {
  completionPercentage: number;
  missingFields: string[];
  onboardingComplete: boolean;
};

export function calculateProfileCompletion(
  profile: Partial<ProfileRecord> | null,
  interests: UserInterestRecord[] = [],
  lifestyle: Partial<LifestyleRecord> | null = null,
  preferences: Partial<DatingPreferencesRecord> | null = null,
): ProfileCompletionSummary {
  const checks = [
    { key: "photo", valid: Boolean(profile?.profilePhoto) },
    { key: "name", valid: Boolean(profile?.firstName && profile?.displayName) },
    { key: "bio", valid: Boolean(profile?.bio && profile.bio.length >= 40) },
    { key: "interests", valid: (interests?.length ?? 0) >= 3 },
    { key: "lifestyle", valid: Boolean(lifestyle && Object.values(lifestyle).some((value) => value !== undefined && value !== null && value !== "")) },
    { key: "relationshipIntent", valid: Boolean(profile?.relationshipIntent) },
    { key: "datingPreferences", valid: Boolean(preferences && preferences.ageMin && preferences.ageMax) },
  ];

  const completed = checks.filter((check) => check.valid).length;
  const percentage = Math.round((completed / checks.length) * 100);
  const missingFields = checks.filter((check) => !check.valid).map((check) => check.key);

  return {
    completionPercentage: percentage,
    missingFields,
    onboardingComplete: percentage >= 70,
  };
}

export function buildPublicProfile(
  user: UserRecord,
  profile: Partial<ProfileRecord> | null,
  interestNames: string[] = [],
  lifestyle: Partial<LifestyleRecord> | null = null,
  preferences: Partial<DatingPreferencesRecord> | null = null,
) {
  const profileAge = getProfileAge(profile as { dateOfBirth?: string } | null);

  return {
    id: profile?.id ?? 0,
    userId: user.id,
    firstName: profile?.firstName ?? user.name?.split(" ")[0] ?? "",
    displayName: profile?.displayName ?? user.name,
    age: profileAge,
    city: profile?.city ?? "",
    country: profile?.country ?? "",
    region: profile?.region ?? "",
    headline: profile?.headline ?? "New to KISMATE",
    bio: profile?.bio ?? "",
    relationshipIntent: profile?.relationshipIntent ?? "serious-dating",
    profilePhoto: profile?.profilePhoto ?? "/images/profiles/profile-fallback.svg",
    photos: [],
    interests: interestNames,
    lifestyle: lifestyle ?? {},
    preferences: preferences ?? {},
    profileCompleted: Boolean(profile?.bio && profile?.headline && profile?.relationshipIntent),
    onboardingCompleted: user.onboardingCompleted,
  };
}
