import React from 'react';
import { Meteorite as MeteoriteType } from '../types/game';

interface Props {
  meteorite: MeteoriteType;
}

export const Meteorite: React.FC<Props> = ({ meteorite }) => {
  return (
    <div
      className="absolute rounded-full bg-gray-400"
      style={{
        left: meteorite.x,
        top: meteorite.y,
        width: meteorite.width,
        height: meteorite.height,
        transform: 'rotate(45deg)',
        background: 'linear-gradient(45deg, #4B5563, #1F2937)',
      }}
    />
  );
};