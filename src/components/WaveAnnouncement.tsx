import React from 'react';

interface Props {
  wave: number;
  visible: boolean;
}

export const WaveAnnouncement: React.FC<Props> = ({ wave, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-6xl font-bold text-white animate-pulse">
        Wave {wave}
      </div>
    </div>
  );
};