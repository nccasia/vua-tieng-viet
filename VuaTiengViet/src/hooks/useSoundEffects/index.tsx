import { useCallback } from 'react';
import { useGameSettings } from '../useGameSetting';

interface SoundEffects {
  clickCharacter: HTMLAudioElement;
  correctAnswer: HTMLAudioElement;
  wrongAnswer: HTMLAudioElement;
  removeCharacter: HTMLAudioElement;
  lose: HTMLAudioElement;
  winner: HTMLAudioElement;
  draw: HTMLAudioElement;
}

export const useSoundEffects = () => {
  const { settings } = useGameSettings();

  const sounds: SoundEffects = {
    clickCharacter: new Audio('/sfx/onClickSound.mp3'),
    correctAnswer: new Audio('/sfx/correctSound1.mp3'),
    wrongAnswer: new Audio('/sfx/wrongSound1.mp3'),
    removeCharacter: new Audio('/sfx/removeSound.mp3'),
    lose: new Audio('/sfx/loseSound1.mp3'),
    winner: new Audio('/sfx/winnerSound.mp3'),
    draw: new Audio('/sfx/drawSound.mp3'),
  };

  Object.values(sounds).forEach((sound) => {
    sound.volume = (settings.volume / 10) * (settings.sfxEnabled ? 1 : 0);
  });

  const playSound = useCallback(
    (sound: keyof SoundEffects) => {
      if (settings.sfxEnabled) {
        sounds[sound].currentTime = 0;
        sounds[sound].play().catch((error) => {
          console.log('Error playing sound:', error);
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [settings.sfxEnabled]
  );

  return { playSound };
};
