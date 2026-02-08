import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak } from '../speak';

// Cause and effect: what happens when...?
const PUZZLES = [
  {
    cause: '🌧️',
    causeText: 'It rains a lot...',
    answer: '🌊',
    answerLabel: 'Puddles!',
    choices: [
      { emoji: '🌊', label: 'Puddles' },
      { emoji: '🔥', label: 'Fire' },
      { emoji: '❄️', label: 'Snow' },
      { emoji: '🌵', label: 'Desert' },
    ],
  },
  {
    cause: '☀️',
    causeText: 'You leave ice cream in the sun...',
    answer: '🫠',
    answerLabel: 'It melts!',
    choices: [
      { emoji: '🫠', label: 'Melts' },
      { emoji: '🧊', label: 'Freezes' },
      { emoji: '💨', label: 'Flies away' },
      { emoji: '🎵', label: 'Sings' },
    ],
  },
  {
    cause: '🌱',
    causeText: 'You water a seed every day...',
    answer: '🌻',
    answerLabel: 'A flower grows!',
    choices: [
      { emoji: '🌻', label: 'Flower' },
      { emoji: '🪨', label: 'Rock' },
      { emoji: '⭐', label: 'Star' },
      { emoji: '🧸', label: 'Teddy' },
    ],
  },
  {
    cause: '🔋',
    causeText: 'The battery runs out...',
    answer: '📵',
    answerLabel: 'Phone turns off!',
    choices: [
      { emoji: '📵', label: 'Turns off' },
      { emoji: '🚀', label: 'Flies' },
      { emoji: '🎉', label: 'Party' },
      { emoji: '🌈', label: 'Rainbow' },
    ],
  },
  {
    cause: '💨',
    causeText: 'Strong wind blows...',
    answer: '🍂',
    answerLabel: 'Leaves fall!',
    choices: [
      { emoji: '🍂', label: 'Leaves fall' },
      { emoji: '🐟', label: 'Fish' },
      { emoji: '📚', label: 'Books' },
      { emoji: '🎸', label: 'Guitar' },
    ],
  },
  {
    cause: '🥶',
    causeText: 'It gets very very cold...',
    answer: '❄️',
    answerLabel: 'Water freezes!',
    choices: [
      { emoji: '❄️', label: 'Freezes' },
      { emoji: '🔥', label: 'Fire' },
      { emoji: '🌺', label: 'Flowers' },
      { emoji: '🦁', label: 'Lion' },
    ],
  },
  {
    cause: '😴',
    causeText: 'You stay up too late...',
    answer: '🥱',
    answerLabel: 'You feel sleepy!',
    choices: [
      { emoji: '🥱', label: 'Sleepy' },
      { emoji: '💪', label: 'Strong' },
      { emoji: '🎵', label: 'Music' },
      { emoji: '🍕', label: 'Pizza' },
    ],
  },
  {
    cause: '📚',
    causeText: 'You read books every day...',
    answer: '🧠',
    answerLabel: 'You get smarter!',
    choices: [
      { emoji: '🧠', label: 'Smarter' },
      { emoji: '🦷', label: 'Teeth' },
      { emoji: '🧊', label: 'Ice' },
      { emoji: '🎈', label: 'Balloon' },
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

export default function CauseEffect({ stars, onAddStars, onHome }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [roundStars, setRoundStars] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState([]);

  const puzzle = PUZZLES[puzzleIndex % PUZZLES.length];
  const roundSize = 3;

  useEffect(() => {
    setShuffledChoices(shuffle(puzzle.choices));
    speak(puzzle.causeText + ' What happens?');
  }, [puzzleIndex]);

  const handleChoice = useCallback((choice) => {
    if (selected !== null) return;
    setSelected(choice.emoji);
    if (choice.emoji === puzzle.answer) {
      setIsCorrect(true);
      setRoundStars(s => s + 1);
      speak('Yes! ' + puzzle.answerLabel);
    } else {
      setIsCorrect(false);
      speak('Not quite!');
    }
    setTimeout(() => {
      const nextIdx = puzzleIndex + 1;
      if (nextIdx % roundSize === 0 && nextIdx > 0) {
        const earned = roundStars + (choice.emoji === puzzle.answer ? 1 : 0);
        onAddStars('cause', earned);
        setRoundStars(0);
        setShowComplete(true);
      } else {
        setPuzzleIndex(nextIdx);
      }
      setSelected(null);
      setIsCorrect(null);
    }, 1200);
  }, [selected, puzzle, puzzleIndex, roundStars, onAddStars]);

  const handleNext = () => {
    setShowComplete(false);
    setPuzzleIndex(i => i + 1);
  };

  if (showComplete) {
    return (
      <GameShell title="Why? What Happens?" stars={stars} onBack={onHome}>
        <LevelComplete
          starsEarned={Math.min(roundSize, roundStars)}
          onNext={handleNext}
          onHome={onHome}
        />
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Why? What Happens?"
      stars={stars}
      onBack={onHome}
      speakText={puzzle.causeText + ' What happens?'}
    >
      <div className="cause-card">
        <div className="cause-emoji">{puzzle.cause}</div>
        <div className="cause-text">{puzzle.causeText}</div>
      </div>

      <div className="question-text">What happens?</div>

      <div className="effect-options">
        {shuffledChoices.map((choice, i) => (
          <button
            key={i}
            className={`effect-btn ${
              selected === choice.emoji
                ? isCorrect ? 'correct' : 'wrong'
                : ''
            }`}
            onClick={() => handleChoice(choice)}
          >
            {choice.emoji}
            <span className="effect-label">{choice.label}</span>
          </button>
        ))}
      </div>
    </GameShell>
  );
}
