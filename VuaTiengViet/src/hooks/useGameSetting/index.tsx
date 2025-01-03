import { useContext } from 'react';
import { GameSettingsContext } from '../../context/setting';

export const useGameSettings = () => {
  const context = useContext(GameSettingsContext);
  if (context === undefined) {
    throw new Error(
      'useGameSettings must be used within a GameSettingsProvider'
    );
  }
  return context;
};
