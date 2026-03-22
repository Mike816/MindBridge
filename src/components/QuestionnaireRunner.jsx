import React, { useState } from 'react';
import QUESTIONNAIRES from '../data/questionnaires';
import { AlertTriangle } from './Icons';
import '../styles/Questionnaire.css';

export default function QuestionnaireRunner({ name, onComplete, onExit }) {
  const q = QUESTIONNAIRES[name];
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const answer = (value) => {
    const next = [...answers];
    next[index] = value;
    setAnswers(next);
  };

  const handleNext = () => {
    if (index < q.questions.length - 1) {
      setIndex(index + 1);
    } else {
      // Score and return results
      const total = answers.reduce((a, b) => a + b, 0);
      const maxScore = q.questions.length * Math.max(...q.options.map((o) => o.value));
      const severity = q.scoring(total);
      onComplete({
        score: total,
        maxScore,
        severity,
        answers,
        completedAt: new Date().toISOString(),
      });
    }
  };

  const handleBack = () => {
    if (index === 0) {
      onExit();
    } else {
      setIndex(index - 1);
    }
  };

  return (
    <div className="questionnaire-container fade-up">
      {q.isCritical && (
        <div className="crisis-banner" style={{ marginBottom: '16px' }}>
          <AlertTriangle />
          <div>
            This screening asks sensitive questions. If you are in immediate
            danger, please call 911 or reach the 988 Lifeline (call or text
            988). You can exit this questionnaire at any time.
          </div>
        </div>
      )}

      <div className="questionnaire-header">
        <h2>{q.title}</h2>
        <p>{q.description}</p>
      </div>

      <div className="q-progress">
        <div
          className="q-progress-bar"
          style={{ width: `${((index + 1) / q.questions.length) * 100}%` }}
        />
      </div>

      <div className="q-body">
        <div className="q-question-num">
          Question {index + 1} of {q.questions.length}
        </div>
        <div className="q-question-text">{q.questions[index]}</div>

        <div className="q-options">
          {q.options.map((opt) => (
            <div
              key={opt.value}
              className={`q-option ${answers[index] === opt.value ? 'selected' : ''}`}
              onClick={() => answer(opt.value)}
            >
              <div className="q-option-radio" />
              <span>{opt.label}</span>
            </div>
          ))}
        </div>

        <div className="q-nav">
          <button className="btn btn-ghost" onClick={handleBack}>
            {index === 0 ? 'Exit' : 'Back'}
          </button>
          <span className="q-nav-counter">
            {index + 1} / {q.questions.length}
          </span>
          <button
            className="btn btn-primary"
            disabled={answers[index] === undefined}
            onClick={handleNext}
          >
            {index === q.questions.length - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
