import { useState, useEffect, useCallback } from 'react';
import GameShell from '../GameShell';
import LevelComplete from '../LevelComplete';
import { speak, unlockAudio } from '../speak';
import { playCorrect, playWrong, playTap } from '../sounds';

const PUZZLES = [
  {
    cause: '🌧️', hint: 'IT RAINS A LOT...', answer: '🌊', answerLabel: 'PUDDLES!',
    choices: [{ emoji: '🌊', label: 'PUDDLES' }, { emoji: '🔥', label: 'FIRE' }, { emoji: '❄️', label: 'SNOW' }, { emoji: '🌵', label: 'DESERT' }],
  },
  {
    cause: '☀️', hint: 'ICE CREAM IN THE SUN...', answer: '🫠', answerLabel: 'IT MELTS!',
    choices: [{ emoji: '🫠', label: 'MELTS' }, { emoji: '🧊', label: 'FREEZES' }, { emoji: '💨', label: 'FLIES' }, { emoji: '🎵', label: 'SINGS' }],
  },
  {
    cause: '🌱', hint: 'WATER A SEED EVERY DAY...', answer: '🌻', answerLabel: 'FLOWER!',
    choices: [{ emoji: '🌻', label: 'FLOWER' }, { emoji: '🪨', label: 'ROCK' }, { emoji: '⭐', label: 'STAR' }, { emoji: '🧸', label: 'TEDDY' }],
  },
  {
    cause: '💨', hint: 'STRONG WIND BLOWS...', answer: '🍂', answerLabel: 'LEAVES FALL!',
    choices: [{ emoji: '🍂', label: 'LEAVES' }, { emoji: '🐟', label: 'FISH' }, { emoji: '📚', label: 'BOOKS' }, { emoji: '🎸', label: 'GUITAR' }],
  },
  {
    cause: '🥶', hint: 'IT GETS VERY COLD...', answer: '❄️', answerLabel: 'ICE!',
    choices: [{ emoji: '❄️', label: 'ICE' }, { emoji: '🔥', label: 'FIRE' }, { emoji: '🌺', label: 'FLOWERS' }, { emoji: '🦁', label: 'LION' }],
  },
  {
    cause: '😴', hint: 'YOU STAY UP LATE...', answer: '🥱', answerLabel: 'SLEEPY!',
    choices: [{ emoji: '🥱', label: 'SLEEPY' }, { emoji: '💪', label: 'STRONG' }, { emoji: '🎵', label: 'MUSIC' }, { emoji: '🍕', label: 'PIZZA' }],
  },
  {
    cause: '📚', hint: 'YOU READ EVERY DAY...', answer: '🧠', answerLabel: 'SMARTER!',
    choices: [{ emoji: '🧠', label: 'SMART' }, { emoji: '🦷', label: 'TEETH' }, { emoji: '🧊', label: 'ICE' }, { emoji: '🎈', label: 'BALLOON' }],
  },
  {
    cause: '🔋', hint: 'BATTERY RUNS OUT...', answer: '📵', answerLabel: 'OFF!',
    choices: [{ emoji: '📵', label: 'OFF' }, { emoji: '🚀', label: 'FLIES' }, { emoji: '🎉', label: 'PARTY' }, { emoji: '🌈', label: 'RAINBOW' }],
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
  const [completedStars, setCompletedStars] = useState(0);
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
        setCompletedStars(earned);
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
      <GameShell title="WHAT HAPPENS?" emoji="⚡" stars={stars} onBack={onHome}>
        <LevelComplete starsEarned={completedStars} onNext={() => { setShowComplete(false); setPuzzleIndex(i => i + 1); }} onHome={onHome} />
      </GameShell>
    );
  }

  return (
    <GameShell title="WHAT HAPPENS?" emoji="⚡" stars={stars} onBack={onHome} speakText={puzzle.hint + ' What happens?'}>
      <div className="cause-card">
        <div className="cause-emoji">{puzzle.cause}</div>
        <div className="cause-text">{puzzle.hint}</div>
      </div>

      <div className="effect-options">
        {shuffledChoices.map((choice, i) => (
          <button
            key={i}
            className={`effect-btn ${selected === choice.emoji ? (isCorrect ? 'correct' : 'wrong') : ''}`}
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
