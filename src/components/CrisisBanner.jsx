import React from 'react';
import { AlertTriangle } from './Icons';

export default function CrisisBanner() {
  return (
    <div className="crisis-banner fade-in">
      <AlertTriangle />
      <div>
        <strong>Support is available.</strong> If you're in crisis, please reach out:
        988 Suicide &amp; Crisis Lifeline (call or text 988) · Crisis Text Line
        (text HOME to 741741)
      </div>
    </div>
  );
}
