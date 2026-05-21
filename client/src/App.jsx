import { useState } from 'react';
import RolePicker from './components/RolePicker';
import InterviewScreen from './components/InterviewScreen';
import FeedbackPanel from './components/FeedbackPanel';
import Summary from './components/Summary';
import './App.css';

const API = 'http://localhost:3001/api/interview';

export default function App() {
  const [phase, setPhase] = useState('setup');
  const [config, setConfig] = useState({ role: '', level: '' });
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluations, setEvaluations] = useState([]);
  const [error, setError] = useState('');

  const startInterview = async ({ role, level }) => {
    setConfig({ role, level });
    setPhase('loading');
    setError('');
    try {
      const res = await fetch(`${API}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, level }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuestions(data.questions);
      setPhase('interview');
    } catch (err) {
      setError(err.message);
      setPhase('setup');
    }
  };

  const submitAnswer = async (answer) => {
    setPhase('evaluating');
    setError('');
    try {
      const res = await fetch(`${API}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: config.role,
          question: questions[currentIndex],
          answer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updated = [...evaluations, {
        question: questions[currentIndex],
        answer,
        ...data.evaluation,
      }];
      setEvaluations(updated);
      setPhase(currentIndex + 1 >= questions.length ? 'complete' : 'feedback');
    } catch (err) {
      setError(err.message);
      setPhase('interview');
    }
  };

  const nextQuestion = () => {
    setCurrentIndex(i => i + 1);
    setPhase('interview');
  };

  const reset = () => {
    setPhase('setup');
    setConfig({ role: '', level: '' });
    setQuestions([]);
    setCurrentIndex(0);
    setEvaluations([]);
    setError('');
  };

  return (
    <div className="app">
      <header className="app-header">
        <span className="logo">
          InterviewCoach <span className="logo-dot" />
        </span>
        {config.role && (
          <span className="header-badge">{config.role} · {config.level}</span>
        )}
      </header>
      <main className="app-main">
        {error && <div className="error-bar">⚠ {error}</div>}
        {phase === 'setup' && <RolePicker onStart={startInterview} />}
        {(phase === 'loading' || phase === 'evaluating') && (
          <div className="loading-screen">
            <div className="spinner" />
            <span>
              {phase === 'loading'
                ? 'Generating your interview questions...'
                : 'Evaluating your answer...'}
            </span>
          </div>
        )}
        {phase === 'interview' && (
          <InterviewScreen
            question={questions[currentIndex]}
            questionNumber={currentIndex + 1}
            total={questions.length}
            onSubmit={submitAnswer}
          />
        )}
        {phase === 'feedback' && (
          <FeedbackPanel
            evaluation={evaluations[evaluations.length - 1]}
            questionNumber={currentIndex + 1}
            total={questions.length}
            onNext={nextQuestion}
          />
        )}
        {phase === 'complete' && (
          <Summary
            evaluations={evaluations}
            role={config.role}
            onReset={reset}
          />
        )}
      </main>
    </div>
  );
}
