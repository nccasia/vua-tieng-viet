import { createContext, useState } from 'react';

interface IUser {
  id: string;
  display_name: string;

  avatar_url: string;
}
interface IUserType {
  userInfo: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}
const UserContext = createContext<IUserType | undefined>(undefined);
const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUser] = useState<IUser | undefined>(undefined);
  return (
    <UserContext.Provider value={{ userInfo, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
