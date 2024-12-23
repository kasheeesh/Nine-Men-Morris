export const GAME_CONFIG = {
  ship: {
    width: 32,
    height: 32,
    initialHealth: 100,
    initialLives: 3,
    shootCooldown: 250,
  },
  bullet: {
    width: 4,
    height: 10,
    speed: 10,
  },
  meteorite: {
    minSize: 20,
    maxSize: 50,
    minSpeed: 2,
    maxSpeed: 5,
    spawnInterval: 1000,
  },
  powerup: {
    duration: 5000,
    spawnInterval: 10000,
    size: 24,
  },
  wave: {
    initialEnemies: 5,
    enemyIncrement: 2,
    timeBetweenWaves: 5000,
  }
} as const;