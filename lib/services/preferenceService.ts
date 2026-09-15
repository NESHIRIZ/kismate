import { GENDER_OPTIONS, RELATIONSHIP_INTENT_OPTIONS, type DatingPreferencesRecord, type Gender, type RelationshipIntent } from "@/lib/kismate";

export const interestCatalog = [
  { id: "music", name: "Music", category: "Lifestyle" },
  { id: "movies", name: "Movies", category: "Lifestyle" },
  { id: "reading", name: "Reading", category: "Lifestyle" },
  { id: "fitness", name: "Fitness", category: "Lifestyle" },
  { id: "travel", name: "Travel", category: "Lifestyle" },
  { id: "technology", name: "Technology", category: "Lifestyle" },
  { id: "business", name: "Business", category: "Lifestyle" },
  { id: "food", name: "Food", category: "Lifestyle" },
  { id: "art", name: "Art", category: "Lifestyle" },
  { id: "photography", name: "Photography", category: "Lifestyle" },
  { id: "gaming", name: "Gaming", category: "Lifestyle" },
  { id: "sports", name: "Sports", category: "Lifestyle" },
  { id: "nature", name: "Nature", category: "Lifestyle" },
  { id: "faith", name: "Faith", category: "Lifestyle" },
  { id: "education", name: "Education", category: "Lifestyle" },
  { id: "volunteering", name: "Volunteering", category: "Lifestyle" },
];

export function getInterestCatalog() {
  return interestCatalog;
}

export function getInterestOptions() {
  return interestCatalog.map(({ id, name }) => ({ value: id, label: name }));
}

export function normalizeGenderValues(values: unknown): Gender[] {
  const selected = Array.isArray(values) ? values : [];
  const valid = new Set(GENDER_OPTIONS.map((option) => option.value));

  return selected.filter((value): value is Gender => typeof value === "string" && valid.has(value as Gender));
}

export function normalizeRelationshipIntentValues(values: unknown): RelationshipIntent[] {
  const selected = Array.isArray(values) ? values : [];
  const valid = new Set(RELATIONSHIP_INTENT_OPTIONS.map((option) => option.value));

  return selected.filter((value): value is RelationshipIntent => typeof value === "string" && valid.has(value as RelationshipIntent));
}

export function getDefaultPreferences(userId: number): DatingPreferencesRecord {
  return {
    id: 0,
    userId,
    ageMin: 25,
    ageMax: 40,
    preferredGender: ["woman", "man"],
    preferredLocation: "",
    maxDistanceKm: 100,
    relationshipIntent: ["serious-dating", "long-term-relationship"],
    interests: ["travel", "food", "music"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
