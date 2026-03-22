import React from 'react';

function getSeverityClass(severity) {
  const s = severity.toLowerCase();
  if (s.includes('severe') || s.includes('high')) return 'severity-severe';
  if (s.includes('moderate') || s.includes('probable')) return 'severity-moderate';
  if (s.includes('mild') || s.includes('subthreshold')) return 'severity-mild';
  return 'severity-minimal';
}

export default function ResultCard({ name, data }) {
  return (
    <div className="result-card fade-in">
      <h3>{name} Results</h3>
      <div className="result-score">
        <span className="score-num">{data.score}</span>
        <span className="score-label">/ {data.maxScore}</span>
      </div>
      <span className={`result-severity ${getSeverityClass(data.severity)}`}>
        {data.severity}
      </span>
      <p className="result-note">
        This screening result is informational only and is not a clinical
        diagnosis. Please discuss with a healthcare provider.
      </p>
    </div>
  );
}
