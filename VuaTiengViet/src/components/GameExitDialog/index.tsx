import { useState } from 'react';
import { IconExit } from '../Icons';

interface Prop {
  onConfirmExit: () => void;
}
const GameExitDialog = ({ onConfirmExit }: Prop) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirmExit();
    setIsOpen(false);
  };
  const handleOpenModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <button
        className="p-2 hover:bg-white rounded-xl"
        onClick={handleOpenModal}
      >
        <IconExit className="w-8" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Exit Game?
              </h2>
              <p className="text-gray-600 mb-6">
                This will exit the game and you will lose your progress. Are you sure you want to exit?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameExitDialog;
