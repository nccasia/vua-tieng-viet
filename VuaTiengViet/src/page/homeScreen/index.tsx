import React from 'react';

import { BackgoundScreen } from '../../assets';

import {
  IconGame,
  IconMedal,
  IconPlay,
  IconProfile,
  IconReward,
  IconSetting,
  IconsSound,
} from '../../components/Icons';

import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useGameSettings, useUserProfile } from '../../hooks';
import HomeButton from '../../components/HomeButton';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { toggleSettings, toggleMusic, settings } = useGameSettings();

  const [isSoundOn, setIsSoundOn] = React.useState(settings.isMusicPlaying);

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
    toggleMusic();
  };
  const handleNavigate = (name: string) => {
    navigate(`${name}`);
  };

  const handleSignIn = () => {
    navigate('/login');
  };
  const { userInfo } = useUserProfile();

  return (
    <div
      className=" flex flex-col  min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 p-6 bg-cover bg-center bg-no-repeat "
      style={{
        backgroundImage: `url(${BackgoundScreen})`,
      }}
    >
      <div className="flex flex-row justify-between">
        <div className="flex  ">
          <button
            onClick={toggleSound}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all"
          >
            {isSoundOn ? (
              <IconsSound />
            ) : (
              <div className="relative">
                <IconsSound />
                <div className="absolute top-[-5px] left-[10px] right-0 border w-1 h-9 bg-red-600 transform rotate-45 "></div>
              </div>
            )}
          </button>
        </div>
        {!userInfo
          ? !isSignedIn && (
              <div className="flex flex-row gap-4 ">
                <button
                  onClick={handleSignIn}
                  className=" rounded-2xl bg-lime-400 border-8 border-white shadow-lg hover:bg-orange-400  items-center flex flex-row gap-4 p-3"
                >
                  <IconGame className="h-6 w-6 " />
                  <p className="text-white">Đăng Nhập</p>
                </button>
              </div>
            )
          : null}
      </div>
      <div className="flex flex-col flex-grow justify-around py-16">
        <div className="text-center  flex-1">
          <h1
            className="text-7xl sm:text-9xl font-extrabold text-white drop-shadow-lg animate-bounce"
            style={{
              WebkitTextStroke: '0.1px black',
              color: 'white',
            }}
          >
            Vua Tiếng Việt
          </h1>
        </div>

        <div className="grid grid-cols-5 sm:gap-6 gap-1 justify-items-center lg:px-40 ">
          <HomeButton
            IconComponent={IconPlay}
            classNameIcon="h-14 w-12"
            label="Chơi"
            onClick={() => handleNavigate('/game')}
          />
          <HomeButton
            classNameIcon="h-14"
            IconComponent={IconReward}
            label="Thứ Hạng"
          />
          <HomeButton
            classNameIcon="h-14 w-12"
            IconComponent={IconMedal}
            label="Medal"
          />
          <HomeButton
            IconComponent={IconSetting}
            label="Cài Đặt"
            classNameIcon="h-14"
            onClick={() => toggleSettings(true)}
          />
          <HomeButton
            IconComponent={IconProfile}
            classNameIcon="w-12 h-14"
            label="Hồ Sơ"
            onClick={() => handleNavigate('/user-profile')}
          />
        </div>

       
      </div>
      <div className="flex justify-end w-full">
        version 1.0.2
      </div>
    </div>
  );
};
export default HomeScreen;
