import { createContext, ReactNode } from 'react';
import { useSocket } from '../hooks';
import { Socket } from 'socket.io-client';
import { GameState, Player } from '../types';

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  currentPlayer: Player | null;
  opponent: Player | null;
  gameState: GameState;
  joinGame: (playerInfo: Player) => void;
  findOpponent: () => void;
  disconenctSocket: () => void;
  stopFindOpponent: () => void;
  startGame: (gameId: string) => void;
  exitGame: (gameId: string) => void;
  submitWord: (gameId: string, wordId: string, letters: string[]) => void;
  confirmGameResult: (gameId: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const context = useSocket();

  return (
    <SocketContext.Provider value={context}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
