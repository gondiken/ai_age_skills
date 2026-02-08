import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak } from '../speak';

// Agency / decomposition: put steps in the right order
const PUZZLES = [
  {
    task: '🥪 Make a Sandwich',
    hint: 'Put the steps in order to make a sandwich!',
    steps: [
      { emoji: '🍞', text: 'Get bread' },
      { emoji: '🧈', text: 'Spread butter' },
      { emoji: '🧀', text: 'Add cheese' },
      { emoji: '🍞', text: 'Put bread on top' },
    ],
  },
  {
    task: '🎨 Paint a Picture',
    hint: 'What do you do first, second, third?',
    steps: [
      { emoji: '📄', text: 'Get paper' },
      { emoji: '🎨', text: 'Pick colors' },
      { emoji: '🖌️', text: 'Paint!' },
      { emoji: '🖼️', text: 'Hang it up' },
    ],
  },
  {
    task: '🌱 Plant a Flower',
    hint: 'How do you plant a flower?',
    steps: [
      { emoji: '🕳️', text: 'Dig a hole' },
      { emoji: '🌱', text: 'Put seed in' },
      { emoji: '🪣', text: 'Cover with dirt' },
      { emoji: '💧', text: 'Water it' },
    ],
  },
  {
    task: '🦷 Brush Your Teeth',
    hint: 'The steps to brush your teeth!',
    steps: [
      { emoji: '🪥', text: 'Get toothbrush' },
      { emoji: '🧴', text: 'Add toothpaste' },
      { emoji: '😬', text: 'Brush teeth' },
      { emoji: '💦', text: 'Rinse mouth' },
    ],
  },
  {
    task: '📬 Send a Letter',
    hint: 'How do you send a letter?',
    steps: [
      { emoji: '✏️', text: 'Write letter' },
      { emoji: '📨', text: 'Put in envelope' },
      { emoji: '📮', text: 'Add a stamp' },
      { emoji: '📭', text: 'Put in mailbox' },
    ],
  },
  {
    task: '🎂 Bake a Cake',
    hint: 'Put the baking steps in order!',
    steps: [
      { emoji: '🥣', text: 'Mix ingredients' },
      { emoji: '🍰', text: 'Pour in pan' },
      { emoji: '🔥', text: 'Bake in oven' },
      { emoji: '🎂', text: 'Add frosting' },
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

export default function BossBrain({ stars, onAddStars, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [shuffledSteps, setShuffledSteps] = useState([]);
  const [showComplete, setShowComplete] = useState(false);

  const puzzle = PUZZLES[puzzleIndex % PUZZLES.length];

  useEffect(() => {
    setShuffledSteps(shuffle(puzzle.steps));
    setPlaced([]);
    speak(puzzle.hint);
  }, [puzzleIndex]);

  const handlePick = useCallback((step) => {
    const nextIndex = placed.length;
    const correctStep = puzzle.steps[nextIndex];
    if (step.text === correctStep.text) {
      const newPlaced = [...placed, step];
      setPlaced(newPlaced);
      speak(step.text);
      if (newPlaced.length === puzzle.steps.length) {
        speak('You did it! All steps in order!');
        onAddStars('boss', 2);
        setTimeout(() => setShowComplete(true), 800);
      }
    } else {
      speak('Not that one yet! Think about what comes first.');
    }
  }, [placed, puzzle, onAddStars]);

  const handleNext = () => {
    setShowComplete(false);
    setPuzzleIndex(i => i + 1);
  };

  if (showComplete) {
    return (
      <GameShell title="Boss Brain" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={2} onNext={handleNext} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Boss Brain"
      stars={stars}
      onBack={onHome}
      speakText={puzzle.hint}
    >
      <div className="question-text">{puzzle.task}</div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{puzzle.hint}</div>

      <div className="steps-area">
        {puzzle.steps.map((_, i) => (
          <div key={i} className={`step-slot ${i < placed.length ? 'filled' : ''}`}>
            <div className="step-number">{i + 1}</div>
            {i < placed.length ? (
              <span className="pop-in">{placed[i].emoji} {placed[i].text}</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>...</span>
            )}
          </div>
        ))}
      </div>

      <div className="step-choices">
        {shuffledSteps.map((step, i) => {
          const used = placed.some(p => p.text === step.text);
          return (
            <button
              key={i}
              className={`step-choice-btn ${used ? 'used' : ''}`}
              onClick={() => handlePick(step)}
            >
              {step.emoji} {step.text}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
