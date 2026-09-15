import { type DatingPreferencesRecord, type ProfileRecord } from "@/lib/kismate";

export function getSharedInterestCount(
  profileInterests: string[] = [],
  candidateInterests: string[] = [],
): number {
  const setA = new Set(profileInterests.map((item) => item.toLowerCase()));
  const setB = new Set(candidateInterests.map((item) => item.toLowerCase()));

  return [...setA].filter((item) => setB.has(item)).length;
}

export function getCompatibilitySnapshot(
  profile: Partial<ProfileRecord> | null,
  preferences?: Partial<DatingPreferencesRecord> | null,
  candidateInterests: string[] = [],
  viewerInterests: string[] = [],
): {
  ageRange: string;
  sharedInterests: number;
  location: string;
  relationshipIntent: string;
  compatibilityLabel: string;
} {
  const ageRange = preferences?.ageMin && preferences?.ageMax ? `${preferences.ageMin}-${preferences.ageMax}` : "Flexible";
  const sharedInterests = getSharedInterestCount(
    candidateInterests,
    viewerInterests,
  );
  const compatibilityLabel = sharedInterests >= 2 ? "Good compatibility" : sharedInterests === 1 ? "Shared chemistry" : "New connection";

  return {
    ageRange,
    sharedInterests,
    location: preferences?.preferredLocation || "Flexible",
    relationshipIntent: profile?.relationshipIntent || "Not set",
    compatibilityLabel,
  };
}
