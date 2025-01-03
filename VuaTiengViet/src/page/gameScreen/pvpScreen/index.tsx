import InputCharacters from '../../../components/InputCharacter';
import {
  ButtonCharacter,
  ButtonMenu,
  GameExitDialog,
  MenuGame,
  TimeRound,
} from '../../../components';
import { useUserProfile } from '../../../hooks';
import { useSocketContext } from '../../../hooks/useSocketContext';

import useGamePvpLogic from '../../../hooks/useGamePvpLogic';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const PvpScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useUserProfile();
  const { gameState, currentPlayer, opponent, exitGame } = useSocketContext();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { listCharacters, inputCharacters, handleCharacterClick } =
    useGamePvpLogic();
  const handleConfirmExit = () => {
    exitGame(gameState.gameId ?? '');
    navigate('/game');
  };


  const handleOpenMenu = () => setIsMenuOpen(true);
  const handleCloseMenu = () => setIsMenuOpen(false);
  return (
    <div className="min-h-screen bg-slate-900 text-white px-16 py-6">
      <div className=" mx-auto mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent  bg-gradient-to-r from-purple-400 to-pink-400">
            Trận Đấu
          </h1>
          <div className="flex items-center gap-2 text-slate-400">
            <GameExitDialog onConfirmExit={handleConfirmExit} />
          </div>
        </div>
      </div>

      <div className=" mx-auto grid grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex gap-4">
          <div className="flex items-center ">
            <img
              src={userInfo?.avatar_url}
              alt=""
              className="h-16 w-16 rounded-lg"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">
                {currentPlayer?.playerName}
              </span>
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {gameState.score?.player}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400">Thời Gian</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400">
            <TimeRound time={gameState.timeLeft ?? 180} />
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400">{opponent?.playerName}</span>
          </div>
          <div className="text-3xl font-bold text-pink-400">
            {gameState.score?.opponent}
          </div>
        </div>
      </div>

      <div className=" mx-auto">
        <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700 flex flex-col text-center">
          <div className="text-left mb-6">
            <span className="text-sm font-medium text-slate-400 bg-slate-700 px-3 py-1 rounded-full">
              Câu hỏi hiện tại
            </span>
          </div>
          <div className="break-words text-3xl  sm:text-4xl lg:text-5xl font-bold tracking-widest font-sans">
            {gameState?.currentWord?.letters
              .filter((item) => item !== ' ')
              .join('/')}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex flex-col gap-5 lg:gap-10">
            <InputCharacters
              inputCharacters={inputCharacters}
              handleCharacterClick={handleCharacterClick}
            />
            <ButtonCharacter
              listCharacters={listCharacters}
              handleCharacterClick={handleCharacterClick}
            />
          </div>
        </div>
      </div>

      <ButtonMenu onOpenMenu={handleOpenMenu} />

      <MenuGame isOpen={isMenuOpen} onClose={handleCloseMenu} />
    </div>
  );
};

export default PvpScreen;
