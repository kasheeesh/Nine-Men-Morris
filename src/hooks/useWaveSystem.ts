import { useEffect, useState } from 'react';

interface WaveSystemProps {
  score: number;
  onWaveChange: (wave: number) => void;
}

export const useWaveSystem = ({ score, onWaveChange }: WaveSystemProps) => {
  const [currentWave, setCurrentWave] = useState(1);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    const newWave = Math.floor(score / 2000) + 1;
    
    if (newWave !== currentWave) {
      setCurrentWave(newWave);
      setShowAnnouncement(true);
      onWaveChange(newWave);
      
      // Hide announcement after 3 seconds
      setTimeout(() => {
        setShowAnnouncement(false);
      }, 3000);
    }
  }, [score, currentWave, onWaveChange]);

  return {
    wave: currentWave,
    showAnnouncement
  };
};