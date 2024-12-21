import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Spaceship } from './Spaceship';
import { GameHUD } from './GameHUD';
import { Meteorite } from './Meteorite';
import { PowerUpItem } from './PowerUpItem';
import { WaveAnnouncement } from './WaveAnnouncement';
import { useGameLoop } from '../hooks/useGameLoop';
import { useSound } from '../hooks/useSound';
import { GAME_CONFIG } from '../constants/gameConfig';
import { updateMeteorites, updatePowerups, createMeteorite, createPowerup, checkGameCollisions } from '../utils/gameLogic';
import { createBullets, updateBullets } from '../utils/bulletUtils';
import type { Spaceship as SpaceshipType, Bullet, Meteorite as MeteoriteType, PowerUp } from '../types/game';

const INITIAL_SHIP: SpaceshipType = {
  x: window.innerWidth / 2,
  y: window.innerHeight - 100,
  width: GAME_CONFIG.ship.width,
  height: GAME_CONFIG.ship.height,
  health: GAME_CONFIG.ship.initialHealth,
  lives: GAME_CONFIG.ship.initialLives,
  powerups: {
    shield: false,
    multishot: false
  }
};

export const Game: React.FC = () => {
  const [ship, setShip] = useState<SpaceshipType>(INITIAL_SHIP);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [showWaveAnnouncement, setShowWaveAnnouncement] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [meteorites, setMeteorites] = useState<MeteoriteType[]>([]);
  const [powerups, setPowerups] = useState<PowerUp[]>([]);
  
  const lastShotRef = useRef<number>(0);
  const lastMeteoriteRef = useRef<number>(0);
  const lastPowerupRef = useRef<number>(0);
  const { play } = useSound();

  const spawnEntities = useCallback(() => {
    const now = Date.now();

    // Spawn meteorites
    if (now - lastMeteoriteRef.current > GAME_CONFIG.meteorite.spawnInterval) {
      setMeteorites(prev => [...prev, createMeteorite(wave)]);
      lastMeteoriteRef.current = now;
    }

    // Spawn powerups
    if (now - lastPowerupRef.current > GAME_CONFIG.powerup.spawnInterval) {
      setPowerups(prev => [...prev, createPowerup()]);
      lastPowerupRef.current = now;
    }
  }, [wave]);

  const handleHit = useCallback(() => {
    play('damage');
    if (!ship.powerups.shield) {
      setShip(prev => {
        const newHealth = prev.health - 20;
        if (newHealth <= 0) {
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            play('gameOver');
            setGameOver(true);
            return prev;
          }
          return { ...INITIAL_SHIP, lives: newLives };
        }
        return { ...prev, health: newHealth };
      });
    }
  }, [ship.powerups.shield, play]);

  const handleScore = useCallback(() => {
    play('explosion');
    setScore(prev => prev + 100);
  }, [play]);

  const handlePowerup = useCallback((type: PowerUp['type']) => {
    play('powerup');
    setShip(prev => ({
      ...prev,
      powerups: {
        ...prev.powerups,
        [type === 'shield' ? 'shield' : 'multishot']: true
      }
    }));

    // Remove powerup after duration
    setTimeout(() => {
      setShip(prev => ({
        ...prev,
        powerups: {
          ...prev.powerups,
          [type === 'shield' ? 'shield' : 'multishot']: false
        }
      }));
    }, GAME_CONFIG.powerup.duration);
  }, [play]);

  const shoot = useCallback(() => {
    play('shoot');
    const newBullets = createBullets(ship, ship.powerups.multishot);
    setBullets(prev => [...prev, ...newBullets]);
  }, [ship, play]);

  // Game loop implementation
  const gameLoop = useCallback(() => {
    if (gameOver) return;
    
    setBullets(prev => updateBullets(prev));
    setMeteorites(prev => updateMeteorites(prev));
    setPowerups(prev => updatePowerups(prev));
    checkGameCollisions(ship, bullets, meteorites, powerups, handleHit, handleScore, handlePowerup);
    spawnEntities();
  }, [gameOver, ship, bullets, meteorites, powerups, handleHit, handleScore, handlePowerup, spawnEntities]);

  useGameLoop(gameLoop);

  // Input handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameOver) {
        setShip(prev => ({
          ...prev,
          x: Math.max(0, Math.min(e.clientX - GAME_CONFIG.ship.width / 2, window.innerWidth - GAME_CONFIG.ship.width))
        }));
      }
    };

    const handleClick = () => {
      if (!gameOver && Date.now() - lastShotRef.current > GAME_CONFIG.ship.shootCooldown) {
        shoot();
        lastShotRef.current = Date.now();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [gameOver, shoot]);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <GameHUD score={score} lives={ship.lives} wave={wave} />
      <WaveAnnouncement wave={wave} visible={showWaveAnnouncement} />
      <Spaceship ship={ship} />
      
      {bullets.map((bullet, index) => (
        <div
          key={index}
          className="absolute bg-yellow-400"
          style={{
            left: bullet.x,
            top: bullet.y,
            width: bullet.width,
            height: bullet.height
          }}
        />
      ))}

      {meteorites.map((meteorite, index) => (
        <Meteorite key={index} meteorite={meteorite} />
      ))}

      {powerups.map((powerup, index) => (
        <PowerUpItem key={index} powerup={powerup} />
      ))}

      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Game Over</h2>
            <p className="text-xl mb-2">Wave: {wave}</p>
            <p className="text-xl mb-8">Final Score: {score}</p>
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};