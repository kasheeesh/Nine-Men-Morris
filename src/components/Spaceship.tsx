import React from 'react';
import { Rocket } from 'lucide-react';
import { Spaceship as SpaceshipType } from '../types/game';

interface Props {
  ship: SpaceshipType;
}

export const Spaceship: React.FC<Props> = ({ ship }) => {
  return (
    <div 
      className="absolute transition-transform"
      style={{ 
        transform: `translate(${ship.x}px, ${ship.y}px)`,
        filter: ship.powerups.shield ? 'drop-shadow(0 0 8px #60A5FA)' : 'none'
      }}
    >
      <Rocket size={32} className="text-green-500" />
      <div className="absolute -top-4 left-0 w-full">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${(ship.health / 100) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};