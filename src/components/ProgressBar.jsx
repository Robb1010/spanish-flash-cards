export default function ProgressBar({ current, total }) {
  const progress = Math.round(((current + 1) / total) * 100);
  return (
    <div className="progress-wrap">
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-label">
        {current + 1} / {total}
      </div>
    </div>
  );
}
