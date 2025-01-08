import React, { createContext, useState, useEffect } from 'react';

interface GameSettings {
  volume: number;
  sfxEnabled: boolean;
  isSettingsOpen: boolean;
  isMusicPlaying: boolean; 
}

interface GameSettingsContextType {
  settings: GameSettings;
  updateVolume: (volume: number) => void;
  updateSFX: (enabled: boolean) => void;
  toggleSettings: (isOpen: boolean) => void;
  toggleMusic: () => void; // Thêm hàm toggle nhạc
  saveSettings: () => void;
}

const defaultSettings: GameSettings = {
  volume: 5,
  sfxEnabled: true,
  isSettingsOpen: false,
  isMusicPlaying: false,
};

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(
  undefined
);

const GameSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<GameSettings>(() => {
    const savedVolume = localStorage.getItem('gameVolume');
    const savedSFX = localStorage.getItem('gameSFX');
    const savedMusicState = localStorage.getItem('isMusicPlaying');

    return {
      volume: savedVolume ? Number(savedVolume) : defaultSettings.volume,
      sfxEnabled: savedSFX ? savedSFX === 'true' : defaultSettings.sfxEnabled,
      isSettingsOpen: false,
      isMusicPlaying: savedMusicState
        ? savedMusicState === 'true'
        : defaultSettings.isMusicPlaying,
    };
  });

  const updateVolume = (volume: number) => {
    setSettings((prev) => ({ ...prev, volume }));
  };

  const updateSFX = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, sfxEnabled: enabled }));
  };

  const toggleSettings = (isOpen: boolean) => {
    setSettings((prev) => ({ ...prev, isSettingsOpen: isOpen }));
  };

  const toggleMusic = () => {
    setSettings((prev) => ({ ...prev, isMusicPlaying: !prev.isMusicPlaying }));
  };

  const saveSettings = () => {
    localStorage.setItem('gameVolume', settings.volume.toString());
    localStorage.setItem('gameSFX', settings.sfxEnabled.toString());
    localStorage.setItem('isMusicPlaying', settings.isMusicPlaying.toString());
  };

  useEffect(() => {
    saveSettings();
  }, [settings.volume, settings.sfxEnabled, settings.isMusicPlaying]);

  return (
    <GameSettingsContext.Provider
      value={{
        settings,
        updateVolume,
        updateSFX,
        toggleSettings,
        toggleMusic,
        saveSettings,
      }}
    >
      {children}
    </GameSettingsContext.Provider>
  );
};
export { GameSettingsContext, GameSettingsProvider };
