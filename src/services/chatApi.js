/**
 * Chat API service — manages multiple chats per user.
 */
import { authHeaders } from './auth';

/** List all chats for current user (sorted newest first). */
export async function listChats() {
  const r = await fetch('/api/chats', { headers: authHeaders() });
  if (!r.ok) return { chats: [], activeChatId: null };
  return await r.json();
}

/** Create a new chat. Returns { chatId, chat }. */
export async function createChat() {
  const r = await fetch('/api/chats', { method: 'POST', headers: authHeaders() });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error);
  return d;
}

/** Load a specific chat with full messages. */
export async function loadChat(chatId) {
  const r = await fetch(`/api/chats/${chatId}`, { headers: authHeaders() });
  if (!r.ok) return null;
  const d = await r.json();
  return d.chat;
}

/** Update chat metadata (questionnaires, title). */
export async function updateChat(chatId, updates) {
  await fetch(`/api/chats/${chatId}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(updates),
  });
}

/** Delete a specific chat. Returns { ok, activeChatId }. */
export async function deleteChat(chatId) {
  const r = await fetch(`/api/chats/${chatId}`, { method: 'DELETE', headers: authHeaders() });
  return await r.json();
}

/** Send a message to the LLM. chatId is passed for auto-save. */
export async function sendChatMessage(messages, systemPrompt, chatId) {
  const r = await fetch('/api/chat', {
    method: 'POST', headers: authHeaders(),
    body: JSON.stringify({ messages, systemPrompt, chatId }),
  });
  const d = await r.json();
  return d.content || "I'm having trouble right now. If you're in crisis, call 988.";
}
