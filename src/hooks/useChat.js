import { useState, useCallback } from 'react';
import { sendChatMessage } from '../services/chatApi';
import { SYSTEM_PROMPT } from '../services/llm';

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Welcome to MindBridge. I'm here to listen and help connect you with the right support. Everything we discuss stays private and encrypted.\n\nTo get started, could you tell me a little about what's been on your mind lately? There's no wrong answer — whatever you're comfortable sharing.",
};

export default function useChat(buildAssessmentContext, getChatId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const initChat = useCallback((existingMessages = null) => {
    if (existingMessages && existingMessages.length > 0) {
      setMessages(existingMessages);
    } else {
      setMessages([WELCOME_MESSAGE]);
    }
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const contextNote = buildAssessmentContext();
    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.role === 'user' && m === userMsg && contextNote ? m.content + contextNote : m.content,
    }));

    const chatId = getChatId ? getChatId() : null;
    const reply = await sendChatMessage(apiMessages, SYSTEM_PROMPT, chatId);
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  }, [messages, buildAssessmentContext, getChatId]);

  const sendSystemContext = useCallback(async (hiddenContext) => {
    setLoading(true);
    const contextNote = buildAssessmentContext();
    const apiMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: hiddenContext + contextNote },
    ];
    const chatId = getChatId ? getChatId() : null;
    const reply = await sendChatMessage(apiMessages, SYSTEM_PROMPT, chatId);
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  }, [messages, buildAssessmentContext, getChatId]);

  return { messages, loading, initChat, sendMessage, sendSystemContext };
}
