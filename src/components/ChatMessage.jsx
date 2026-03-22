import React from 'react';

const QUESTIONNAIRE_KEYS = [
  'PHQ-9', 'BDI', 'MDQ', 'KADS',
  'GAD-7', 'BAI', 'PAS', 'PSS',
  'PCL-5', 'ACE',
  'ASRS-v1.1', 'Vanderbilt',
  'C-SSRS', 'ISI', 'AQ', 'OCI',
];

const Q_TAG_REGEX = new RegExp(
  `\\[(${QUESTIONNAIRE_KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\]`,
  'g',
);

/**
 * Lightweight inline markdown → React elements.
 * Handles: **bold**, *italic*, [Questionnaire] buttons.
 */
function renderInline(text, onStartQuestionnaire, keyPrefix = '') {
  // First pass: questionnaire tags
  Q_TAG_REGEX.lastIndex = 0;
  const segments = [];
  let last = 0;
  let m;

  while ((m = Q_TAG_REGEX.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: 'text', value: text.slice(last, m.index) });
    segments.push({ type: 'qbutton', value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ type: 'text', value: text.slice(last) });

  // Second pass: bold / italic within text segments
  return segments.map((seg, i) => {
    if (seg.type === 'qbutton') {
      return onStartQuestionnaire ? (
        <button
          key={`${keyPrefix}-q-${i}`}
          className="chip"
          style={{ display: 'inline-flex', margin: '2px 4px', verticalAlign: 'middle' }}
          onClick={() => onStartQuestionnaire(seg.value)}
        >
          Start {seg.value}
        </button>
      ) : `[${seg.value}]`;
    }

    // Process bold and italic
    const parts = [];
    const boldItalicRe = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let lastIdx = 0;
    let match;
    const t = seg.value;

    while ((match = boldItalicRe.exec(t)) !== null) {
      if (match.index > lastIdx) {
        parts.push(<span key={`${keyPrefix}-t-${i}-${lastIdx}`}>{t.slice(lastIdx, match.index)}</span>);
      }
      if (match[2]) {
        parts.push(<strong key={`${keyPrefix}-bi-${i}-${match.index}`}><em>{match[2]}</em></strong>);
      } else if (match[3]) {
        parts.push(<strong key={`${keyPrefix}-b-${i}-${match.index}`}>{match[3]}</strong>);
      } else if (match[4]) {
        parts.push(<em key={`${keyPrefix}-i-${i}-${match.index}`}>{match[4]}</em>);
      }
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < t.length) {
      parts.push(<span key={`${keyPrefix}-t-${i}-${lastIdx}`}>{t.slice(lastIdx)}</span>);
    }
    return parts.length > 0 ? parts : t;
  });
}

/**
 * Parse full message content into block-level React elements.
 * Handles: headers (##), bullet lists (* / -), paragraphs.
 */
function renderMarkdown(content, onStartQuestionnaire) {
  const lines = content.split('\n');
  const elements = [];
  let currentList = [];
  let key = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${key++}`} style={{ margin: '6px 0', paddingLeft: '20px', listStyle: 'disc' }}>
          {currentList.map((item, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>
              {renderInline(item, onStartQuestionnaire, `li-${key}-${i}`)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Bullet point: * or -
    const bulletMatch = trimmed.match(/^[\*\-]\s+(.+)$/);
    if (bulletMatch) {
      currentList.push(bulletMatch[1]);
      continue;
    }

    // Not a bullet — flush any pending list
    flushList();

    // Empty line
    if (trimmed === '') {
      continue;
    }

    // Header: ## or ###
    const headerMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const Tag = level === 1 ? 'h3' : level === 2 ? 'h4' : 'h5';
      elements.push(
        <Tag key={`h-${key++}`} style={{ margin: '12px 0 4px', fontSize: level === 1 ? '15px' : level === 2 ? '14px' : '13px', fontWeight: 600 }}>
          {renderInline(headerMatch[2], onStartQuestionnaire, `h-${key}`)}
        </Tag>
      );
      continue;
    }

    // Bold-only line (acts as sub-header): **Some Title**
    const boldLineMatch = trimmed.match(/^\*\*(.+)\*\*$/);
    if (boldLineMatch) {
      elements.push(
        <p key={`bh-${key++}`} style={{ fontWeight: 600, margin: '10px 0 4px' }}>
          {renderInline(boldLineMatch[1], onStartQuestionnaire, `bh-${key}`)}
        </p>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${key++}`}>
        {renderInline(trimmed, onStartQuestionnaire, `p-${key}`)}
      </p>
    );
  }

  flushList();
  return elements;
}

export default function ChatMessage({ role, content, onStartQuestionnaire }) {
  return (
    <div className={`message ${role}`}>
      <div className="message-avatar">
        {role === 'assistant' ? 'M' : 'U'}
      </div>
      <div className="message-bubble">
        {role === 'assistant'
          ? renderMarkdown(content, onStartQuestionnaire)
          : content.split('\n').map((line, i) => <p key={i}>{line}</p>)
        }
      </div>
    </div>
  );
}

