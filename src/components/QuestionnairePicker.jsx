import React from 'react';
import QUESTIONNAIRES from '../data/questionnaires';

const CATEGORIES = [
  'Depression & Mood',
  'Anxiety & Stress',
  'PTSD & Trauma',
  'ADHD & Developmental',
  'Specialized',
];

export default function QuestionnairePicker({ completedKeys, onSelect, onClose }) {
  const grouped = {};
  for (const cat of CATEGORIES) grouped[cat] = [];
  for (const [key, q] of Object.entries(QUESTIONNAIRES)) {
    const cat = q.category || 'Other';
    if (grouped[cat]) grouped[cat].push({ key, ...q });
    else { grouped[cat] = [{ key, ...q }]; }
  }

  return (
    <div className="fade-up" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '16px' }}>Available Assessments</h3>
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
      </div>

      {CATEGORIES.map((cat) => {
        const items = grouped[cat];
        if (!items || items.length === 0) return null;
        return (
          <div key={cat} style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent)', marginBottom: '8px' }}>
              {cat}
            </div>
            <div className="q-picker-grid">
              {items.map(({ key, description, questions }) => {
                const done = completedKeys.includes(key);
                return (
                  <div
                    key={key}
                    className={`q-picker-card ${done ? 'completed' : ''}`}
                    onClick={() => !done && onSelect(key)}
                  >
                    <h4>{key}</h4>
                    <p>{description}</p>
                    <div className="q-len">{questions.length} questions{done && ' · Completed'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
