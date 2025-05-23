import { useAuth } from '@clerk/clerk-react';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BackgoundScreen } from '../assets';
import { IconExit } from '../components/Icons';


const ProtectedRoute: React.FC = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const handleNavigateLogin = () => {
    navigate('/login');
  };
  const handleNavigateBack = () => {
    navigate('/game');
  };
  const handleNavigate = () => {
    navigate('/');
  };

  if (!isSignedIn) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 flex flex-1 gap-20 items-center  lg:gap-40 flex-col"
        style={{
          backgroundImage: `url(${BackgoundScreen})`,
        }}
      >
        <div className="flex justify-start w-full">
          {' '}
          <button
            className="hover:bg-orange-400 p-4 rounded-lg"
            onClick={handleNavigate}
          >
            <IconExit />
          </button>{' '}
        </div>
        <div className="flex flex-col gap-10">
          <div className="text-white text-4xl px-10 ">
            You need to login to access this section
          </div>
          <div className="flex flex-row gap-4 justify-center text-white text-4xl">
            <button
              className="bg-blue-500 hover:bg-amber-500 py-2 px-4 rounded-lg"
              onClick={handleNavigateLogin}
            >
              Login
            </button>
            <button
              onClick={handleNavigateBack}
              className="bg-blue-500 hover:bg-amber-500 py-2 px-4 rounded-lg"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
