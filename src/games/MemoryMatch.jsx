import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap } from '../sounds';

const CARD_SETS = [
  ['🐶', '🐱', '🐸', '🦋', '🐙', '🦊'],
  ['🍎', '🍌', '🍇', '🍒', '🥝', '🍊'],
  ['🚗', '🚀', '✈️', '🚢', '🚲', '🛸'],
  ['⭐', '🌙', '☀️', '🌈', '⚡', '❄️'],
  ['🎸', '🥁', '🎹', '🎺', '🎻', '🪗'],
  ['🏠', '🏰', '⛺', '🛖', '🗼', '🎪'],
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryMatch({ stars, onAddStars, onHome }) {
  const [setIndex, setSetIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [showComplete, setShowComplete] = useState(false);
  const [canFlip, setCanFlip] = useState(true);

  const cardSet = CARD_SETS[setIndex % CARD_SETS.length];
  // Use 4 pairs (8 cards) for a 6-year-old — not too many
  const pairCount = 4;

  useEffect(() => {
    const picked = shuffle(cardSet).slice(0, pairCount);
    const pairs = shuffle([...picked, ...picked]);
    setCards(pairs.map((emoji, i) => ({ id: i, emoji })));
    setFlipped([]);
    setMatched([]);
    setCanFlip(true);
    speak('Find the matching pairs!');
  }, [setIndex]);

  const handleFlip = useCallback((id) => {
    if (!canFlip) return;
    if (flipped.includes(id) || matched.includes(id)) return;
    unlockAudio();
    playTap();

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);
      const [a, b] = newFlipped;
      if (cards[a].emoji === cards[b].emoji) {
        playCorrect();
        const newMatched = [...matched, a, b];
        setMatched(newMatched);
        setFlipped([]);
        setCanFlip(true);
        if (newMatched.length === cards.length) {
          onAddStars('memory', 2);
          setTimeout(() => setShowComplete(true), 600);
        }
      } else {
        playWrong();
        setTimeout(() => {
          setFlipped([]);
          setCanFlip(true);
        }, 800);
      }
    }
  }, [flipped, matched, cards, canFlip, onAddStars]);

  if (showComplete) {
    return (
      <GameShell title="Memory" emoji="🧠" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={2} onNext={() => { setShowComplete(false); setSetIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Memory" emoji="🧠" stars={stars} onBack={onHome} speakText="Find the matching pairs!">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(matched.length / cards.length) * 100}%` }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
        width: '100%',
        maxWidth: 360,
      }}>
        {cards.map((card) => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.id);
          const showFace = isFlipped || isMatched;

          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              style={{
                aspectRatio: '1',
                borderRadius: 14,
                border: `3px solid ${isMatched ? 'var(--green)' : 'rgba(255,255,255,0.15)'}`,
                background: isMatched
                  ? 'rgba(74,222,128,0.15)'
                  : showFace
                    ? 'var(--card-bg)'
                    : 'linear-gradient(135deg, var(--purple), var(--pink))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: showFace ? '2.2rem' : '1.5rem',
                color: 'white',
                transition: 'transform 0.2s',
                transform: showFace ? 'rotateY(0deg)' : 'rotateY(0deg)',
              }}
            >
              {showFace ? card.emoji : '?'}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
