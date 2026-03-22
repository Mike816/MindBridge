import React, { useEffect, useRef, useMemo, useState } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatInputBar from './ChatInputBar';
import SuggestionChips from './SuggestionChips';
import CrisisBanner from './CrisisBanner';
import ResultCard from './ResultCard';
import QuestionnairePicker from './QuestionnairePicker';
import { ExternalLink, Clipboard } from './Icons';
import RESOURCES from '../data/resources';
import '../styles/Chat.css';

/** Map questionnaire keys → resource categories */
const Q_TO_RESOURCE = {
  'PHQ-9':     ['depression', 'support', 'treatment', 'student'],
  'BDI':       ['depression', 'support', 'treatment', 'student'],
  'MDQ':       ['depression', 'support', 'treatment', 'providers'],
  'KADS':      ['depression', 'support', 'student'],
  'GAD-7':     ['anxiety', 'support', 'treatment', 'student'],
  'BAI':       ['anxiety', 'support', 'treatment'],
  'PAS':       ['anxiety', 'support', 'treatment', 'providers'],
  'PSS':       ['stress', 'support', 'student'],
  'PCL-5':     ['ptsd', 'support', 'treatment', 'student'],
  'ACE':       ['ptsd', 'support', 'treatment', 'violence'],
  'ASRS-v1.1': ['adhd', 'support', 'providers'],
  'Vanderbilt': ['adhd', 'support', 'providers'],
  'C-SSRS':    ['crisis', 'treatment', 'support'],
  'ISI':       ['sleep', 'support', 'student'],
  'AQ':        ['support', 'providers', 'treatment'],
  'OCI':       ['anxiety', 'support', 'providers', 'treatment'],
};

export default function ChatView({
  messages,
  loading,
  input,
  setInput,
  onSend,
  sessionData,
  showQPicker,
  setShowQPicker,
  onSelectQuestionnaire,
}) {
  const scrollRef = useRef(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const completedKeys = Object.keys(sessionData.questionnaires);
  const showCrisis = sessionData.questionnaires['C-SSRS']?.score > 0;
  const hasResults = completedKeys.length > 0;

  // Build deduplicated resource list based on completed questionnaires
  const recommendedResources = useMemo(() => {
    const seen = new Set();
    const results = [];

    // Always show crisis resources first if C-SSRS flagged
    if (showCrisis) {
      for (const r of RESOURCES.crisis) {
        if (!seen.has(r.name)) { seen.add(r.name); results.push(r); }
      }
    }

    // Add resources based on each completed questionnaire
    for (const qKey of completedKeys) {
      const categories = Q_TO_RESOURCE[qKey] || ['general'];
      for (const cat of categories) {
        for (const r of (RESOURCES[cat] || [])) {
          if (!seen.has(r.name)) { seen.add(r.name); results.push(r); }
        }
      }
    }

    return results;
  }, [completedKeys, showCrisis]);

  return (
    <>
      <div className={`chat-layout ${hasResults ? 'has-sidebar' : ''}`}>
        {/* ── Left: Chat column ── */}
        <div className="chat-column">
          <div className="main-scroll" ref={scrollRef}>
            {showCrisis && <CrisisBanner />}

            <div className="chat-messages">
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} onStartQuestionnaire={onSelectQuestionnaire} />
              ))}
              {loading && <TypingIndicator />}
            </div>

            {showQPicker && (
              <QuestionnairePicker
                completedKeys={completedKeys}
                onSelect={onSelectQuestionnaire}
                onClose={() => setShowQPicker(false)}
              />
            )}

            {messages.length <= 2 && !loading && (
              <SuggestionChips
                onSelect={(text) => { setInput(''); onSend(text); }}
                onRequestAssessments={() => setShowQPicker(true)}
              />
            )}
          </div>

          <ChatInputBar
            value={input}
            onChange={setInput}
            onSend={() => { onSend(input); setInput(''); }}
            disabled={loading}
            onToggleAssessments={() => setShowQPicker((v) => !v)}
            extraButtons={hasResults ? (
              <button
                className="btn btn-secondary mobile-sidebar-toggle"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Clipboard /> Results & Resources
              </button>
            ) : null}
          />
        </div>

        {/* ── Right: Sidebar — split into Results + Resources ── */}
        {hasResults && (
          <aside className={`results-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
            {/* Mobile close header */}
            <div className="mobile-sidebar-close">
              <h3>Results & Resources</h3>
              <button onClick={() => setMobileSidebarOpen(false)}>Close</button>
            </div>
            {/* Top half: Your Results */}
            <div className="sidebar-section">
              <div className="sidebar-header">
                <h3>Your Results</h3>
              </div>
              <div className="sidebar-scroll">
                {completedKeys.map((name) => (
                  <ResultCard key={name} name={name} data={sessionData.questionnaires[name]} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="sidebar-divider" />

            {/* Bottom half: Recommended Resources */}
            <div className="sidebar-section">
              <div className="sidebar-header">
                <h3>Recommended Resources</h3>
              </div>
              <div className="sidebar-scroll">
                {recommendedResources.map((r, i) => (
                  <div key={`${r.name}-${i}`} className="resource-card">
                    <div className="r-info">
                      <div className="r-name">{r.name}</div>
                      <div className="r-contact">{r.contact}</div>
                      <div className="r-avail">{r.available}</div>
                      {r.note && <div className="r-note">{r.note}</div>}
                    </div>
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noopener noreferrer">
                        Visit <ExternalLink />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
