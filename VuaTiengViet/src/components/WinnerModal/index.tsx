import { useContext } from 'react';

import { WinnerModalContext } from '../../context/winner';
import { IconCongratulation, IconInfo } from '../Icons';

const WinnerModal = () => {
  const context = useContext(WinnerModalContext);
  if (!context) return null;
  const { isOpen, winner, closeModal, status } = context;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={closeModal}
      />

      <div className="relative bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex justify-center mb-4">
          {status === 'win' ? <IconCongratulation /> : <IconInfo />}
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          {status === 'draw' ? 'Thông báo' : 'Chúc mừng!'}
        </h2>
        <p className="text-xl text-center mb-6">{winner}</p>

        <button
          onClick={closeModal}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};
export default WinnerModal;
