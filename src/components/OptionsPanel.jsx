import { useEffect, useRef } from 'react';

const DECK_SIZES = [20, 40, 60];

export default function OptionsPanel({ deckSize, onDeckSizeChange, onClose }) {
  const ref = useRef();

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    function onMouseDown(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [onClose]);

  return (
    <div className="options-panel" ref={ref}>
      <div className="options-section">
        <div className="options-label">Cards per session</div>
        <div className="options-row">
          {DECK_SIZES.map((s) => (
            <button
              key={s}
              className={`option-btn${deckSize === s ? ' active' : ''}`}
              onClick={() => { onDeckSizeChange(s); onClose(); }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
