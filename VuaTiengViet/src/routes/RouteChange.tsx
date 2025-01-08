import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useGameSettings, useUserProfile } from '../hooks';
import BackgroundMusic from '../components/BackgroundMusic';
import SettingGame from '../components/SettingGame';
import { IUser } from '../types';

const RouteChange = () => {
  const location = useLocation();
  const { settings, toggleSettings } = useGameSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  const { setUser, setWallet } = useUserProfile();
  useEffect(() => {
    window.Mezon.WebView?.postEvent('PING', 'Ping', () => {
      console.log('Hello Mezon!');
    });

    window.Mezon.WebView?.onEvent<{ user: IUser; wallet: string }>(
      'CURRENT_USER_INFO',
      (_, userData) => {
        if (!userData || !userData.user) {
          return;
        }

        console.log('userData', userData.wallet);
        setUser(userData.user);
        const wallet = JSON.parse(userData.wallet);
        setWallet(wallet);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <BackgroundMusic volume={settings.volume / 10} autoPlay={true} />

      <SettingGame
        isOpen={settings.isSettingsOpen}
        onClose={() => toggleSettings(false)}
      />

      <Outlet />
    </div>
  );
};

export default RouteChange;
