import { createBrowserRouter } from 'react-router-dom';
import {
  ErrorPage,
  GameOnlineScreen,
  GameScreen,
  HomeScreen,
  LoginPage,
  MenuScreen,
  PvpScreen,
  SignUpPage,
  UserProfileScreen,
} from '../page';

import RouteChange from './RouteChange';
import ProtectedRoute from './ProtectedRoute';

import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import WaitingRoom from '../page/waitingRoom';
import { SocketProvider } from '../context/socket';
import RankRouter from './RankRouter';
import { WinnerModalProvider } from '../context/winner';

export const routes = createBrowserRouter([
  {
    element: (
      <WinnerModalProvider>
        <RouteChange />
      </WinnerModalProvider>
    ),
    children: [
      {
        path: '/',
        element: <HomeScreen />,
      },
      {
        path: '/game',
        element: (
          <SocketProvider>
            <MenuScreen />
          </SocketProvider>
        ),
      },
      {
        path: `/pve`,
        element: <GameScreen />,
      },

      {
        path: '/user-profile',
        element: <UserProfileScreen />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/sign-up',
        element: <SignUpPage />,
      },
      { path: '/sso-callback', element: <AuthenticateWithRedirectCallback /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: '/online', element: <GameOnlineScreen /> }],
      },
      {
        element: (
          <SocketProvider>
            <RankRouter />
          </SocketProvider>
        ),
        children: [
          { path: '/wait', element: <WaitingRoom /> },
          {
            path: `/pvp`,
            element: <PvpScreen />,
          },
        ],
      },
    ],
    errorElement: <ErrorPage />,
  },
]);
