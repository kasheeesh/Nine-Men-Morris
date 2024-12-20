import { Meteorite, PowerUp, Spaceship } from '../types/game';
import { GAME_CONFIG } from '../constants/gameConfig';
import { checkCollision } from './collision';
import { calculateMeteoriteSpeed } from './wave';

export const updateMeteorites = (meteorites: Meteorite[]) => {
  return meteorites
    .map(meteorite => ({
      ...meteorite,
      y: meteorite.y + meteorite.speed,
    }))
    .filter(meteorite => meteorite.y < window.innerHeight && meteorite.active);
};

export const updatePowerups = (powerups: PowerUp[]) => {
  return powerups
    .map(powerup => ({
      ...powerup,
      y: powerup.y + 2,
    }))
    .filter(powerup => powerup.y < window.innerHeight && powerup.active);
};

export const createMeteorite = (wave: number): Meteorite => {
  const size = Math.random() * (GAME_CONFIG.meteorite.maxSize - GAME_CONFIG.meteorite.minSize) + GAME_CONFIG.meteorite.minSize;
  return {
    x: Math.random() * (window.innerWidth - size),
    y: -size,
    width: size,
    height: size,
    speed: calculateMeteoriteSpeed(wave),
    active: true,
  };
};

export const createPowerup = (): PowerUp => {
  return {
    x: Math.random() * (window.innerWidth - GAME_CONFIG.powerup.size),
    y: -GAME_CONFIG.powerup.size,
    width: GAME_CONFIG.powerup.size,
    height: GAME_CONFIG.powerup.size,
    type: Math.random() > 0.5 ? 'shield' : 'bolt',
    active: true,
  };
};

export const checkGameCollisions = (
  ship: Spaceship,
  bullets: Bullet[],
  meteorites: Meteorite[],
  powerups: PowerUp[],
  onHit: () => void,
  onScore: () => void,
  onPowerup: (type: PowerUp['type']) => void
) => {
  // Check bullet-meteorite collisions
  bullets.forEach(bullet => {
    meteorites.forEach(meteorite => {
      if (bullet.active && meteorite.active && checkCollision(bullet, meteorite)) {
        bullet.active = false;
        meteorite.active = false;
        onScore();
      }
    });
  });

  // Check ship-meteorite collisions
  meteorites.forEach(meteorite => {
    if (meteorite.active && checkCollision(ship, meteorite)) {
      meteorite.active = false;
      onHit();
    }
  });

  // Check ship-powerup collisions
  powerups.forEach(powerup => {
    if (powerup.active && checkCollision(ship, powerup)) {
      powerup.active = false;
      onPowerup(powerup.type);
    }
  });
};