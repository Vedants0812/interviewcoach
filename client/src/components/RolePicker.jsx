import { useState } from 'react';

const ROLES = [
  'Frontend Dev', 'Backend Dev', 'Full Stack Dev',
  'React Dev', 'Node.js Dev', 'Product Manager',
];
const LEVELS = ['Junior', 'Mid-Level', 'Senior'];

export default function RolePicker({ onStart }) {
  const [role, setRole]   = useState('');
  const [level, setLevel] = useState('');

  return (
    <div className="card">
      <p className="picker-eyebrow">AI Interview Simulator</p>
      <h1 className="picker-title">Ready to practice?</h1>
      <p className="picker-sub">
        Pick your role and level. The AI generates real questions
        and scores every answer you give.
      </p>
      <div className="chip-section">
        <p className="section-label">Select Role</p>
        <div className="role-grid">
          {ROLES.map(r => (
            <button
              key={r}
              className={`chip ${role === r ? 'active' : ''}`}
              onClick={() => setRole(r)}
            >{r}</button>
          ))}
        </div>
      </div>
      <div className="chip-section">
        <p className="section-label">Experience Level</p>
        <div className="level-grid">
          {LEVELS.map(l => (
            <button
              key={l}
              className={`level-chip ${level === l ? 'active' : ''}`}
              onClick={() => setLevel(l)}
            >{l}</button>
          ))}
        </div>
      </div>
      <div className="divider" />
      <button
        className="btn btn-primary"
        style={{ width: '100%', padding: '14px' }}
        onClick={() => onStart({ role, level })}
        disabled={!role || !level}
      >
        Start Interview →
      </button>
    </div>
  );
}