import { speak, unlockAudio } from './speak';
import { playTap } from './sounds';

export default function GameShell({ title, emoji, stars, onBack, speakText, children }) {
  const handleBack = () => {
    unlockAudio();
    playTap();
    onBack();
  };

  const handleSpeak = () => {
    unlockAudio();
    speak(speakText);
  };

  return (
    <div className="game-screen">
      <div className="game-topbar">
        <button className="back-btn" onClick={handleBack}>&#8592;</button>
        {emoji && <span style={{ fontSize: '1.4rem' }}>{emoji}</span>}
        <div className="game-title">{title}</div>
        {speakText && (
          <button className="speak-btn" onClick={handleSpeak}>
            &#128266;
          </button>
        )}
        <div className="game-stars">&#11088; {stars}</div>
      </div>
      <div className="game-body">
        {children}
      </div>
    </div>
  );
}
