import { useEffect } from 'react';

export default function SessionSummary({ score, total, onRestart }) {
  const pct = Math.round((score.correct / total) * 100);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Enter') onRestart();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onRestart]);

  return (
    <div className="done-card">
      <div className="trophy">{pct >= 80 ? '\u{1F3C6}' : '\u{1F4AA}'}</div>
      <h2>{pct >= 80 ? '\u00A1Excelente!' : pct >= 50 ? '\u00A1Bien hecho!' : '\u00A1Sigue practicando!'}</h2>
      <p>You completed all {total} cards</p>
      <div className="done-stats">
        <div className="done-stat score-correct">{'\u2713'} {score.correct}</div>
        <div className="done-stat score-wrong">{'\u2717'} {score.wrong}</div>
      </div>
      <p className="done-percentage">{pct}% correct</p>
      <button className="btn-restart" onClick={onRestart}>
        Shuffle & Restart
      </button>
    </div>
  );
}
