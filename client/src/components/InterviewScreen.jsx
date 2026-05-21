import { useState } from 'react';

export default function InterviewScreen({ question, questionNumber, total, onSubmit }) {
  const [answer, setAnswer] = useState('');
  const progress = ((questionNumber - 1) / total) * 100;

  return (
    <div className="card">
      <div className="progress-header">
        <span className="progress-label">Question {questionNumber} / {total}</span>
        <span className="progress-label">{Math.round(progress)}% complete</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="question-tag">Interview Question</div>
      <h2 className="question-text">{question}</h2>
      <div className="answer-hint">
        <span className="hint-pill">TIP</span>
        STAR method — Situation · Task · Action · Result
      </div>
      <textarea
        className="answer-textarea"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Describe a specific example. What was the situation? What did you do? What was the result?"
        rows={8}
      />
      <div className="interview-footer">
        <span className="char-count">{answer.length} chars</span>
        <button
          className="btn btn-primary"
          onClick={() => onSubmit(answer)}
          disabled={answer.trim().length < 15}
        >
          Submit Answer →
        </button>
      </div>
    </div>
  );
}