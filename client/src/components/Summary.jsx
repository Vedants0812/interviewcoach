const grade = (avg) => {
  if (avg >= 8.5) return 'Outstanding';
  if (avg >= 7)   return 'Strong Performance';
  if (avg >= 5.5) return 'Needs More Practice';
  return 'Keep Grinding';
};

const scoreColor = (s) =>
  s >= 7 ? 'var(--success)' : s >= 5 ? 'var(--warning)' : 'var(--danger)';

export default function Summary({ evaluations, role, onReset }) {
  const avg = evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length;

  return (
    <div className="card">
      <div className="summary-hero">
        <p className="summary-role">{role} Interview Complete</p>
        <div className="summary-big-score" style={{ color: scoreColor(avg) }}>
          {avg.toFixed(1)}
        </div>
        <p className="summary-grade">{grade(avg)} · Average score out of 10</p>
      </div>

      <p className="section-label">Question Breakdown</p>
      <div className="q-list">
        {evaluations.map((ev, i) => (
          <div key={i} className="q-row">
            <span className="q-index">Q{i + 1}</span>
            <p className="q-question">{ev.question}</p>
            <span className="q-score-badge" style={{ color: scoreColor(ev.overallScore) }}>
              {ev.overallScore}
            </span>
          </div>
        ))}
      </div>

      <div className="summary-footer">
        <button
          className="btn btn-primary"
          style={{ padding: '13px 32px' }}
          onClick={onReset}
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
}