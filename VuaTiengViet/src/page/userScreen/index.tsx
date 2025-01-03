import { useClerk, useUser } from '@clerk/clerk-react';
import { IconExit } from '../../components/Icons';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../hooks';

const UserProfileScreen = () => {
  const { isSignedIn, user } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate('/');
  };
  const handleLogout = () => {
    clerk.signOut();
    navigate('/');
  };
  const { userInfo } = useUserProfile();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-600 flex flex-1 justify-center items-center  gap-6 lg:gap-16 flex-col">
        <div className="flex justify-start  w-full ">
          <button
            className="hover:bg-orange-400 p-4 rounded-lg"
            onClick={handleNavigate}
          >
            <IconExit />
          </button>{' '}
        </div>
        <div className="flex flex-grow ">
          {!userInfo ? (
            !isSignedIn ? (
              <>
                {' '}
                <div className="flex w-full justify-center text-6xl">
                  {' '}
                  Bạn chưa đăng nhập
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center text-white gap-4">
                  <img
                    src={user.imageUrl}
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full object-cover mb-4"
                  />

                  <div className="text-2xl font-semibold">{user.fullName}</div>
                  <div className="hover:bg-orange-400 w-full flex justify-center rounded-lg">
                    <button
                      onClick={handleLogout}
                      className="text-2xl font-semibold p-3 "
                    >
                      LogOut
                    </button>
                  </div>
                </div>
              </>
            )
          ) : (
            <>
              <div className="flex flex-col items-center text-white gap-4">
                <img
                  src={userInfo.avatar_url}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />

                <div className="text-2xl font-semibold">
                  {userInfo.display_name}
                </div>
                <div className="hover:bg-orange-400 w-full flex justify-center rounded-lg">
                  <button
                    onClick={handleLogout}
                    className="text-2xl font-semibold p-3 "
                  >
                    LogOut
                  </button>
                </div>
              </div>
            </>
          )}

          {/* {!isSignedIn ? (
            <>
              {' '}
              <div className="flex w-full justify-center text-6xl">
                {' '}
                Bạn chưa đăng nhập
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center text-white gap-4">
                <img
                  src={user.imageUrl}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />

                <div className="text-2xl font-semibold">
                  {user.firstName} {user.lastName}
                </div>
                <div className="hover:bg-orange-400 w-full flex justify-center rounded-lg">
                  <button
                    onClick={handleLogout}
                    className="text-2xl font-semibold p-3 "
                  >
                    LogOut
                  </button>
                </div>
              </div>
            </>
          )} */}
        </div>
      </div>
    </>
  );
};

export default UserProfileScreen;
