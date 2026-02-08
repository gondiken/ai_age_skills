import { speak } from './speak';

export default function GameShell({ title, stars, onBack, speakText, children }) {
  return (
    <div className="game-screen">
      <div className="game-topbar">
        <button className="back-btn" onClick={onBack}>&#8592;</button>
        <div className="game-title">{title}</div>
        {speakText && (
          <button className="speak-btn" onClick={() => speak(speakText)}>
            &#128264;
          </button>
        )}
        <div className="game-stars">
          &#11088; {stars}
        </div>
      </div>
      <div className="game-body">
        {children}
      </div>
    </div>
  );
}
