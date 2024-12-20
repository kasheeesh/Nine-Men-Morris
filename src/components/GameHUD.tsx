import React from 'react';
import { Heart } from 'lucide-react';

interface Props {
  score: number;
  lives: number;
}

export const GameHUD: React.FC<Props> = ({ score, lives }) => {
  return (
    <div className="absolute top-4 left-4 flex items-center gap-8">
      <div className="text-white text-xl font-bold">
        Score: {score}
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: lives }).map((_, i) => (
          <Heart key={i} className="text-red-500" fill="currentColor" />
        ))}
      </div>
    </div>
  );
};