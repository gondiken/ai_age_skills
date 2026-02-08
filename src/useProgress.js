import { useState, useEffect } from 'react';

const STORAGE_KEY = 'brain_games_progress';

const defaultProgress = {
  totalStars: 0,
  games: {
    pattern: { stars: 0, highLevel: 0 },
    systems: { stars: 0, highLevel: 0 },
    boss: { stars: 0, highLevel: 0 },
    story: { stars: 0, highLevel: 0 },
    mixer: { stars: 0, highLevel: 0 },
    cause: { stars: 0, highLevel: 0 },
    sort: { stars: 0, highLevel: 0 },
    memory: { stars: 0, highLevel: 0 },
  },
};

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultProgress,
          ...parsed,
          games: { ...defaultProgress.games, ...parsed.games },
        };
      }
      return defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const addStars = (gameId, count) => {
    setProgress(prev => ({
      ...prev,
      totalStars: prev.totalStars + count,
      games: {
        ...prev.games,
        [gameId]: {
          ...prev.games[gameId],
          stars: (prev.games[gameId]?.stars || 0) + count,
        },
      },
    }));
  };

  return { progress, addStars };
}
