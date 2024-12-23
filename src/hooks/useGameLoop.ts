import { useEffect, useRef } from 'react';

export const useGameLoop = (callback: () => void) => {
  const frameRef = useRef<number>();

  useEffect(() => {
    const loop = () => {
      callback();
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [callback]);
};