import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { GameSettingsProvider } from './context/setting.tsx';
import { UserProvider } from './context/user/index.tsx';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameSettingsProvider>
      <UserProvider>
        <>
          <App />
          <ToastContainer />
        </>
      </UserProvider>
    </GameSettingsProvider>
  </StrictMode>
);
