import React from 'react';
import { Shield, Lock, AlertTriangle } from './Icons';
import '../styles/Disclosure.css';

export default function DisclosureScreen({ onContinue }) {
  return (
    <div className="disclosure-card fade-up">
      <h2>Before We Begin</h2>
      <p className="subtitle">
        MindBridge is a student mental health support tool. Before we start,
        here's how your data is handled and what this tool can and cannot do.
      </p>

      <div className="disclosure-section" style={{ animationDelay: '0.1s' }}>
        <h3><Shield /> What This Tool Does</h3>
        <p>
          MindBridge helps you explore your mental health through guided
          conversations and validated screening questionnaires. It connects you
          with appropriate resources based on your needs. It is not a substitute
          for professional mental health care.
        </p>
      </div>

      <div className="disclosure-section" style={{ animationDelay: '0.2s' }}>
        <h3><Lock /> How Your Data Is Protected</h3>
        <ul>
          <li>All conversations are processed by a locally-hosted AI — your data never leaves our servers to third-party AI providers</li>
          <li>Data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
          <li>Session data is stored in an encrypted local database</li>
          <li>No data is shared with insurance companies, employers, or academic institutions</li>
          <li>You can request deletion of your data at any time</li>
        </ul>
      </div>

      <div className="disclosure-section" style={{ animationDelay: '0.3s' }}>
        <h3><AlertTriangle /> Important Limitations</h3>
        <ul>
          <li>This tool does not provide diagnoses or medical advice</li>
          <li>It is not a replacement for therapy, counseling, or psychiatric care</li>
          <li>If you are in immediate danger, please call 911 or go to your nearest emergency room</li>
          <li>Screening results are informational only and should be discussed with a healthcare provider</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <span className="arch-badge green"><Lock size={12} /> AES-256 Encrypted</span>
        <span className="arch-badge green"><Shield size={12} /> Local LLM</span>
        <span className="arch-badge yellow"><AlertTriangle size={12} /> Not a Diagnosis</span>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={onContinue}>
          I Understand — Continue
        </button>
      </div>
    </div>
  );
}
