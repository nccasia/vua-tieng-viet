import React, { createContext, useState, ReactNode } from 'react';
import WinnerModal from '../../components/WinnerModal';
import { useNavigate } from 'react-router-dom';

interface WinnerModalContextProps {
  isOpen: boolean;
  winner: string;
  status: 'draw' | 'win';
  openModal: (winner: string, status: 'draw' | 'win') => void;
  closeModal: () => void;
}

const WinnerModalContext = createContext<WinnerModalContextProps | undefined>(
  undefined
);
const WinnerModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [winner, setWinner] = useState('');
  const [status, setStatus] = useState<'draw' | 'win'>('win');
  const navigate = useNavigate();
  const openModal = (winner: string, status: 'draw' | 'win') => {
    setWinner(winner);
    setStatus(status);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    navigate('/wait');
  };

  return (
    <WinnerModalContext.Provider
      value={{ isOpen, winner, openModal, closeModal, status }}
    >
      {children}
      <WinnerModal />
    </WinnerModalContext.Provider>
  );
};
export { WinnerModalContext, WinnerModalProvider };
