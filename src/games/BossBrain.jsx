import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap } from '../sounds';

const PUZZLES = [
  {
    emoji: '🥪', hint: 'Make a sandwich!',
    steps: [
      { emoji: '🍞', text: 'Get bread' },
      { emoji: '🧈', text: 'Spread butter' },
      { emoji: '🧀', text: 'Add cheese' },
      { emoji: '🍞', text: 'Top bread' },
    ],
  },
  {
    emoji: '🎨', hint: 'Paint a picture!',
    steps: [
      { emoji: '📄', text: 'Get paper' },
      { emoji: '🎨', text: 'Pick colors' },
      { emoji: '🖌️', text: 'Paint' },
      { emoji: '🖼️', text: 'Hang it' },
    ],
  },
  {
    emoji: '🌱', hint: 'Plant a flower!',
    steps: [
      { emoji: '🕳️', text: 'Dig hole' },
      { emoji: '🌱', text: 'Put seed' },
      { emoji: '🪣', text: 'Add dirt' },
      { emoji: '💧', text: 'Water' },
    ],
  },
  {
    emoji: '🦷', hint: 'Brush teeth!',
    steps: [
      { emoji: '🪥', text: 'Get brush' },
      { emoji: '🧴', text: 'Add paste' },
      { emoji: '😬', text: 'Brush' },
      { emoji: '💦', text: 'Rinse' },
    ],
  },
  {
    emoji: '🎂', hint: 'Bake a cake!',
    steps: [
      { emoji: '🥣', text: 'Mix' },
      { emoji: '🍰', text: 'Pour in pan' },
      { emoji: '🔥', text: 'Bake' },
      { emoji: '🎂', text: 'Frosting' },
    ],
  },
  {
    emoji: '📬', hint: 'Send a letter!',
    steps: [
      { emoji: '✏️', text: 'Write' },
      { emoji: '📨', text: 'Envelope' },
      { emoji: '📮', text: 'Stamp' },
      { emoji: '📭', text: 'Mailbox' },
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
    unlockAudio();
    playTap();
    const nextIndex = placed.length;
    const correctStep = puzzle.steps[nextIndex];
    if (step.text === correctStep.text) {
      const newPlaced = [...placed, step];
      setPlaced(newPlaced);
      playCorrect();
      if (newPlaced.length === puzzle.steps.length) {
        onAddStars('boss', 2);
        setTimeout(() => setShowComplete(true), 600);
      }
    } else {
      playWrong();
    }
  }, [placed, puzzle, onAddStars]);

  if (showComplete) {
    return (
      <GameShell title="Boss Brain" emoji="👑" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={2} onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="Boss Brain" emoji="👑" stars={stars} onBack={onHome} speakText={puzzle.hint}>
      <div style={{ fontSize: '3rem' }}>{puzzle.emoji}</div>

      <div className="steps-area">
        {puzzle.steps.map((_, i) => (
          <div key={i} className={`step-slot ${i < placed.length ? 'filled' : ''}`}>
            <div className="step-number">{i + 1}</div>
            {i < placed.length ? (
              <span className="pop-in" style={{ fontSize: '1.3rem' }}>{placed[i].emoji} {placed[i].text}</span>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>?</span>
            )}
          </div>
        ))}
      </div>

      <div className="step-choices">
        {shuffledSteps.map((step, i) => {
          const used = placed.some(p => p.text === step.text);
          return (
            <button key={i} className={`step-choice-btn ${used ? 'used' : ''}`} onClick={() => handlePick(step)}>
              <span style={{ fontSize: '1.5rem' }}>{step.emoji}</span> {step.text}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
