import { useState, useEffect } from 'react';
import './App.css';
import { useProgress } from './useProgress';
import { speak } from './speak';
import PatternDetective from './games/PatternDetective';
import BigPictureBuilder from './games/BigPictureBuilder';
import BossBrain from './games/BossBrain';
import StoryMachine from './games/StoryMachine';
import IdeaMixer from './games/IdeaMixer';
import CauseEffect from './games/CauseEffect';

const GAMES = [
  {
    id: 'pattern',
    title: 'Pattern Detective',
    icon: '🔍',
    color: 'pink',
    skill: 'Find patterns',
    Component: PatternDetective,
  },
  {
    id: 'systems',
    title: 'Big Picture',
    icon: '🧩',
    color: 'purple',
    skill: 'See how things connect',
    Component: BigPictureBuilder,
  },
  {
    id: 'boss',
    title: 'Boss Brain',
    icon: '👑',
    color: 'green',
    skill: 'Break things into steps',
    Component: BossBrain,
  },
  {
    id: 'story',
    title: 'Story Machine',
    icon: '🤖',
    color: 'blue',
    skill: 'Give clear instructions',
    Component: StoryMachine,
  },
  {
    id: 'mixer',
    title: 'Idea Mixer',
    icon: '💡',
    color: 'orange',
    skill: 'Mix ideas together',
    Component: IdeaMixer,
  },
  {
    id: 'cause',
    title: 'Why? What Happens?',
    icon: '⚡',
    color: 'yellow',
    skill: 'Predict what happens',
    Component: CauseEffect,
  },
];

export default function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const { progress, addStars } = useProgress();

  // Preload voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const handleOpenGame = (game) => {
    setCurrentGame(game);
    speak(game.title);
  };

  const handleGoHome = () => {
    setCurrentGame(null);
  };

  // If a game is active, render it
  if (currentGame) {
    const { Component, id, title } = currentGame;
    return (
      <div className="app">
        <Component
          stars={progress.games[id].stars}
          onAddStars={addStars}
          onHome={handleGoHome}
        />
      </div>
    );
  }

  // Home screen
  return (
    <div className="app">
      <div className="home">
        <div className="home-header slide-up">
          <h1>Brain Games!</h1>
          <div className="subtitle">Pick a game to play</div>
        </div>

        <div className="stars-bar slide-up" style={{ animationDelay: '0.1s' }}>
          <span>⭐</span>
          <span className="star-count">{progress.totalStars}</span>
          <span>stars</span>
        </div>

        <div className="game-grid">
          {GAMES.map((game, i) => (
            <button
              key={game.id}
              className="game-card pop-in"
              data-color={game.color}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              onClick={() => handleOpenGame(game)}
            >
              {progress.games[game.id].stars > 0 && (
                <div className="card-badge">⭐</div>
              )}
              <div className="card-icon">{game.icon}</div>
              <div className="card-title">{game.title}</div>
              <div className="card-stars">
                {progress.games[game.id].stars > 0
                  ? `⭐ ${progress.games[game.id].stars}`
                  : 'New!'}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
