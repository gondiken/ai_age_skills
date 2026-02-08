import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak } from '../speak';

// Giving clear instructions (like prompting an AI) - pick instructions in order
const PUZZLES = [
  {
    scene: '🤖',
    task: 'Tell the robot to make breakfast!',
    steps: [
      { emoji: '🚶', text: 'Go to kitchen' },
      { emoji: '🍳', text: 'Get a pan' },
      { emoji: '🥚', text: 'Crack an egg' },
      { emoji: '🔥', text: 'Cook it' },
    ],
    wrong: [
      { emoji: '🛁', text: 'Take a bath' },
      { emoji: '📖', text: 'Read a book' },
    ],
  },
  {
    scene: '🐕',
    task: 'Tell your dog to do a trick!',
    steps: [
      { emoji: '👀', text: 'Look at dog' },
      { emoji: '🫴', text: 'Show a treat' },
      { emoji: '🗣️', text: 'Say sit' },
      { emoji: '🦴', text: 'Give treat' },
    ],
    wrong: [
      { emoji: '🏃', text: 'Run away' },
      { emoji: '😴', text: 'Go to sleep' },
    ],
  },
  {
    scene: '🎮',
    task: 'Tell a friend how to play a game!',
    steps: [
      { emoji: '📺', text: 'Turn on TV' },
      { emoji: '🎮', text: 'Pick up controller' },
      { emoji: '▶️', text: 'Press start' },
      { emoji: '🕹️', text: 'Move the stick' },
    ],
    wrong: [
      { emoji: '🧹', text: 'Sweep floor' },
      { emoji: '🍎', text: 'Eat an apple' },
    ],
  },
  {
    scene: '🧸',
    task: 'Tell someone how to wrap a gift!',
    steps: [
      { emoji: '🎁', text: 'Get the gift' },
      { emoji: '📃', text: 'Get paper' },
      { emoji: '✂️', text: 'Cut paper' },
      { emoji: '🎀', text: 'Add a bow' },
    ],
    wrong: [
      { emoji: '🧊', text: 'Get ice' },
      { emoji: '🔔', text: 'Ring bell' },
    ],
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

export default function StoryMachine({ stars, onAddStars, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [allChoices, setAllChoices] = useState([]);
  const [showComplete, setShowComplete] = useState(false);

  const puzzle = PUZZLES[puzzleIndex % PUZZLES.length];

  useEffect(() => {
    setAllChoices(shuffle([...puzzle.steps, ...puzzle.wrong]));
    setPlaced([]);
    speak(puzzle.task);
  }, [puzzleIndex]);

  const handlePick = useCallback((choice) => {
    const nextIndex = placed.length;
    if (nextIndex >= puzzle.steps.length) return;
    const correctStep = puzzle.steps[nextIndex];
    if (choice.text === correctStep.text) {
      const newPlaced = [...placed, choice];
      setPlaced(newPlaced);
      speak(choice.text);
      if (newPlaced.length === puzzle.steps.length) {
        speak('Perfect instructions! The robot knows what to do!');
        onAddStars('story', 2);
        setTimeout(() => setShowComplete(true), 800);
      }
    } else if (puzzle.wrong.some(w => w.text === choice.text)) {
      speak('That does not help here!');
    } else {
      speak('Good idea, but not yet!');
    }
  }, [placed, puzzle, onAddStars]);

  const handleNext = () => {
    setShowComplete(false);
    setPuzzleIndex(i => i + 1);
  };

  if (showComplete) {
    return (
      <GameShell title="Story Machine" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={2} onNext={handleNext} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Story Machine"
      stars={stars}
      onBack={onHome}
      speakText={puzzle.task}
    >
      <div className="story-scene">{puzzle.scene}</div>
      <div className="question-text">{puzzle.task}</div>

      <div className="instruction-slots">
        {puzzle.steps.map((_, i) => (
          <div key={i} className={`instruction-slot ${i < placed.length ? 'filled' : ''}`}>
            <span className="slot-arrow">{i < placed.length ? '✅' : `${i + 1}.`}</span>
            {i < placed.length ? (
              <span className="pop-in">{placed[i].emoji} {placed[i].text}</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>What's next?</span>
            )}
          </div>
        ))}
      </div>

      <div className="instruction-choices">
        {allChoices.map((choice, i) => {
          const used = placed.some(p => p.text === choice.text);
          return (
            <button
              key={i}
              className={`instruction-choice ${used ? 'used' : ''}`}
              onClick={() => handlePick(choice)}
            >
              {choice.emoji} {choice.text}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
