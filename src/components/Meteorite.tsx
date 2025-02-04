import React from 'react';
import { Meteorite as MeteoriteType } from '../types/game';

interface Props {
  meteorite: MeteoriteType;
}

export const Meteorite: React.FC<Props> = ({ meteorite }) => {
  return (
    <div
     className="absolute bg-gray-600 w-12 h-12 rounded-full shadow-lg blur-[0.5px] border-[3px] border-gray-500 border-dashed"

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