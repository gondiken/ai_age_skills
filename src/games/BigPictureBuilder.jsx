import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap } from '../sounds';

const PUZZLES = [
  {
    emoji: '🏠', hint: 'Pick what you need to build a house!',
    correct: ['🧱', '🪟', '🚪', '🔨'], wrong: ['🐟', '🎸'],
    labels: { '🧱': 'BRICKS', '🪟': 'WINDOW', '🚪': 'DOOR', '🔨': 'HAMMER', '🐟': 'FISH', '🎸': 'GUITAR' },
  },
  {
    emoji: '🌳', hint: 'What does a tree need to grow?',
    correct: ['🌱', '☀️', '💧', '🪴'], wrong: ['🔑', '📺'],
    labels: { '🌱': 'SEED', '☀️': 'SUN', '💧': 'WATER', '🪴': 'SOIL', '🔑': 'KEY', '📺': 'TV' },
  },
  {
    emoji: '🍕', hint: 'What do you need for pizza?',
    correct: ['🫓', '🧀', '🍅', '🔥'], wrong: ['🧸', '📚'],
    labels: { '🫓': 'DOUGH', '🧀': 'CHEESE', '🍅': 'SAUCE', '🔥': 'OVEN', '🧸': 'TEDDY', '📚': 'BOOKS' },
  },
  {
    emoji: '🚗', hint: 'What does a car need?',
    correct: ['⛽', '🛞', '🔑', '🛣️'], wrong: ['🌂', '🎈'],
    labels: { '⛽': 'GAS', '🛞': 'WHEELS', '🔑': 'KEY', '🛣️': 'ROAD', '🌂': 'UMBRELLA', '🎈': 'BALLOON' },
  },
  {
    emoji: '🎵', hint: 'What do you need to play music?',
    correct: ['🎸', '🎵', '🙌', '👂'], wrong: ['🧊', '🗑️'],
    labels: { '🎸': 'GUITAR', '🎵': 'NOTES', '🙌': 'HANDS', '👂': 'EARS', '🧊': 'ICE', '🗑️': 'TRASH' },
  },
  {
    emoji: '📦', hint: 'What do you need to send a box?',
    correct: ['📦', '📝', '📮', '🚚'], wrong: ['🧹', '🎲'],
    labels: { '📦': 'BOX', '📝': 'ADDRESS', '📮': 'MAILBOX', '🚚': 'TRUCK', '🧹': 'BROOM', '🎲': 'DICE' },
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

export default function BigPictureBuilder({ stars, onAddStars, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selectedParts, setSelectedParts] = useState([]);
  const [wrongPick, setWrongPick] = useState(null);
  const [showComplete, setShowComplete] = useState(false);
  const [allParts, setAllParts] = useState([]);

  const puzzle = PUZZLES[puzzleIndex % PUZZLES.length];

  useEffect(() => {
    setAllParts(shuffle([...puzzle.correct, ...puzzle.wrong]));
    setSelectedParts([]);
    speak(puzzle.hint);
  }, [puzzleIndex]);

  const handlePick = useCallback((part) => {
    if (selectedParts.includes(part)) return;
    unlockAudio();
    playTap();
    if (puzzle.correct.includes(part)) {
      const newSelected = [...selectedParts, part];
      setSelectedParts(newSelected);
      playCorrect();
      if (newSelected.length === puzzle.correct.length) {
        onAddStars('systems', 2);
        setTimeout(() => setShowComplete(true), 600);
      }
    } else {
      setWrongPick(part);
      playWrong();
      setTimeout(() => setWrongPick(null), 600);
    }
  }, [selectedParts, puzzle, onAddStars]);

  if (showComplete) {
    return (
      <GameShell title="Big Picture" emoji="🧩" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={2} onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Big Picture" emoji="🧩" stars={stars} onBack={onHome} speakText={puzzle.hint}>
      <div className="system-board">
        <div className="system-scenario">
          <div style={{ fontSize: '3.5rem' }}>{puzzle.emoji}</div>
        </div>

        <div className="progress-bar" style={{ margin: '0 auto' }}>
          <div className="progress-fill" style={{ width: `${(selectedParts.length / puzzle.correct.length) * 100}%` }} />
        </div>

        <div className="system-parts">
          {allParts.map((part, i) => (
            <button
              key={i}
              className={`system-part ${selectedParts.includes(part) ? 'selected' : ''} ${wrongPick === part ? 'wrong-pick' : ''}`}
              onClick={() => handlePick(part)}
            >
              {part}
              <span className="part-label">{puzzle.labels[part]}</span>
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
