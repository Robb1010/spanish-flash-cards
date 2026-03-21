export default function SessionSummary({ score, total, onRestart }) {
  const pct = Math.round((score.correct / total) * 100);
  return (
    <div className="done-card">
      <div className="trophy">{pct >= 80 ? '\u{1F3C6}' : pct >= 50 ? '\u{1F4AA}' : '\u{1F4DA}'}</div>
      <h2>{pct >= 80 ? '\u00A1Excelente!' : pct >= 50 ? '\u00A1Bien hecho!' : '\u00A1Sigue practicando!'}</h2>
      <p>You completed all {total} cards</p>
      <div className="done-stats">
        <div className="done-stat score-correct">{'\u2713'} {score.correct}</div>
        <div className="done-stat score-wrong">{'\u2717'} {score.wrong}</div>
      </div>
      <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#c0902a', marginBottom: 20 }}>
        {pct}% correct
      </p>
      <button className="btn-restart" onClick={onRestart}>
        Shuffle & Restart
      </button>
    </div>
  );
}
