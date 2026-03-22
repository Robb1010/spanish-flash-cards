export default function StatusScreen({ message, detail, variant }) {
  const messageClass =
    variant === 'error' ? 'state-error' :
    variant === 'success' ? 'state-success' :
    'state-message';

  return (
    <div className="card state-card">
      {!variant && <div className="spinner" />}
      <p className={messageClass}>{message}</p>
      {detail && <p className="state-detail">{detail}</p>}
    </div>
  );
}
