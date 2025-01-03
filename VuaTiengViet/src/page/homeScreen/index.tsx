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
                  <IconGame className="h-6 w-6 " />{' '}
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
          <div
            onClick={() => handleNavigate('/game')}
            className="relative rounded-2xl bg-lime-400 border-8 border-white shadow-lg hover:bg-orange-400 group/item w-[80%] lg:w-[60%] flex items-center "
          >
            <button className="w-full flex justify-center flex-1">
              <IconPlay className="h-[52px] w-[40px] " />
            </button>
            <p className=" absolute text-3xl  text-white top-[120px] left-[20%] invisible group-hover/item:visible">
              Chơi
            </p>
          </div>
          <div className="relative rounded-2xl bg-lime-400 border-8 border-white shadow-lg hover:bg-orange-400 group/item w-[80%] lg:w-[60%] flex items-center  ">
            <button
              // onClick={handleNavigate}
              className="w-full flex justify-center"
            >
              <IconReward className="h-[52px]" />
            </button>
            <p className=" absolute text-3xl  text-white top-[120px] left-[1%] invisible group-hover/item:visible">
              Thứ Hạng
            </p>
          </div>
          <div className="relative rounded-2xl bg-lime-400 border-8 border-white shadow-lg hover:bg-orange-400 group/item w-[80%] lg:w-[60%] flex items-center">
            <button
              // onClick={handleNavigate}
              className="w-full flex justify-center"
            >
              <IconMedal className="h-[52px]" />
            </button>
            <p className=" absolute text-3xl  text-white top-[120px] left-[10%] invisible group-hover/item:visible">
              Medal
            </p>
          </div>
          <div className="relative rounded-2xl bg-lime-400 border-8 border-white shadow-lg hover:bg-orange-400 group/item w-[80%] lg:w-[60%] flex items-center ">
            <button
              onClick={() => toggleSettings(true)}
              className="w-full flex justify-center"
            >
              <IconSetting className="h-[52px] w-[52px]" />
            </button>
            <p className=" absolute text-3xl  text-white top-[120px] left-[5%] invisible group-hover/item:visible">
              Cài Đặt
            </p>
          </div>
          <div className="relative rounded-2xl bg-lime-400 border-8 border-white shadow-lg hover:bg-orange-400 group/item w-[80%] lg:w-[60%] flex items-center ">
            <button
              onClick={() => handleNavigate('/user-profile')}
              className="w-full flex justify-center py-6"
            >
              <IconProfile className="h-[52px] w-10" />
            </button>
            <p className=" absolute text-3xl  text-white top-[120px] left-[5%] invisible group-hover/item:visible">
              Hồ Sơ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeScreen;
