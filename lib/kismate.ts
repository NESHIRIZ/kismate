export type UserStatus = "active" | "suspended" | "deactivated";
export type Gender = "woman" | "man" | "non-binary" | "other" | "prefer-not-to-say";
export type RelationshipIntent =
  | "long-term-relationship"
  | "marriage"
  | "serious-dating"
  | "getting-to-know-someone"
  | "friendship-first";

export type LikeRecord = {
  id: number;
  fromUserId: number;
  toUserId: number;
  createdAt: string;
};

export type PassRecord = {
  id: number;
  fromUserId: number;
  toUserId: number;
  createdAt: string;
};

export type MatchRecord = {
  id: number;
  userAId: number;
  userBId: number;
  createdAt: string;
  status: "active" | "archived";
};

export type ConversationRecord = {
  id: number;
  matchId: number;
  participantIds: number[];
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
  lastMessagePreview?: string;
};

export type MessageRecord = {
  id: number;
  conversationId: number;
  senderId: number;
  body: string;
  createdAt: string;
  readAt?: string;
};

export type BlockRecord = {
  id: number;
  blockerUserId: number;
  blockedUserId: number;
  createdAt: string;
};

export type ProfilePhotoRecord = {
  id: number;
  userId: number;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
};

export type UserInterestRecord = {
  id: number;
  userId: number;
  interestId: string;
  createdAt: string;
};

export type LifestyleRecord = {
  id: number;
  userId: number;
  education?: string;
  occupation?: string;
  smoking?: "never" | "socially" | "often";
  drinking?: "never" | "socially" | "often";
  exercise?: "rarely" | "sometimes" | "often";
  children?: "no" | "maybe" | "yes";
  wantsChildren?: "not-sure" | "yes" | "no";
  pets?: string;
  languages?: string[];
  createdAt: string;
  updatedAt: string;
};

export type DatingPreferencesRecord = {
  id: number;
  userId: number;
  ageMin: number;
  ageMax: number;
  preferredGender: Gender[];
  preferredLocation: string;
  maxDistanceKm: number;
  relationshipIntent: RelationshipIntent[];
  interests: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProfileRecord = {
  id: number;
  userId: number;
  firstName: string;
  displayName: string;
  dateOfBirth: string;
  gender: Gender;
  pronouns?: string;
  city: string;
  region?: string;
  country: string;
  bio: string;
  headline: string;
  relationshipIntent: RelationshipIntent;
  profilePhoto?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserRecord = {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  emailVerified: boolean;
  profileCompleted: boolean;
  onboardingCompleted: boolean;
  status: UserStatus;
  dateOfBirth?: string;
};

export const ADULT_AGE = 18;

export const RELATIONSHIP_INTENT_OPTIONS: Array<{ value: RelationshipIntent; label: string }> = [
  { value: "long-term-relationship", label: "Long-term relationship" },
  { value: "marriage", label: "Marriage" },
  { value: "serious-dating", label: "Serious dating" },
  { value: "getting-to-know-someone", label: "Getting to know someone" },
  { value: "friendship-first", label: "Friendship first" },
];

export const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

export function isAdult(dateOfBirth: string): boolean {
  return calculateAge(dateOfBirth) >= ADULT_AGE;
}

export function sanitizeDateOfBirth(value: string): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return value;
}

export function getProfileAge(profile?: Partial<Pick<ProfileRecord, "dateOfBirth">> | null): number {
  if (!profile?.dateOfBirth) {
    return 0;
  }

  return calculateAge(profile.dateOfBirth);
}
