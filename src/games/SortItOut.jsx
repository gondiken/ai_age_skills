import { useState, useEffect } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap } from '../sounds';

// Classification: sort items into the right bucket
const PUZZLES = [
  {
    hint: 'Sky or water?',
    bucketA: { emoji: '☁️', items: ['🦅', '✈️', '🎈', '🌙'] },
    bucketB: { emoji: '🌊', items: ['🐟', '🐙', '🚢', '🐳'] },
  },
  {
    hint: 'Hot or cold?',
    bucketA: { emoji: '🔥', items: ['☀️', '🌶️', '🍳', '🌋'] },
    bucketB: { emoji: '❄️', items: ['🧊', '⛄', '🍦', '🐧'] },
  },
  {
    hint: 'Day or night?',
    bucketA: { emoji: '🌞', items: ['🏫', '🦋', '🌻', '🏖️'] },
    bucketB: { emoji: '🌙', items: ['⭐', '🦉', '🛏️', '🌌'] },
  },
  {
    hint: 'Fruit or veggie?',
    bucketA: { emoji: '🍎', items: ['🍌', '🍇', '🍊', '🍓'] },
    bucketB: { emoji: '🥦', items: ['🥕', '🌽', '🥬', '🍆'] },
  },
  {
    hint: 'Big or small?',
    bucketA: { emoji: '🐘', items: ['🏠', '🌳', '🚌', '🦕'] },
    bucketB: { emoji: '🐜', items: ['🐛', '🍒', '🔑', '🐝'] },
  },
  {
    hint: 'Fast or slow?',
    bucketA: { emoji: '🚀', items: ['⚡', '🏎️', '🦅', '🐆'] },
    bucketB: { emoji: '🐌', items: ['🐢', '🦥', '🐌', '🧊'] },
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SortItOut({ stars, onAddStars, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(0);
  const [sortedA, setSortedA] = useState([]);
  const [sortedB, setSortedB] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'a' | 'b' | null
  const [showComplete, setShowComplete] = useState(false);

  const puzzle = PUZZLES[puzzleIndex % PUZZLES.length];

  useEffect(() => {
    const allItems = [
      ...puzzle.bucketA.items.map(e => ({ emoji: e, bucket: 'a' })),
      ...puzzle.bucketB.items.map(e => ({ emoji: e, bucket: 'b' })),
    ];
    setItems(shuffle(allItems));
    setCurrentItem(0);
    setSortedA([]);
    setSortedB([]);
    speak(puzzle.hint);
  }, [puzzleIndex]);

  const handleSort = (toBucket) => {
    if (currentItem >= items.length) return;
    unlockAudio();
    playTap();
    const item = items[currentItem];
    const isCorrect = item.bucket === toBucket;

    if (isCorrect) {
      playCorrect();
      if (toBucket === 'a') setSortedA(s => [...s, item.emoji]);
      else setSortedB(s => [...s, item.emoji]);
      setFeedback(toBucket);
    } else {
      playWrong();
      setFeedback('wrong');
    }

    if (isCorrect) {
      setTimeout(() => {
        setFeedback(null);
        const nextItem = currentItem + 1;
        setCurrentItem(nextItem);
        if (nextItem >= items.length) {
          onAddStars('sort', 2);
          setTimeout(() => setShowComplete(true), 400);
        }
      }, 500);
    } else {
      setTimeout(() => setFeedback(null), 500);
    }
  };

  if (showComplete) {
    return (
      <GameShell title="Sort It" emoji="📦" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={2} onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  const done = currentItem >= items.length;

  return (
    <GameShell title="Sort It" emoji="📦" stars={stars} onBack={onHome} speakText={puzzle.hint}>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(currentItem / items.length) * 100}%` }} />
      </div>

      {/* Current item to sort */}
      {!done && (
        <div className="pop-in" key={currentItem} style={{
          fontSize: '4rem',
          background: 'var(--card-bg)',
          borderRadius: 20,
          width: 100,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {items[currentItem]?.emoji}
        </div>
      )}

      {/* Two buckets */}
      <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: 400 }}>
        <button
          onClick={() => handleSort('a')}
          style={{
            flex: 1,
            background: feedback === 'a' ? 'rgba(74,222,128,0.2)' : 'var(--card-bg)',
            border: `3px solid ${feedback === 'a' ? 'var(--green)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 20,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'white',
            minHeight: 140,
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>{puzzle.bucketA.emoji}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {sortedA.map((e, i) => <span key={i} style={{ fontSize: '1.3rem' }} className="pop-in">{e}</span>)}
          </div>
        </button>

        <button
          onClick={() => handleSort('b')}
          style={{
            flex: 1,
            background: feedback === 'b' ? 'rgba(74,222,128,0.2)' : 'var(--card-bg)',
            border: `3px solid ${feedback === 'b' ? 'var(--green)' : 'rgba(255,255,255,0.15)'}`,
            borderRadius: 20,
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'white',
            minHeight: 140,
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>{puzzle.bucketB.emoji}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {sortedB.map((e, i) => <span key={i} style={{ fontSize: '1.3rem' }} className="pop-in">{e}</span>)}
          </div>
        </button>
      </div>
    </GameShell>
  );
}
