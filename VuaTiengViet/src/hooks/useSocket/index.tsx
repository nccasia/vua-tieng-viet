import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GameEvents } from '../../constaints/gameSocket';
import { GameResult, GameState, Player } from '../../types';
import { useSoundEffects } from '../useSoundEffects';
import { useUserProfile } from '../useUserProfile';
import { useWinnerModal } from '../useWinnerModal';

export const useSocket = () => {
  const navigate = useNavigate();
  const { userInfo } = useUserProfile();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [opponent, setOpponent] = useState<Player | null>(null);

  const [gameState, setGameState] = useState<GameState>({
    gameId: null,
    currentWord: null,
    isPlaying: false,
    score: { player: 0, opponent: 0 },
    timeLeft: 180,
  });
  const { playSound } = useSoundEffects();
  const showWinner = useWinnerModal();
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_ENDPOINT);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      setIsConnected(true);

      // If there was a pending player, join them after connection
      if (currentPlayer) {
        socket.emit(GameEvents.PLAYER_JOIN, currentPlayer);
      }
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      if (reason === 'io client disconnect') {
        console.log(' disconnected manually.');
      } else {
        toast.error('Disconnected from server. Please try again.');
        navigate('/');
      }
    });
    socket.on(GameEvents.CORRECT_WORD, (gameResults: Array<GameResult>) => {
      if (!gameResults) {
        return;
      }
      const playerResult = Object.values(gameResults).find(
        (result) => result.playerId === currentPlayer?.id
      );

      const playerScore = playerResult?.correctWordIds?.length || 0;
      setCurrentPlayer((prev) => ({
        ...prev!,
        score: playerScore,
      }));
      const opponentResult = Object.values(gameResults).find(
        (result) => result.playerId === opponent?.id
      );
      const opponentScore = opponentResult?.correctWordIds?.length || 0;
      setOpponent((prev) => ({
        ...prev!,
        score: opponentScore,
      }));
    });

    socket.on(
      GameEvents.OPPONENT_FOUND,
      (data: { gameId: string; players: Player[] }) => {
        const otherPlayer = data.players.find(
          (p) => p.id !== currentPlayer?.id
        );
        if (otherPlayer) {
          setOpponent(otherPlayer);
          setGameState((prev) => ({ ...prev, gameId: data.gameId }));
        }
      }
    );

    socket.on(
      GameEvents.GAME_STARTED,
      (data: { gameId: string; wordId: string; wordLetters: string[] }) => {
        setGameState((prev) => ({
          ...prev,
          isPlaying: true,
          currentWord: { id: data.wordId, letters: data.wordLetters },
        }));
      }
    );

    socket.on(GameEvents.GAME_ERROR, (data: { message: string }) => {
      console.error('Game error:', data.message);
      toast.error(data.message);
      if (data.message === 'Player not found') {
        navigate('/');
      }
    });

    socket.on(
      GameEvents.WORD_SUBMIT_RESULT,
      (data: {
        wordId: string;
        isCorrect: boolean;
        letters: Array<{ char: string; isMatched: boolean }>;
      }) => {
        if (data.isCorrect) {
          playSound('correctAnswer');
          toast.success('You answered correctly, try the next one');
        } else {
          playSound('wrongAnswer');
          toast.error('It is not correct, try again');
        }
      }
    );

    socket.on(
      GameEvents.GAME_TIME_END,
      (data: { gameId: string; winner: Player | null; message: string }) => {
        toast.info(data.message);
        if (data.winner) {
          playSound(checkUser(data.winner?.id) ? 'winner' : 'lose');
        } else {
          playSound('draw');
        }
        showWinner(
          data.winner
            ? checkUser(data.winner?.id)
              ? 'You win'
              : 'You lose'
            : 'Draw match',
          data.winner ? (checkUser(data.winner?.id) ? 'win' : 'draw') : 'draw'
        );
        setOpponent(null);
        setGameState((prev) => ({ ...prev, isPlaying: false }));
      }
    );

    socket.on(
      GameEvents.GAME_FINISH,
      (data: { gameId: string; winner: Player; message: string }) => {
        console.log('game finish', data);
        showWinner(data.message, 'win');
        toast.success(data.message);
        setGameState((prev) => ({ ...prev, isPlaying: false }));
        setOpponent(null);
      }
    );

    socket.on(
      GameEvents.SET_NEXT_WORD,
      (data: { wordId: string; wordLetters: string[] }) => {
        setGameState((prev) => ({
          ...prev,
          currentWord: { id: data.wordId, letters: data.wordLetters },
        }));
      }
    );

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, currentPlayer]);
  const checkUser = (winnerId: string) => {
    return userInfo?.id === winnerId;
  };
  const joinGame = useCallback(
    (playerInfo: Player) => {
      setCurrentPlayer(playerInfo);
      if (socket && socket.connected) {
        socket.emit(GameEvents.PLAYER_JOIN, playerInfo);
      }
    },
    [socket]
  );

  const disconenctSocket = () => {
    if (socket && socket.connected) {
      socket.on('disconnect', () => {
        setIsConnected(false);
      });
    }
  };

  const findOpponent = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit(GameEvents.FIND_OPPONENT);
    }
  }, [socket]);

  const stopFindOpponent = useCallback(() => {
    if (socket && socket.connected) {
      socket.emit(GameEvents.STOP_FIND_OPPONENT);
    }
  }, [socket]);

  const startGame = (gameId: string) => {
    if (!socket) return;
    socket.emit(GameEvents.GAME_START, gameId);
  };
  const exitGame = (gameId: string) => {
    if (!socket) return;
    setOpponent(null);
    socket.emit(GameEvents.EXIT_GAME, gameId);
  };

  const submitWord = (gameId: string, wordId: string, letters: string[]) => {
    if (!socket) return;

    socket.emit(GameEvents.WORD_SUBMIT, { gameId, wordId, letters });
  };

  const confirmGameResult = (gameId: string) => {
    if (!socket) return;
    socket.emit(GameEvents.CONFIRM_GAME_RESULT, gameId);
  };

  return {
    socket,
    isConnected,
    currentPlayer,
    opponent,
    gameState,
    joinGame,
    findOpponent,
    stopFindOpponent,
    startGame,
    submitWord,
    exitGame,
    confirmGameResult,
    disconenctSocket,
  };
};
