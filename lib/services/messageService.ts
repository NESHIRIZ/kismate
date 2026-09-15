import {
  createMessage,
  getConversationById,
  getMessagesByConversationId,
  getUnreadMessageCountForUser,
  isConversationParticipant,
  markMessagesAsRead,
} from "@/lib/db";

export function sanitizePlainText(value: string) {
  return value
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, (raw) => (raw === "<" ? "&lt;" : "&gt;"))
    .trim();
}

export function getConversationMessages(conversationId: number, userId: number, limit = 200) {
  const conversation = getConversationById(conversationId);
  if (!conversation || !isConversationParticipant(conversationId, userId)) {
    return [];
  }

  return getMessagesByConversationId(conversationId).slice(-limit);
}

export function createMessageForConversation(conversationId: number, senderId: number, body: string) {
  const conversation = getConversationById(conversationId);
  if (!conversation || !isConversationParticipant(conversationId, senderId)) {
    return null;
  }

  const sanitized = sanitizePlainText(body);
  if (!sanitized || sanitized.length > 2000) {
    return null;
  }

  return createMessage({
    conversationId,
    senderId,
    body: sanitized,
  });
}

export function markConversationAsRead(conversationId: number, userId: number) {
  const conversation = getConversationById(conversationId);
  if (!conversation || !isConversationParticipant(conversationId, userId)) {
    return 0;
  }

  return markMessagesAsRead(conversationId, userId);
}

export function getUnreadCountForUser(userId: number, conversationId?: number) {
  return getUnreadMessageCountForUser(userId, conversationId);
}
