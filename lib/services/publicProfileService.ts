import {
  type LifestyleRecord,
  type ProfileRecord,
  type RelationshipIntent,
  type UserRecord,
} from "@/lib/kismate";
import { getInterestCatalog } from "@/lib/services/preferenceService";

export type PublicProfileSummary = {
  id: number;
  name: string;
  firstName: string;
  age: number;
  city: string;
  country: string;
  region?: string;
  headline: string;
  bio: string;
  relationshipIntent: RelationshipIntent;
  profilePhoto: string;
  photos: string[];
  interests: string[];
  lifestyle: Partial<Record<"education" | "occupation" | "languages" | "pets" | "smoking" | "drinking" | "exercise" | "children" | "wantsChildren", string | string[]>>;
  compatibilityLabel: string;
  sharedInterests: number;
};

export function buildPublicProfile(
  user: UserRecord,
  profile: ProfileRecord | null | undefined,
  interestIds: string[] = [],
  lifestyle: Partial<LifestyleRecord> | null = null,
  viewerInterests: string[] = [],
): PublicProfileSummary {
  const name = profile?.displayName || user.name;
  const interestCatalog = getInterestCatalog();
  const age = profile?.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : 0;
  const selectedInterests = interestIds
    .map((id) => interestCatalog.find((item) => item.id === id)?.name ?? id)
    .filter(Boolean);
  const sharedInterests = new Set(viewerInterests).size > 0
    ? selectedInterests.filter((interest) => viewerInterests.includes(interest.toLowerCase())).length
    : 0;
  const compatibilityLabel = sharedInterests >= 2 ? "Good compatibility" : sharedInterests === 1 ? "Shared chemistry" : "New connection";
  const safeLifestyle = {
    education: lifestyle?.education,
    occupation: lifestyle?.occupation,
    languages: lifestyle?.languages,
    pets: lifestyle?.pets,
    smoking: lifestyle?.smoking,
    drinking: lifestyle?.drinking,
    exercise: lifestyle?.exercise,
    children: lifestyle?.children,
    wantsChildren: lifestyle?.wantsChildren,
  };

  return {
    id: profile?.userId ?? user.id,
    name,
    firstName: profile?.firstName ?? user.name.split(" ")[0] ?? "", 
    age,
    city: profile?.city ?? "Nearby",
    country: profile?.country ?? "",
    region: profile?.region,
    headline: profile?.headline ?? "New to KISMATE",
    bio: profile?.bio ?? "",
    relationshipIntent: profile?.relationshipIntent ?? "serious-dating",
    profilePhoto: profile?.profilePhoto ?? "/images/profiles/profile-fallback.svg",
    photos: [profile?.profilePhoto ?? "/images/profiles/profile-fallback.svg"].filter(Boolean),
    interests: selectedInterests,
    lifestyle: safeLifestyle,
    compatibilityLabel,
    sharedInterests,
  };
}
