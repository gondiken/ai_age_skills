import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap } from '../sounds';

const PUZZLES = [
  {
    cause: '🌧️', hint: 'It rains a lot...', answer: '🌊', answerLabel: 'Puddles!',
    choices: [{ emoji: '🌊', label: 'Puddles' }, { emoji: '🔥', label: 'Fire' }, { emoji: '❄️', label: 'Snow' }, { emoji: '🌵', label: 'Desert' }],
  },
  {
    cause: '☀️', hint: 'Ice cream in the sun...', answer: '🫠', answerLabel: 'It melts!',
    choices: [{ emoji: '🫠', label: 'Melts' }, { emoji: '🧊', label: 'Freezes' }, { emoji: '💨', label: 'Flies' }, { emoji: '🎵', label: 'Sings' }],
  },
  {
    cause: '🌱', hint: 'Water a seed every day...', answer: '🌻', answerLabel: 'Flower!',
    choices: [{ emoji: '🌻', label: 'Flower' }, { emoji: '🪨', label: 'Rock' }, { emoji: '⭐', label: 'Star' }, { emoji: '🧸', label: 'Teddy' }],
  },
  {
    cause: '💨', hint: 'Strong wind blows...', answer: '🍂', answerLabel: 'Leaves fall!',
    choices: [{ emoji: '🍂', label: 'Leaves' }, { emoji: '🐟', label: 'Fish' }, { emoji: '📚', label: 'Books' }, { emoji: '🎸', label: 'Guitar' }],
  },
  {
    cause: '🥶', hint: 'It gets very cold...', answer: '❄️', answerLabel: 'Ice!',
    choices: [{ emoji: '❄️', label: 'Ice' }, { emoji: '🔥', label: 'Fire' }, { emoji: '🌺', label: 'Flowers' }, { emoji: '🦁', label: 'Lion' }],
  },
  {
    cause: '😴', hint: 'You stay up late...', answer: '🥱', answerLabel: 'Sleepy!',
    choices: [{ emoji: '🥱', label: 'Sleepy' }, { emoji: '💪', label: 'Strong' }, { emoji: '🎵', label: 'Music' }, { emoji: '🍕', label: 'Pizza' }],
  },
  {
    cause: '📚', hint: 'You read every day...', answer: '🧠', answerLabel: 'Smarter!',
    choices: [{ emoji: '🧠', label: 'Smart' }, { emoji: '🦷', label: 'Teeth' }, { emoji: '🧊', label: 'Ice' }, { emoji: '🎈', label: 'Balloon' }],
  },
  {
    cause: '🔋', hint: 'Battery runs out...', answer: '📵', answerLabel: 'Off!',
    choices: [{ emoji: '📵', label: 'Off' }, { emoji: '🚀', label: 'Flies' }, { emoji: '🎉', label: 'Party' }, { emoji: '🌈', label: 'Rainbow' }],
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
    speak(puzzle.hint + ' What happens?');
  }, [puzzleIndex]);

  const handleChoice = useCallback((choice) => {
    if (selected !== null) return;
    unlockAudio();
    playTap();
    setSelected(choice.emoji);
    if (choice.emoji === puzzle.answer) {
      setIsCorrect(true);
      setRoundStars(s => s + 1);
      playCorrect();
    } else {
      setIsCorrect(false);
      playWrong();
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
    }, 900);
  }, [selected, puzzle, puzzleIndex, roundStars, onAddStars]);

  if (showComplete) {
    return (
      <GameShell title="What Happens?" emoji="⚡" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={Math.min(roundSize, roundStars)} onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="What Happens?" emoji="⚡" stars={stars} onBack={onHome} speakText={puzzle.hint + ' What happens?'}>
      <div className="cause-card">
        <div className="cause-emoji">{puzzle.cause}</div>
      </div>

      <div className="effect-options">
        {shuffledChoices.map((choice, i) => (
          <button
            key={i}
            className={`effect-btn ${selected === choice.emoji ? (isCorrect ? 'correct' : 'wrong') : ''}`}
            onClick={() => handleChoice(choice)}
          >
            {choice.emoji}
          </button>
        ))}
      </div>
    </GameShell>
  );
}
