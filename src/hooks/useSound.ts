// import { useCallback, useEffect, useRef } from 'react';

// // Preload audio files to ensure they're ready when needed
// const preloadAudio = (path: string): HTMLAudioElement => {
//   const audio = new Audio(path);
//   audio.load(); // Explicitly load the audio file
//   return audio;
// };

// const SOUND_PATHS = {
//   shoot: '/sounds/sounds.mp3',
//   explosion: '/sounds/explosion.mp3',
//   powerup: '/sounds/powerup.mp3',
//   damage: '/sounds/damage.mp3',
//   gameOver: '/sounds/gameover.mp3',
// } as const;

// export const useSound = () => {
//   const soundsRef = useRef<Map<string, HTMLAudioElement>>();

//   useEffect(() => {
//     // Create and preload all audio elements on mount
//     soundsRef.current = new Map(
//       Object.entries(SOUND_PATHS).map(([key, path]) => [
//         key,
//         preloadAudio(path)
//       ])
//     );

//     // Optional: Add a click handler to initialize audio context
//     const initAudio = () => {
//       soundsRef.current?.forEach(audio => {
//         audio.load();
//         // Play and immediately pause to initialize audio context
//         audio.play().then(() => audio.pause()).catch(() => {});
//       });
//       document.removeEventListener('click', initAudio);
//     };
//     document.addEventListener('click', initAudio);

//     return () => {
//       soundsRef.current?.forEach(audio => {
//         audio.pause();
//         audio.currentTime = 0;
//       });
//       document.removeEventListener('click', initAudio);
//     };
//   }, []);

//   const play = useCallback((soundName: keyof typeof SOUND_PATHS) => {
//     const sound = soundsRef.current?.get(soundName);
//     if (sound) {
//       // Create a new audio element for each play to allow overlapping sounds
//       const newSound = new Audio(sound.src);
//       newSound.play().catch(error => {
//         console.warn(`Failed to play sound: ${soundName}`, error);
//       });
//     }
//   }, []);

//   return { play };
// };




// import { useCallback, useRef } from 'react';
// import { SOUND_DATA } from '../constants/sounds';

// export const useSound = () => {
//   const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());

//   const play = useCallback((soundName: keyof typeof SOUND_DATA) => {
//     const soundData = SOUND_DATA[soundName];
    
//     // Try to get cached audio element
//     let audio = audioCache.current.get(soundName);
    
//     if (!audio) {
//       // Create and cache new audio element if not exists
//       audio = new Audio(soundData);
//       audioCache.current.set(soundName, audio);
//     }

//     // Reset and play
//     audio.currentTime = 0;
//     audio.play().catch(error => {
//       console.warn(`Failed to play sound: ${soundName}`, error);
//     });
//   }, []);

//   return { play };
// };



import { useCallback, useEffect, useRef } from 'react';
import { SOUND_PATHS } from '../constants/soundPaths';

export const useSound = () => {
  const audioMap = useRef(new Map<string, HTMLAudioElement>());

  // Initialize audio elements
  useEffect(() => {
    Object.entries(SOUND_PATHS).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.load(); // Preload the audio
      audioMap.current.set(key, audio);
    });

    // Cleanup
    return () => {
      audioMap.current.clear();
    };
  }, []);

  const play = useCallback((soundName: keyof typeof SOUND_PATHS) => {
    const audio = audioMap.current.get(soundName);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.warn(`Failed to play sound: ${soundName}`, error);
      });
    }
  }, []);

  return { play };
};