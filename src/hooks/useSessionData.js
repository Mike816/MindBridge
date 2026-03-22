import { useState, useCallback } from 'react';
import { updateChat } from '../services/chatApi';

export default function useSessionData(getChatId) {
  const [sessionData, setSessionData] = useState({ questionnaires: {} });

  const addQuestionnaireResult = useCallback(async (name, result) => {
    const updatedQ = { ...sessionData.questionnaires, [name]: result };
    setSessionData((prev) => ({ ...prev, questionnaires: updatedQ }));
    const chatId = getChatId ? getChatId() : null;
    if (chatId) await updateChat(chatId, { questionnaires: updatedQ });
    return updatedQ;
  }, [sessionData.questionnaires, getChatId]);

  const buildAssessmentContext = useCallback(() => {
    const entries = Object.entries(sessionData.questionnaires);
    if (entries.length === 0) return '';
    return '\n\nCompleted assessments:\n' + entries.map(([n, d]) => `${n}: ${d.score}/${d.maxScore} — ${d.severity}`).join('\n');
  }, [sessionData.questionnaires]);

  const hydrateFromChat = useCallback((chatData) => {
    setSessionData({ questionnaires: chatData?.questionnaires || {} });
  }, []);

  const resetSessionData = useCallback(() => {
    setSessionData({ questionnaires: {} });
  }, []);

  return { sessionData, addQuestionnaireResult, buildAssessmentContext, hydrateFromChat, resetSessionData };
}
