import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Spaceship } from './Spaceship';
import { GameHUD } from './GameHUD';
import { Meteorite } from './Meteorite';
import { PowerUpItem } from './PowerUpItem';
import { WaveAnnouncement } from './WaveAnnouncement';
import { useGameLoop } from '../hooks/useGameLoop';
import { useSound } from '../hooks/useSound';
import { useWaveSystem } from '../hooks/useWaveSystem';
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
  const [gameOver, setGameOver] = useState(false);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [meteorites, setMeteorites] = useState<MeteoriteType[]>([]);
  const [powerups, setPowerups] = useState<PowerUp[]>([]);
  
  const lastShotRef = useRef<number>(0);
  const lastMeteoriteRef = useRef<number>(0);
  const lastPowerupRef = useRef<number>(0);
  const { play } = useSound();

  const handleWaveChange = useCallback((newWave: number) => {
    play('powerup');
  }, [play]);

  const { wave, showAnnouncement } = useWaveSystem({
    score,
    onWaveChange: handleWaveChange
  });

  // Reset ship position and health when losing a life
  const resetShipState = useCallback(() => {
    setShip(prev => ({
      ...INITIAL_SHIP,
      lives: prev.lives
    }));
  }, []);

  // Handle ship movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setShip(prev => ({
        ...prev,
        x: Math.max(0, Math.min(e.clientX - prev.width / 2, window.innerWidth - prev.width))
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle shooting
  useEffect(() => {
    const handleClick = () => {
      const now = Date.now();
      if (now - lastShotRef.current >= GAME_CONFIG.ship.shootCooldown) {
        const newBullets = createBullets(ship, ship.powerups.multishot);
        setBullets(prev => [...prev, ...newBullets]);
        play('shoot');
        lastShotRef.current = now;
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [ship, play]);

  // Check health and lives
  useEffect(() => {
    if (ship.health <= 0 && !gameOver) {
      play('damage');
      const newLives = ship.lives - 1;
      
      if (newLives <= 0) {
        setGameOver(true);
        play('gameOver');
      } else {
        setShip(prev => ({
          ...prev,
          lives: newLives
        }));
        resetShipState();
      }
    }
  }, [ship.health, ship.lives, gameOver, play, resetShipState]);

  // Game loop
  useGameLoop(useCallback(() => {
    if (gameOver) return;

    // Update bullets
    setBullets(prev => updateBullets(prev));

    // Update meteorites
    setMeteorites(prev => updateMeteorites(prev));

    // Update powerups
    setPowerups(prev => updatePowerups(prev));

    const now = Date.now();

    // Create new meteorites
    if (now - lastMeteoriteRef.current >= GAME_CONFIG.meteorite.spawnInterval) {
      setMeteorites(prev => [...prev, createMeteorite(wave)]);
      lastMeteoriteRef.current = now;
    }

    // Create new powerups
    if (now - lastPowerupRef.current >= GAME_CONFIG.powerup.spawnInterval) {
      setPowerups(prev => [...prev, createPowerup()]);
      lastPowerupRef.current = now;
    }

    // Check collisions
    checkGameCollisions(
      ship,
      bullets,
      meteorites,
      powerups,
      () => {
        if (!ship.powerups.shield) {
          play('damage');
          setShip(prev => ({
            ...prev,
            health: prev.health - 20 // Increased damage for more challenge
          }));
        }
      },
      () => {
        play('explosion');
        setScore(prev => prev + 100);
      },
      (type) => {
        play('powerup');
        setShip(prev => ({
          ...prev,
          powerups: {
            ...prev.powerups,
            [type === 'shield' ? 'shield' : 'multishot']: true
          }
        }));
        setTimeout(() => {
          setShip(prev => ({
            ...prev,
            powerups: {
              ...prev.powerups,
              [type === 'shield' ? 'shield' : 'multishot']: false
            }
          }));
        }, GAME_CONFIG.powerup.duration);
      }
    );
  }, [ship, bullets, meteorites, powerups, gameOver, wave, play]));

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <GameHUD score={score} lives={ship.lives} wave={wave} />
      <WaveAnnouncement wave={wave} visible={showAnnouncement} />
      <Spaceship ship={ship} />
      {meteorites.map((meteorite, index) => (
        meteorite.active && <Meteorite key={index} meteorite={meteorite} />
      ))}
      {bullets.map((bullet, index) => (
        bullet.active && (
          <div
            key={index}
            className="absolute bg-yellow-400 rounded-full"
            style={{
              left: bullet.x,
              top: bullet.y,
              width: bullet.width,
              height: bullet.height
            }}
          />
        )
      ))}
      {powerups.map((powerup, index) => (
        powerup.active && <PowerUpItem key={index} powerup={powerup} />
      ))}
      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Game Over</h2>
            <p className="text-2xl">Final Score: {score}</p>
          </div>
        </div>
      )}
    </div>
  );
};