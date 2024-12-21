import React from 'react';
import { Shield, Zap } from 'lucide-react';
import { PowerUp } from '../types/game';

interface Props {
  powerup: PowerUp;
}

export const PowerUpItem: React.FC<Props> = ({ powerup }) => {
  return (
    <div
      className="absolute animate-bounce"
      style={{
        left: powerup.x,
        top: powerup.y,
        width: powerup.width,
        height: powerup.height,
      }}
    >
      {powerup.type === 'shield' ? (
        <Shield className="text-blue-400" />
      ) : (
        <Zap className="text-yellow-400" />
      )}
    </div>
  );
};