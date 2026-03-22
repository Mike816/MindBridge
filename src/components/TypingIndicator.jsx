import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="message assistant fade-in">
      <div className="message-avatar">M</div>
      <div className="message-bubble">
        <div className="typing-indicator">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}
