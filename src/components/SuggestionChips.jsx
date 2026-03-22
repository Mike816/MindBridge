import React from 'react';

const DEFAULT_SUGGESTIONS = [
  "I've been feeling really anxious lately",
  "I'm having trouble sleeping",
  'I feel overwhelmed with school',
  "I'd like to take a screening questionnaire",
];

export default function SuggestionChips({ onSelect, onRequestAssessments }) {
  const handleClick = (text) => {
    if (text.includes('questionnaire')) {
      onRequestAssessments();
    } else {
      onSelect(text);
    }
  };

  return (
    <div className="suggestion-chips fade-up" style={{ animationDelay: '0.3s' }}>
      {DEFAULT_SUGGESTIONS.map((s) => (
        <button key={s} className="chip" onClick={() => handleClick(s)}>
          {s}
        </button>
      ))}
    </div>
  );
}
