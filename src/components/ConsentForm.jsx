import React from 'react';
import { Check } from './Icons';
import CONSENT_ITEMS from '../data/consentItems';
import '../styles/Disclosure.css';

export default function ConsentForm({ consent, setConsent, onBack, onAccept }) {
  const allChecked = consent.every(Boolean);

  const toggle = (index) => {
    const next = [...consent];
    next[index] = !next[index];
    setConsent(next);
  };

  return (
    <div className="disclosure-card fade-up">
      <h2>Consent Form</h2>
      <p className="subtitle">
        Please review and acknowledge each item below to continue. Your consent
        is required before we can begin.
      </p>

      <div className="consent-checks">
        {CONSENT_ITEMS.map((text, i) => (
          <div
            key={i}
            className={`consent-check ${consent[i] ? 'checked' : ''}`}
            onClick={() => toggle(i)}
          >
            <div className="check-box">{consent[i] && <Check />}</div>
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <button className="btn btn-ghost" onClick={onBack}>Back</button>
        <button className="btn btn-primary" disabled={!allChecked} onClick={onAccept}>
          I Consent — Begin Session
        </button>
      </div>
    </div>
  );
}
