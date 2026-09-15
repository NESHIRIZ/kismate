import { getUserById, getUserInterests, getProfileByUserId, getLifestyleByUserId, getPreferencesByUserId, getLikesByUserId, getPassesByUserId, getBlockedUserIds, getAllUsers, getUserCount } from "@/lib/db";
import { type UserRecord } from "@/lib/kismate";
import { buildPublicProfile } from "@/lib/services/publicProfileService";
import { getCompatibilitySnapshot } from "@/lib/services/compatibilityService";

export function isProfileEligibleForDiscovery(user: UserRecord): boolean {
  return user.status === "active" && user.emailVerified && Boolean(user.profileCompleted || user.onboardingCompleted);
}

export function getDiscoverProfiles(currentUserId: number) {
  const currentUser = getUserById(currentUserId);
  if (!currentUser || !isProfileEligibleForDiscovery(currentUser)) {
    return [];
  }

  const currentProfile = getProfileByUserId(currentUserId);
  const currentInterests = getUserInterests(currentUserId).map((interest) => interest.interestId.toLowerCase());
  const currentPreferences = getPreferencesByUserId(currentUserId);
  const likedUsers = new Set(getLikesByUserId(currentUserId).map((like) => like.toUserId));
  const passedUsers = new Set(getPassesByUserId(currentUserId).map((pass) => pass.toUserId));
  const blockedUsers = new Set(getBlockedUserIds(currentUserId));

  return getAllUsers()
    .filter((user) => user.id !== currentUserId)
    .filter((user) => user.status === "active")
    .filter((user) => !blockedUsers.has(user.id))
    .filter((user) => !likedUsers.has(user.id))
    .filter((user) => !passedUsers.has(user.id))
    .filter((user) => isProfileEligibleForDiscovery(user))
    .map((user) => ({ user, profile: getProfileByUserId(user.id), interests: getUserInterests(user.id).map((interest) => interest.interestId.toLowerCase()) }))
    .filter(({ profile }) => Boolean(profile))
    .filter(({ user, profile }) => {
      const preferences = getPreferencesByUserId(user.id);
      if (!preferences) {
        return true;
      }

      const targetAge = profile && profile.dateOfBirth ? new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear() : 0;
      const matchesAge = targetAge >= (preferences.ageMin ?? 18) && targetAge <= (preferences.ageMax ?? 70);
      const matchesGender = preferences.preferredGender.length === 0 || preferences.preferredGender.includes(profile?.gender ?? "prefer-not-to-say");
      const matchesIntent = preferences.relationshipIntent.length === 0 || preferences.relationshipIntent.includes(profile?.relationshipIntent ?? "serious-dating");
      return matchesAge && matchesGender && matchesIntent;
    })
    .filter(({ user }) => {
      const preferences = currentPreferences;
      if (!preferences || preferences.preferredGender.length === 0) {
        return true;
      }
      const profile = getProfileByUserId(user.id);
      return preferences.preferredGender.includes(profile?.gender ?? "prefer-not-to-say");
    })
    .map(({ user, profile, interests }) => {
      const candidateProfile = buildPublicProfile(user, profile ?? null, interests, getLifestyleByUserId(user.id), currentInterests);
      const currentProfileRow = currentProfile ?? null;
      const snapshot = getCompatibilitySnapshot(currentProfileRow, currentPreferences, interests, currentInterests);
      return {
        ...candidateProfile,
        compatibilityLabel: snapshot.compatibilityLabel,
        sharedInterests: snapshot.sharedInterests,
      };
    })
    .sort((a, b) => b.sharedInterests - a.sharedInterests || a.age - b.age)
    .slice(0, 25);
}

export function getPublicProfileByUserId(targetUserId: number, viewerUserId: number) {
  const user = getUserById(targetUserId);
  if (!user || !isProfileEligibleForDiscovery(user)) {
    return null;
  }

  const profile = getProfileByUserId(targetUserId);
  if (!profile) {
    return null;
  }

  const viewerInterests = getUserInterests(viewerUserId).map((interest) => interest.interestId.toLowerCase());
  const candidateInterests = getUserInterests(targetUserId).map((interest) => interest.interestId.toLowerCase());
  const candidatePublic = buildPublicProfile(user, profile, candidateInterests, getLifestyleByUserId(targetUserId), viewerInterests);
  const snapshot = getCompatibilitySnapshot(getProfileByUserId(viewerUserId) ?? null, getPreferencesByUserId(viewerUserId), candidateInterests, viewerInterests);
  return {
    ...candidatePublic,
    compatibilityLabel: snapshot.compatibilityLabel,
    sharedInterests: snapshot.sharedInterests,
  };
}

export function canUserBeDisplayed(currentUserId: number, targetUserId: number) {
  if (currentUserId === targetUserId) {
    return false;
  }

  const user = getUserById(targetUserId);
  if (!user || !isProfileEligibleForDiscovery(user)) {
    return false;
  }

  const likes = getLikesByUserId(currentUserId).some((like) => like.toUserId === targetUserId);
  const passes = getPassesByUserId(currentUserId).some((pass) => pass.toUserId === targetUserId);
  const blocked = getBlockedUserIds(currentUserId).includes(targetUserId);
  return !likes && !passes && !blocked;
}

export function getDiscoverCountForUser(userId: number) {
  return getDiscoverProfiles(userId).length;
}

export function getActiveUserCount() {
  return getUserCount();
}
