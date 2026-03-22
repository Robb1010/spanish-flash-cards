export default function StatusScreen({ message, detail, variant }) {
  const messageClass =
    variant === 'error' ? 'state-error' :
    variant === 'success' ? 'state-success' :
    'state-message';

  return (
    <div className="container">
      <div className="header">
        <h1>Espa&ntilde;ol</h1>
        <p>Verb Conjugation Trainer</p>
      </div>
      <div className="card state-card">
        <p className={messageClass}>{message}</p>
        {detail && <p className="state-detail">{detail}</p>}
      </div>
    </div>
  );
}
