import { useContext } from 'react';
import { WinnerModalContext } from '../../context/winner';

export const useWinnerModal = () => {
  const context = useContext(WinnerModalContext);
  if (!context) {
    throw new Error('useWinnerModal must be used within WinnerModalProvider');
  }

  return (winner: string, status: 'draw' | 'win') =>
    context.openModal(winner, status);
};
