import { createContext, useState } from 'react';
import { IUser, IWallet } from '../../types';

interface IUserType {
  userInfo: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  wallet: IWallet | undefined;
  setWallet: React.Dispatch<React.SetStateAction<IWallet | undefined>>;
}
const UserContext = createContext<IUserType | undefined>(undefined);
const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUser] = useState<IUser | undefined>(undefined);
  const [wallet, setWallet] = useState<IWallet | undefined>(undefined);
  return (
    <UserContext.Provider value={{ userInfo, setUser, wallet, setWallet }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
