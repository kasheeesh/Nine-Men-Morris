import { Bullet, Spaceship } from '../types/game';
import { GAME_CONFIG } from '../constants/gameConfig';

export const createBullet = (ship: Spaceship, xOffset: number = 0): Bullet => {
  const bulletX = ship.x + (ship.width / 2) - (GAME_CONFIG.bullet.width / 2) + xOffset;
  const bulletY = ship.y - GAME_CONFIG.bullet.height;

  return {
    x: bulletX,
    y: bulletY,
    width: GAME_CONFIG.bullet.width,
    height: GAME_CONFIG.bullet.height,
    active: true
  };
};

export const createBullets = (ship: Spaceship, isMultishot: boolean): Bullet[] => {
  if (isMultishot) {
    return [
      createBullet(ship, -15),
      createBullet(ship),
      createBullet(ship, 15)
    ];
  }
  return [createBullet(ship)];
};

export const updateBullets = (bullets: Bullet[]) => {
  return bullets
    .map(bullet => ({
      ...bullet,
      y: bullet.y - GAME_CONFIG.bullet.speed,
    }))
    .filter(bullet => bullet.y + bullet.height > 0 && bullet.active);
};