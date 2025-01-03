import { useNavigate } from 'react-router-dom';
import { useGameSettings } from '../../hooks';

interface IMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuGame = ({ isOpen, onClose }: IMenuProps) => {
  const { toggleSettings } = useGameSettings();

  const navigate = useNavigate();
  if (!isOpen) return null;
  const handleNavigate = () => {
    navigate('/game');
  };
  const handleOpenSetting = () => {
    toggleSettings(true);
    
  };
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-10 flex-col">
      <div className="bg-cyan-400 p-10 rounded-3xl shadow-lg w-80 flex relative border-[12px] border-white">
        <div className="absolute -bottom-2 left-[50%] transform translate-x-[-50%] translate-y-[50%] border-8 border-white rounded-full bg-red-500">
          <button onClick={onClose} className="  text-white px-2 ">
            X
          </button>
        </div>
        <div className="flex flex-col w-full gap-5 text-white">
          <div className="w-full flex justify-center items-center bg-green-500 hover:bg-orange-400 p-4 rounded-xl ">
            <button>RESUME</button>
          </div>
          <div
            className="w-full flex justify-center items-center bg-green-500 hover:bg-orange-400 p-4 rounded-xl"
            onClick={handleNavigate}
          >
            <button>SAVE</button>
          </div>
          <div
            className="w-full flex justify-center items-center bg-green-500 hover:bg-orange-400 p-4 rounded-xl"
            onClick={handleOpenSetting}
          >
            <button>SETTING</button>
          </div>
          <div
            className="w-full flex justify-center items-center bg-green-500 hover:bg-orange-400 p-4 rounded-xl"
            onClick={handleNavigate}
          >
            <button>QUIT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuGame;
