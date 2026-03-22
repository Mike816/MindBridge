import React, { useRef } from 'react';
import { Send, Clipboard } from './Icons';

export default function ChatInputBar({ value, onChange, onSend, disabled, onToggleAssessments, extraButtons }) {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInput = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  return (
    <div className="chat-input-bar">
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <button
          className="btn btn-secondary"
          style={{ fontSize: '12px', padding: '6px 12px' }}
          onClick={onToggleAssessments}
        >
          <Clipboard /> Assessments
        </button>
        {extraButtons}
      </div>
      <div className="chat-input-wrap">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Type your message..."
          rows={1}
        />
        <button
          className="send-btn"
          disabled={!value.trim() || disabled}
          onClick={onSend}
        >
          <Send />
        </button>
      </div>
    </div>
  );
}
