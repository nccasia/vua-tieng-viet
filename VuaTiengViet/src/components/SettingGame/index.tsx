import { useGameSettings } from "../../hooks";


interface IMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingGame = ({ isOpen, onClose }: IMenuProps) => {
  const { settings, updateVolume, updateSFX, saveSettings } = useGameSettings();

  if (!isOpen) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateVolume(Number(e.target.value));
  };

  const handleSFXToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSFX(e.target.checked);
  };

  const handleSave = () => {
    saveSettings();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 flex-col">
      <div className="bg-cyan-400 p-10 rounded-3xl shadow-lg w-[40%] flex relative border-[12px] border-white">
        <div className="absolute -top-6 -right-7 border-8 border-white rounded-full bg-red-500">
          <button onClick={onClose} className="text-white px-2">
            X
          </button>
        </div>
        <div className="flex flex-col w-full gap-5 text-white">
          <div className="w-full flex justify-center items-center bg-green-500 hover:bg-orange-400 p-4 rounded-xl gap-10">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Volume
            </label>
            <input
              id="minmax-range"
              type="range"
              min="0"
              max="10"
              value={settings.volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
          <div className="w-full flex justify-between items-center bg-green-500 hover:bg-orange-400 p-4 rounded-xl">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              SFX
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.sfxEnabled}
                onChange={handleSFXToggle}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div
            className="w-full flex justify-center items-center bg-green-500 hover:bg-orange-400 p-4 rounded-xl"
            onClick={handleSave}
          >
            <button>SAVE</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingGame;
