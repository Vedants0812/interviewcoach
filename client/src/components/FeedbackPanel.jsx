const toLabel = (key) =>
  key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());

const scoreColor = (s) =>
  s >= 7 ? 'var(--success)' : s >= 5 ? 'var(--warning)' : 'var(--danger)';

export default function FeedbackPanel({ evaluation, questionNumber, total, onNext }) {
  const { overallScore, dimensions, highlights, improvements, topTip } = evaluation;
  const ringColor = scoreColor(overallScore);

  return (
    <div className="card">
      <div className="feedback-header">
        <div className="score-ring"
          style={{ borderColor: ringColor, background: `${ringColor}12` }}>
          <span className="score-num" style={{ color: ringColor }}>{overallScore}</span>
          <span className="score-denom" style={{ color: ringColor }}>/10</span>
        </div>
        <div>
          <p className="feedback-meta-title">Question {questionNumber} Feedback</p>
          <p className="feedback-meta-sub">
            AI scored your answer on structure, depth, and relevance.
          </p>
        </div>
      </div>

      <p className="section-label">Dimension Scores</p>
      <div className="dim-list">
        {Object.entries(dimensions).map(([key, dim]) => (
          <div key={key} className="dim-item">
            <div className="dim-top">
              <span className="dim-name">{toLabel(key)}</span>
              <span className="dim-score-text">{dim.score}/10</span>
            </div>
            <div className="dim-track">
              <div className="dim-fill"
                style={{ width: `${dim.score * 10}%`, background: scoreColor(dim.score) }} />
            </div>
            <p className="dim-text">{dim.feedback}</p>
          </div>
        ))}
      </div>

      <div className="tags-area">
        {highlights?.length > 0 && (
          <>
            <p className="section-label">What worked</p>
            <div className="tag-row">
              {highlights.map((h, i) => (
                <span key={i} className="tag tag-good">✓ {h}</span>
              ))}
            </div>
          </>
        )}
        {improvements?.length > 0 && (
          <>
            <p className="section-label" style={{ marginTop: '16px' }}>To improve</p>
            <div className="tag-row">
              {improvements.map((imp, i) => (
                <span key={i} className="tag tag-improve">↑ {imp}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="tip-box">
        <p className="tip-label">Top Tip</p>
        <p className="tip-text">{topTip}</p>
      </div>

      <div className="feedback-footer">
        <button className="btn btn-primary" onClick={onNext}>
          {questionNumber < total
            ? `Next Question (${questionNumber + 1}/${total}) →`
            : 'View Summary →'}
        </button>
      </div>
    </div>
  );
}