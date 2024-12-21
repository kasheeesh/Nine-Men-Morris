import { GAME_CONFIG } from '../constants/gameConfig';

export const calculateWaveMeteorites = (wave: number) => {
  return GAME_CONFIG.wave.initialEnemies + (wave - 1) * GAME_CONFIG.wave.enemyIncrement;
};

export const calculateMeteoriteSpeed = (wave: number) => {
  const baseSpeed = GAME_CONFIG.meteorite.minSpeed;
  const speedIncrease = Math.min(wave * 0.5, GAME_CONFIG.meteorite.maxSpeed - baseSpeed);
  return baseSpeed + speedIncrease;
};