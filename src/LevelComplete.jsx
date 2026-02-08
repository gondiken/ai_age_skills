import { useEffect } from 'react';
import { speak } from './speak';
import { playCelebrate } from './sounds';
import Confetti from './Confetti';

export default function LevelComplete({ starsEarned, onNext, onHome }) {
  useEffect(() => {
    playCelebrate();
    speak('Great job! You got ' + starsEarned + ' stars!');
  }, [starsEarned]);

  return (
    <>
      <Confetti active={true} />
      <div className="level-complete slide-up">
        <div className="big-emoji">&#127881;</div>
        <div className="earned-stars">
          {'⭐'.repeat(starsEarned)}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="action-btn" onClick={onNext}>
            &#9654;&#65039;
          </button>
          <button
            className="action-btn"
            style={{ background: 'rgba(255,255,255,0.15)' }}
            onClick={onHome}
          >
            &#127968;
          </button>
        </div>
      </div>
    </>
  );
}
