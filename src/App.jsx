import { useState, useEffect } from 'react';
import './App.css';
import { useProgress } from './useProgress';
import { speak, initSpeech, unlockAudio } from './speak';
import { playTap } from './sounds';
import Mascot from './Mascot';
import PatternDetective from './games/PatternDetective';
import BigPictureBuilder from './games/BigPictureBuilder';
import BossBrain from './games/BossBrain';
import StoryMachine from './games/StoryMachine';
import IdeaMixer from './games/IdeaMixer';
import CauseEffect from './games/CauseEffect';
import SortItOut from './games/SortItOut';
import MemoryMatch from './games/MemoryMatch';

const GAMES = [
  { id: 'pattern', title: 'Patterns', icon: '🔍', color: 'pink', Component: PatternDetective },
  { id: 'systems', title: 'Big Picture', icon: '🧩', color: 'purple', Component: BigPictureBuilder },
  { id: 'boss', title: 'Boss Brain', icon: '👑', color: 'green', Component: BossBrain },
  { id: 'story', title: 'Story Machine', icon: '🤖', color: 'blue', Component: StoryMachine },
  { id: 'mixer', title: 'Idea Mixer', icon: '💡', color: 'orange', Component: IdeaMixer },
  { id: 'cause', title: 'What Happens?', icon: '⚡', color: 'yellow', Component: CauseEffect },
  { id: 'sort', title: 'Sort It', icon: '📦', color: 'pink', Component: SortItOut },
  { id: 'memory', title: 'Memory', icon: '🧠', color: 'purple', Component: MemoryMatch },
];

export default function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [started, setStarted] = useState(false);
  const { progress, addStars } = useProgress();

  useEffect(() => {
    initSpeech();
  }, []);

  // Splash screen — requires a tap to unlock audio on mobile
  const handleStart = () => {
    unlockAudio();
    playTap();
    setStarted(true);
    speak('Pick a game!');
  };

  const handleOpenGame = (game) => {
    unlockAudio();
    playTap();
    setCurrentGame(game);
  };

  const handleGoHome = () => {
    setCurrentGame(null);
  };

  if (!started) {
    return (
      <div className="app">
        <div className="home" style={{ justifyContent: 'center', alignItems: 'center', gap: 24 }}>
          <Mascot size={140} />
          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--yellow), var(--orange), var(--pink))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Brain Games!
          </h1>
          <button className="action-btn bounce" onClick={handleStart} style={{ fontSize: '1.5rem', padding: '18px 50px' }}>
            ▶ Play
          </button>
        </div>
      </div>
    );
  }

  if (currentGame) {
    const { Component, id } = currentGame;
    return (
      <div className="app">
        <Component
          stars={progress.games[id]?.stars || 0}
          onAddStars={addStars}
          onHome={handleGoHome}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="home">
        <div className="home-header slide-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Mascot size={50} />
          <h1>Brain Games!</h1>
        </div>

        <div className="stars-bar slide-up" style={{ animationDelay: '0.1s' }}>
          <span style={{ fontSize: '1.6rem' }}>⭐</span>
          <span className="star-count">{progress.totalStars}</span>
        </div>

        <div className="game-grid">
          {GAMES.map((game, i) => (
            <button
              key={game.id}
              className="game-card pop-in"
              data-color={game.color}
              style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              onClick={() => handleOpenGame(game)}
            >
              {(progress.games[game.id]?.stars || 0) > 0 && (
                <div className="card-badge">⭐</div>
              )}
              <div className="card-icon">{game.icon}</div>
              <div className="card-title">{game.title}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
