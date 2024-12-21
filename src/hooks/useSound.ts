import { useCallback } from 'react';

const SOUND_PATHS = {
  shoot: '/sounds/shoot.mp3',
  explosion: '/sounds/explosion.mp3',
  powerup: '/sounds/powerup.mp3',
  damage: '/sounds/damage.mp3',
  gameOver: '/sounds/game-over.mp3',
} as const;

export const useSound = () => {
  const sounds = new Map(
    Object.entries(SOUND_PATHS).map(([key, path]) => [key, new Audio(path)])
  );

  const play = useCallback((soundName: keyof typeof SOUND_PATHS) => {
    const sound = sounds.get(soundName);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  }, []);

  return { play };
};