import React, { useEffect, useState } from 'react';
import { useSocketContext } from '../../hooks/useSocketContext';
import { useNavigate } from 'react-router-dom';

interface Prop {
  onClose: () => void;
  avatar: string;
  username: string;
}
const WaitingModal = ({ onClose, avatar, username }: Prop) => {
  const [time, setTime] = useState<number>(0);
  const navigate = useNavigate();
  const { findOpponent, stopFindOpponent, opponent, startGame, gameState } =
    useSocketContext();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    findOpponent();

    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      stopFindOpponent();
      setTime(0);
    };
 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this runs once when component mounts

  const handleCancel = () => {
    stopFindOpponent();
    onClose();
  };

  useEffect(() => {
    if (opponent) {
      startGame(gameState.gameId ?? '');
      navigate('/pvp');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponent]);
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 z-50 fixed inset-0 bg-opacity-50">
      <div className="max-w-lg w-full bg-slate-800 rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Tìm Trận
          </h1>
          <p className="text-slate-400"> Số người đang chơi</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-700/50 rounded-lg p-4 mb-6">
          <img
            src={avatar}
            alt="Player avatar"
            className="w-12 h-12 rounded-lg"
          />
          <div>
            <div className="font-medium text-white">{username || 'Player'}</div>
            <div className="text-sm text-slate-400">Rating: 1000</div>
          </div>
        </div>

        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center"></div>
          <div className="text-slate-300">Tìm kiếm trận đấu...</div>
          <div className="text-sm text-slate-400">
            Đếm xuôi: {formatTime(time)}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleCancel}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Hủy Bỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingModal;
