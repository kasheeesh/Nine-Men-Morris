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
import sp from "../assets/sp.mp4"
import axios from 'axios'; // Import axios for API calls

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
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]); // Store leaderboard data

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

  const resetShipState = useCallback(() => {
    setShip(prev => ({
      ...INITIAL_SHIP,
      lives: prev.lives
    }));
  }, []);

  // Handle mouse movement
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
        // Save the score to the backend when the game ends
        const token = localStorage.getItem('token'); // Assuming the JWT token is stored in localStorage
        axios.post('http://localhost:5000/save-score', { score }, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => console.log('Score saved successfully'))
        .catch(err => console.error('Error saving score:', err));
      } else {
        setShip(prev => ({
          ...prev,
          lives: newLives
        }));
        resetShipState();
      }
    }
  }, [ship.health, ship.lives, gameOver, play, resetShipState, score]);

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

  // Fetch leaderboard when button is clicked
  const handleLeaderboard = () => {
    axios.get('http://localhost:5000/leaderboard')
      .then(response => {
        console.log(response.data);
        setLeaderboard(response.data);
        setShowLeaderboard(true);
      })
      .catch(err => console.error('Error fetching leaderboard:', err));
  };

  return (
    // <div className="w-full h-screen bg-black overflow-hidden relative">
    //   <GameHUD score={score} lives={ship.lives} wave={wave} />
    //   <WaveAnnouncement wave={wave} visible={showAnnouncement} />
    //   <Spaceship ship={ship} />
    //   {meteorites.map((meteorite, index) => (
    //     meteorite.active && <Meteorite key={index} meteorite={meteorite} />
    //   ))}
    //   {bullets.map(function (bullet, index) {
    //     return (
    //       bullet.active && (
    //         <div
    //           key={index}
    //           className="absolute bg-yellow-400 rounded-full"
    //           style={{
    //             left: bullet.x,
    //             top: bullet.y,
    //             width: bullet.width,
    //             height: bullet.height
    //           }} />
    //       )
    //     );
    //   })}
    //   {powerups.map((powerup, index) => (
    //     powerup.active && <PowerUpItem key={index} powerup={powerup} />
    //   ))}
    //   {gameOver && (
    //     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
    //       <div className="text-white text-center">
    //         <h2 className="text-4xl font-bold mb-4">Game Over</h2>
    //         <p className="text-2xl">Final Score: {score}</p>
    //         <button
    //           className="bg-blue-500 text-white px-4 py-2 rounded"
    //           onClick={handleLeaderboard}
    //         >
    //           View Leaderboard
    //         </button>
    //       </div>
    //     </div>
    //   )}
    //   {showLeaderboard && (
    //     <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
    //       <div className="text-white text-center">
    //         <h2 className="text-4xl font-bold mb-4">Leaderboard</h2>
    //         <ul className="list-none">
    //           {leaderboard.map((entry, index) => (
    //             <li key={index} className="mb-2 text-lg">{`${index + 1}. ${entry.username} - ${entry.highestScore}`}</li>
    //           ))}
    //         </ul>
    //         <button
    //           className="bg-red-500 text-white px-4 py-2 rounded mt-4"
    //           onClick={() => setShowLeaderboard(false)}
    //         >
    //           Close
    //         </button>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="w-full h-screen overflow-hidden relative">
  {/* Video Background */}
  <video
    autoPlay
    loop
    muted
    className="absolute top-0 left-0 w-full h-full object-cover"
  >
    <source src={sp} type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Dark Overlay (Optional, for better visibility of game elements) */}
  <div className="absolute inset-0 bg-black bg-opacity-50"></div>

  {/* Game HUD and Elements */}
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

  {/* Game Over Screen */}
  {gameOver && (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Game Over</h2>
        <p className="text-2xl">Final Score: {score}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleLeaderboard}
        >
          View Leaderboard
        </button>
      </div>
    </div>
  )}

  {/* Leaderboard Screen */}
  {showLeaderboard && (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
      <div className="text-white text-center">
        <h2 className="text-4xl font-bold mb-4">Leaderboard</h2>
        <ul className="list-none">
          {leaderboard.map((entry, index) => (
            <li key={index} className="mb-2 text-lg">{`${index + 1}. ${entry.username} - ${entry.highestScore}`}</li>
          ))}
        </ul>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => setShowLeaderboard(false)}
        >
          Close
        </button>
      </div>
    </div>
  )}
</div>

  );
};
