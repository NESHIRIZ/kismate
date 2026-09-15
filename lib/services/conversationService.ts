import {
  getConversationById,
  getConversationByMatchId,
  getConversationsByUserId,
  getMatchesByUserId,
  getProfileByUserId,
  getUserById,
  getUserInterests,
  getUnreadMessageCountForUser,
  isConversationParticipant,
  createConversationForMatch,
} from "@/lib/db";
import { buildPublicProfile } from "@/lib/services/publicProfileService";
import { getLifestyleByUserId } from "@/lib/db";

export type ConversationListItem = {
  id: number;
  matchId: number;
  otherParticipant: {
    id: number;
    name: string;
    age: number;
    city: string;
    country: string;
    profilePhoto: string;
    headline: string;
  };
  lastMessagePreview: string;
  lastMessageAt: string;
  unreadCount: number;
};

export function getConversationByMatchIdForUser(matchId: number, userId: number) {
  const match = getMatchesByUserId(userId).find((entry) => entry.id === matchId);
  if (!match) {
    return null;
  }

  const conversation = getConversationByMatchId(matchId);
  if (!conversation) {
    return null;
  }

  return conversation;
}

export function ensureConversationForMatch(matchId: number, userId: number) {
  const match = getMatchesByUserId(userId).find((entry) => entry.id === matchId);
  if (!match) {
    return null;
  }

  const existing = getConversationByMatchId(matchId);
  if (existing) {
    return existing;
  }

  return createConversationForMatch(matchId, [match.userAId, match.userBId]);
}

export function isUserParticipantInConversation(conversationId: number, userId: number) {
  return isConversationParticipant(conversationId, userId);
}

export function getUserConversations(userId: number): ConversationListItem[] {
  return getConversationsByUserId(userId)
    .map((conversation) => {
      const otherParticipantId = conversation.participantIds.find((participantId) => participantId !== userId);
      if (!otherParticipantId) {
        return null;
      }

      const otherUser = getUserById(otherParticipantId);
      if (!otherUser) {
        return null;
      }

      const profile = getProfileByUserId(otherUser.id);
      const publicProfile = buildPublicProfile(
        otherUser,
        profile ?? null,
        getUserInterests(otherUser.id).map((interest) => interest.interestId.toLowerCase()),
        getLifestyleByUserId(otherUser.id),
        [],
      );

      return {
        id: conversation.id,
        matchId: conversation.matchId,
        otherParticipant: {
          id: otherUser.id,
          name: publicProfile.name,
          age: publicProfile.age,
          city: publicProfile.city,
          country: publicProfile.country,
          profilePhoto: publicProfile.profilePhoto,
          headline: publicProfile.headline,
        },
        lastMessagePreview: conversation.lastMessagePreview ?? "Start the conversation",
        lastMessageAt: conversation.lastMessageAt ?? conversation.createdAt,
        unreadCount: getUnreadMessageCountForUser(userId, conversation.id),
      };
    })
    .filter((conversation): conversation is ConversationListItem => Boolean(conversation))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export function getConversationDetails(conversationId: number, userId: number) {
  const conversation = getConversationById(conversationId);
  if (!conversation || !isConversationParticipant(conversationId, userId)) {
    return null;
  }

  const otherParticipantId = conversation.participantIds.find((participantId) => participantId !== userId);
  if (!otherParticipantId) {
    return null;
  }

  const otherUser = getUserById(otherParticipantId);
  if (!otherUser) {
    return null;
  }

  const profile = getProfileByUserId(otherUser.id);
  const publicProfile = buildPublicProfile(
    otherUser,
    profile ?? null,
    getUserInterests(otherUser.id).map((interest) => interest.interestId.toLowerCase()),
    getLifestyleByUserId(otherUser.id),
    [],
  );

  return {
    id: conversation.id,
    matchId: conversation.matchId,
    participantIds: conversation.participantIds,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    lastMessageAt: conversation.lastMessageAt ?? conversation.createdAt,
    lastMessagePreview: conversation.lastMessagePreview ?? "Start the conversation",
    otherParticipant: {
      id: otherUser.id,
      name: publicProfile.name,
      age: publicProfile.age,
      city: publicProfile.city,
      country: publicProfile.country,
      profilePhoto: publicProfile.profilePhoto,
      headline: publicProfile.headline,
    },
  };
}
