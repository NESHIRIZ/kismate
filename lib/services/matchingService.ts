import { createMatch, findMatch, getMatchesByUserId, getUserById, getUserInterests, hasLiked, getLikesByUserId, getPassesByUserId } from "@/lib/db";
import { type MatchRecord } from "@/lib/kismate";

export function hasMutualLike(userAId: number, userBId: number): boolean {
  return hasLiked(userAId, userBId) && hasLiked(userBId, userAId);
}

export function createMutualMatchIfNeeded(userAId: number, userBId: number): MatchRecord | null {
  if (userAId === userBId) {
    return null;
  }

  if (!hasLiked(userAId, userBId) || !hasLiked(userBId, userAId)) {
    return null;
  }

  const existing = findMatch(userAId, userBId);
  if (existing) {
    return existing;
  }

  return createMatch(userAId, userBId);
}

export function getMatchesForUser(userId: number) {
  return getMatchesByUserId(userId);
}

export function getUserLikeState(currentUserId: number, targetUserId: number) {
  if (currentUserId === targetUserId) {
    return "self" as const;
  }

  if (hasLiked(currentUserId, targetUserId)) {
    return "liked" as const;
  }

  if (getPassesByUserId(currentUserId).some((pass) => pass.toUserId === targetUserId)) {
    return "passed" as const;
  }

  return "not-interacted" as const;
}

export function getIncomingLikeCount(userId: number) {
  return getLikesByUserId(userId).length;
}

export function getActiveMatchCount(userId: number) {
  return getMatchesByUserId(userId).length;
}

export function canCreateMatch(userAId: number, userBId: number) {
  const userA = getUserById(userAId);
  const userB = getUserById(userBId);
  if (!userA || !userB) {
    return false;
  }

  return hasLiked(userAId, userBId) && hasLiked(userBId, userAId) && !findMatch(userAId, userBId);
}

export function getPeopleYouLiked(userId: number) {
  return getLikesByUserId(userId).map((like) => ({
    ...like,
    user: getUserById(like.toUserId),
    interests: getUserInterests(like.toUserId).map((interest) => interest.interestId),
  }));
}
