import { Avatar, BackgoundScreen } from '../../../assets';

import {
  ButtonCharacter,
  ButtonMenu,
  IconExit,
  MenuGame,
} from '../../../components';

import InputCharacters from '../../../components/InputCharacter';
import { useState } from 'react';
import { useGameLogic } from '../../../hooks';
import { useNavigate } from 'react-router-dom';

const GameScreen = () => {
  const navigate = useNavigate();
  const {
    gameData,
    listCharacters,
    inputCharacters,
    feedback,
    handleCharacterClick,
  } = useGameLogic();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleOpenMenu = () => setIsMenuOpen(true);
  const handleCloseMenu = () => setIsMenuOpen(false);
  const handleNavigateMenu = () => {
    navigate('/game');
  };
  return (
    <div
      className="flex flex-col min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 px-7 md:px-20 gap-6 lg:gap-16 relative"
      style={{
        backgroundImage: `url(${BackgoundScreen})`,
      }}
    >
      
      <div className="flex flex-col ">
        <div className="flex  items-center justify-center">
          <div className="flex w-full justify-start -ml-10  md:-ml-20 ">
            <button
              className="hover:bg-orange-400 p-4 rounded-lg"
              onClick={handleNavigateMenu}
            >
              <IconExit />
            </button>{' '}
          </div>
          <h1
            className="text-2xl sm:text-5xl font-bold mb-4 text-center text-white"
            style={{
              WebkitTextStroke: '0.9px black',
              color: 'white',
            }}
          >
            LEVEL
          </h1>
        </div>
        <div className="flex-1 flex flex-grow flex-col gap-10 lg:gap-20 items-center ">
          <div className="flex justify-center text-center    items-center px-6 py-14   lg:mx-20 border-[12px] rounded-3xl border-white md:min-w-[620px] md:max-w-[96%] max-w-[96%]">
            <p className="break-words text-3xl w-full sm:text-4xl lg:text-5xl font-bold tracking-widest font-sans">
              {gameData?.wordLetters.filter((item) => item !== ' ').join('/')}
            </p>
          </div>

          <div className="flex flex-col gap-5 lg:gap-10">
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
        <div
          className={`absolute bottom-0 flex justify-start w-32 h-32 lg:w-60 lg:h-60 lg:-ml-[66px] md:-ml-[66px] sm:-ml-[22px]  ml-[-22px] mb-2 ${
            inputCharacters.length > 15 ? 'lg:w-40 lg:h-40' : 'lg:w-32 lg:h-32 '
          }`}
        >
          <div
            className="w-full z-10 bg-center bg-cover bg-no-repeat rounded-bl-2xl rounded-tr-2xl rounded-br-[40px] rounded-tl-[40px]  border-4 border-white"
            style={{ backgroundImage: `url(${Avatar})` }}
          ></div>
          <div className="absolute top-[-80px] left-9">
            <div className="relative bg-lime-300 border-4 border-white rounded-3xl">
              <p className="text-white text-2xl text-nowrap p-4">{feedback}</p>
              <div className="absolute bottom-[-11px] left-12 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-lime-300 border-r-4 border-b-4 border-white"></div>
            </div>
          </div>
        </div>
      </div>

      <ButtonMenu onOpenMenu={handleOpenMenu} />

      <MenuGame isOpen={isMenuOpen} onClose={handleCloseMenu} />
    </div>
  );
};

export default GameScreen;
