import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AuthScreen from './components/AuthScreen';
import DisclosureScreen from './components/DisclosureScreen';
import ConsentForm from './components/ConsentForm';
import ChatView from './components/ChatView';
import ChatList from './components/ChatList';
import QuestionnaireRunner from './components/QuestionnaireRunner';
import useSessionData from './hooks/useSessionData';
import useChat from './hooks/useChat';
import { register, login, verifyAuth, clearAuth, setConsent, deleteAccount } from './services/auth';
import { listChats, createChat, loadChat, deleteChat } from './services/chatApi';

export default function App() {
  const [phase, setPhase] = useState('loading');
  const [consent, setConsentState] = useState([false, false, false, false]);
  const [username, setUsername] = useState(null);

  // ── Multi-chat state ───────────────────────────────────────
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatListOpen, setChatListOpen] = useState(false);

  const getChatIdCb = useCallback(() => activeChatId, [activeChatId]);
  const { sessionData, addQuestionnaireResult, buildAssessmentContext, hydrateFromChat, resetSessionData } = useSessionData(getChatIdCb);
  const { messages, loading, initChat, sendMessage, sendSystemContext } = useChat(buildAssessmentContext, getChatIdCb);

  const [activeQuestionnaire, setActiveQuestionnaire] = useState(null);
  const [showQPicker, setShowQPicker] = useState(false);
  const [input, setInput] = useState('');

  // ── Init ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const auth = await verifyAuth();
      if (!auth) return setPhase('auth');

      setUsername(auth.username);
      if (!auth.consent) return setPhase('disclosure');

      // Load chat list
      const { chats: chatList, activeChatId: activeId } = await listChats();
      setChats(chatList);

      if (activeId) {
        const chat = await loadChat(activeId);
        if (chat) {
          setActiveChatId(activeId);
          hydrateFromChat(chat);
          initChat(chat.messages?.length > 0 ? chat.messages : null);
          return setPhase('chat');
        }
      }

      // No active chat — create one
      if (chatList.length === 0) {
        const { chatId, chat } = await createChat();
        setChats([chat]);
        setActiveChatId(chatId);
        initChat();
      } else {
        // Load the most recent one
        const first = chatList[0];
        const chat = await loadChat(first.id);
        setActiveChatId(first.id);
        if (chat) { hydrateFromChat(chat); initChat(chat.messages?.length > 0 ? chat.messages : null); }
        else initChat();
      }
      setPhase('chat');
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Refresh chat list ──────────────────────────────────────
  const refreshChats = async () => {
    const { chats: chatList } = await listChats();
    setChats(chatList);
  };

  // ── Auth ───────────────────────────────────────────────────
  const handleAuth = async (mode, user, pass) => {
    const data = mode === 'register' ? await register(user, pass) : await login(user, pass);
    setUsername(data.username);

    // Check if user has consent
    const auth = await verifyAuth();
    if (auth?.consent) {
      const { chats: chatList, activeChatId: activeId } = await listChats();
      setChats(chatList);
      if (chatList.length > 0) {
        const id = activeId || chatList[0].id;
        const chat = await loadChat(id);
        setActiveChatId(id);
        if (chat) { hydrateFromChat(chat); initChat(chat.messages?.length > 0 ? chat.messages : null); }
        else initChat();
        setPhase('chat');
      } else {
        const { chatId, chat } = await createChat();
        setChats([chat]);
        setActiveChatId(chatId);
        initChat();
        setPhase('chat');
      }
    } else {
      setPhase('disclosure');
    }
  };

  const handleLogout = () => { clearAuth(); setUsername(null); setActiveChatId(null); setChats([]); setPhase('auth'); };

  // ── Consent ────────────────────────────────────────────────
  const handleStartChat = async () => {
    await setConsent();
    const { chatId, chat } = await createChat();
    setChats([chat]);
    setActiveChatId(chatId);
    initChat();
    setPhase('chat');
  };

  // ── Chat switching ─────────────────────────────────────────
  const handleSelectChat = async (chatId) => {
    if (chatId === activeChatId) return;
    const chat = await loadChat(chatId);
    if (!chat) return;
    setActiveChatId(chatId);
    hydrateFromChat(chat);
    initChat(chat.messages?.length > 0 ? chat.messages : null);
    setShowQPicker(false);
    setActiveQuestionnaire(null);
    setPhase('chat');
    await refreshChats();
  };

  const handleNewChat = async () => {
    const { chatId, chat } = await createChat();
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chatId);
    resetSessionData();
    initChat();
    setShowQPicker(false);
    setActiveQuestionnaire(null);
    setPhase('chat');
    setChatListOpen(false);
  };

  const handleDeleteChat = async (chatId) => {
    const { activeChatId: newActiveId } = await deleteChat(chatId);
    setChats((prev) => prev.filter((c) => c.id !== chatId));

    if (chatId === activeChatId) {
      if (newActiveId) {
        const chat = await loadChat(newActiveId);
        setActiveChatId(newActiveId);
        if (chat) { hydrateFromChat(chat); initChat(chat.messages?.length > 0 ? chat.messages : null); }
        else initChat();
      } else {
        // No chats left — create a new one
        const { chatId: newId, chat: newChat } = await createChat();
        setChats([newChat]);
        setActiveChatId(newId);
        resetSessionData();
        initChat();
      }
    }
  };

  // ── Questionnaires ─────────────────────────────────────────
  const handleSelectQuestionnaire = (name) => { setActiveQuestionnaire(name); setShowQPicker(false); setPhase('questionnaire'); };

  const handleQuestionnaireComplete = async (result) => {
    const name = activeQuestionnaire;
    await addQuestionnaireResult(name, result);
    setActiveQuestionnaire(null);
    setPhase('chat');
    await sendSystemContext(`[SYSTEM: User completed ${name}. Score: ${result.score}/${result.maxScore}, severity: "${result.severity}". Acknowledge results, explain the score, suggest next steps. Be warm. This is screening, not diagnosis. Do NOT re-ask questions.]`);
    await refreshChats();
  };

  const handleSend = async (text) => {
    const toSend = text || input;
    if (!toSend.trim()) return;
    await sendMessage(toSend);
    setInput('');
    await refreshChats(); // Update titles/timestamps
  };

  const handleDeleteAccount = async () => { await deleteAccount(); resetSessionData(); setUsername(null); setActiveChatId(null); setChats([]); setPhase('auth'); };

  // ── Render ─────────────────────────────────────────────────
  if (phase === 'loading') {
    return <div className="app-container"><Header /><div className="main-scroll" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-dim)' }}>Loading...</p></div></div>;
  }

  return (
    <div className="app-container">
      <Header
        username={username}
        onLogout={username ? handleLogout : null}
        onDeleteAccount={username ? handleDeleteAccount : null}
        onToggleChatList={phase === 'chat' ? () => setChatListOpen((v) => !v) : null}
      />

      {/* Chat list sidebar — only visible in chat phase */}
      {phase === 'chat' && (
        <div className="app-body">
          {chatListOpen && <div className="chat-list-backdrop" onClick={() => setChatListOpen(false)} />}
          <ChatList
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            isOpen={chatListOpen}
            onClose={() => setChatListOpen(false)}
          />
          <ChatView
            messages={messages} loading={loading} input={input} setInput={setInput}
            onSend={handleSend} sessionData={sessionData} showQPicker={showQPicker}
            setShowQPicker={setShowQPicker} onSelectQuestionnaire={handleSelectQuestionnaire}
          />
        </div>
      )}

      {phase === 'auth' && <div className="main-scroll"><AuthScreen onAuth={handleAuth} /></div>}
      {phase === 'disclosure' && <div className="main-scroll"><DisclosureScreen onContinue={() => setPhase('consent')} /></div>}
      {phase === 'consent' && <div className="main-scroll"><ConsentForm consent={consent} setConsent={setConsentState} onBack={() => setPhase('disclosure')} onAccept={handleStartChat} /></div>}

      {phase === 'questionnaire' && activeQuestionnaire && (
        <div className="main-scroll"><QuestionnaireRunner name={activeQuestionnaire} onComplete={handleQuestionnaireComplete} onExit={() => { setActiveQuestionnaire(null); setPhase('chat'); }} /></div>
      )}
    </div>
  );
}
