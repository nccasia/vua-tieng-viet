import React, { useState } from 'react';
import { useUserProfile } from '../../hooks';
import { ButtonExit, IconReward, WaitingModal } from '../../components';

const WaitingRoom = () => {
  // const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  console.log('testw', isOpen);

  const { userInfo } = useUserProfile();
  console.log(userInfo);

  // const handleCancelSearch = () => {
  //   navigate('/game');
  // };
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white ">
      {/* div Section */}
      <div className="container mx-auto  py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12  rounded-full bg-purple-600 flex items-center justify-center">
              <img
                src={userInfo?.avatar_url}
                alt=""
                className="h-12 w-12 rounded-full"
              />
            </div>
            <div className="flex gap">
              <div>
                <h2 className="text-xl font-bold">{userInfo?.display_name}</h2>
                <div className="flex items-center space-x-2">
                  <IconReward className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">1234</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ButtonExit
              endpointRoute="/game"
              classButton="hover:bg-orange-400 p-2 rounded-lg"
              classIcon="w-10"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-8 py-8">
        {/* Search Bar with Button */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm kiếm người chơi bằng Id..."
                className="w-full px-6 py-4 bg-slate-700/50 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
            <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center gap-2">
              Tìm kiếm
            </button>
          </div>
        </div>

        <div className="w-full mx-auto flex   gap-6">
          {/* Ranked Match Button */}
          <div
            onClick={handleOpenModal}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer shadow-lg w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Tìm Trận</h3>
              <IconReward className="h-8 w-8" />
            </div>
            <p className="text-gray-200 mb-6">
              Thi đấu trong các trận xếp hạng để leo lên bảng xếp hạng
            </p>
            <div className="flex items-center justify-end">
              {/* <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                Season 1 Active
              </span> */}
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Tìm Trận
              </button>
            </div>
          </div>
        </div>

        {/* Online Players Status */}
        {/* <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-slate-700/30 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">254 Players Online</span>
            </div>
            <span className="text-gray-400 text-sm">
              Average Wait Time: 1:30
            </span>
          </div>
        </div> */}
      </div>
      {isOpen && (
        <WaitingModal
          onClose={handleCloseModal}
          avatar={userInfo?.avatar_url ?? ''}
          username={userInfo?.display_name ?? ''}
        />
      )}
    </div>
  );
};
export default WaitingRoom;
