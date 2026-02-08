import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak } from '../speak';

// Systems thinking: pick all the parts that belong to a system
const PUZZLES = [
  {
    system: '🏠 Build a House',
    hint: 'What do you need to build a house? Pick the right parts!',
    correct: ['🧱', '🪟', '🚪', '🔨'],
    wrong: ['🐟', '🎸'],
    labels: { '🧱': 'Bricks', '🪟': 'Window', '🚪': 'Door', '🔨': 'Hammer', '🐟': 'Fish', '🎸': 'Guitar' },
  },
  {
    system: '🌳 Grow a Tree',
    hint: 'What does a tree need to grow?',
    correct: ['🌱', '☀️', '💧', '🪴'],
    wrong: ['🔑', '📺'],
    labels: { '🌱': 'Seed', '☀️': 'Sun', '💧': 'Water', '🪴': 'Soil', '🔑': 'Key', '📺': 'TV' },
  },
  {
    system: '🍕 Make a Pizza',
    hint: 'What do you need for pizza?',
    correct: ['🫓', '🧀', '🍅', '🔥'],
    wrong: ['🧸', '📚'],
    labels: { '🫓': 'Dough', '🧀': 'Cheese', '🍅': 'Sauce', '🔥': 'Oven', '🧸': 'Teddy', '📚': 'Books' },
  },
  {
    system: '🚗 Make a Car Go',
    hint: 'What does a car need to drive?',
    correct: ['⛽', '🛞', '🔑', '🛣️'],
    wrong: ['🌂', '🎈'],
    labels: { '⛽': 'Gas', '🛞': 'Wheels', '🔑': 'Key', '🛣️': 'Road', '🌂': 'Umbrella', '🎈': 'Balloon' },
  },
  {
    system: '🎵 Play Music',
    hint: 'What do you need to play music?',
    correct: ['🎸', '🎵', '🙌', '👂'],
    wrong: ['🧊', '🗑️'],
    labels: { '🎸': 'Instrument', '🎵': 'Notes', '🙌': 'Hands', '👂': 'Ears', '🧊': 'Ice', '🗑️': 'Trash' },
  },
  {
    system: '📦 Send a Package',
    hint: 'What do you need to send a box to someone?',
    correct: ['📦', '📝', '📮', '🚚'],
    wrong: ['🧹', '🎲'],
    labels: { '📦': 'Box', '📝': 'Address', '📮': 'Mailbox', '🚚': 'Truck', '🧹': 'Broom', '🎲': 'Dice' },
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
    if (puzzle.correct.includes(part)) {
      const newSelected = [...selectedParts, part];
      setSelectedParts(newSelected);
      speak(puzzle.labels[part]);
      if (newSelected.length === puzzle.correct.length) {
        speak('You found all the parts!');
        const earned = 2;
        onAddStars('systems', earned);
        setTimeout(() => setShowComplete(true), 800);
      }
    } else {
      setWrongPick(part);
      speak('That one does not fit!');
      setTimeout(() => setWrongPick(null), 600);
    }
  }, [selectedParts, puzzle, onAddStars]);

  const handleNext = () => {
    setShowComplete(false);
    setPuzzleIndex(i => i + 1);
  };

  if (showComplete) {
    return (
      <GameShell title="Big Picture" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={2} onNext={handleNext} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Big Picture"
      stars={stars}
      onBack={onHome}
      speakText={puzzle.hint}
    >
      <div className="system-board">
        <div className="system-scenario">
          <div style={{ fontSize: '2.5rem' }}>{puzzle.system.split(' ')[0]}</div>
          <div className="question-text" style={{ fontSize: '1.1rem', marginTop: 8 }}>
            {puzzle.hint}
          </div>
        </div>

        <div className="progress-bar" style={{ margin: '0 auto' }}>
          <div
            className="progress-fill"
            style={{ width: `${(selectedParts.length / puzzle.correct.length) * 100}%` }}
          />
        </div>

        <div className="system-parts">
          {allParts.map((part, i) => (
            <button
              key={i}
              className={`system-part ${selectedParts.includes(part) ? 'selected' : ''} ${wrongPick === part ? 'wrong-pick' : ''}`}
              onClick={() => handlePick(part)}
              style={{ animationDelay: `${i * 0.05}s` }}
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
