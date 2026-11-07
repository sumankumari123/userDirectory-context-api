import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

import type { ReactNode } from "react";

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  gender: string;
  phone: string;
}

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  getUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserTableProviderProps {
  children: ReactNode;
}

export const UserTableProvider = ({ children }: UserTableProviderProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://6aa35594e7ae868cdf7ad9e1.mockapi.io/crud"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: User[] = await response.json();

      setUsers(data);

    } catch (error) {
      console.error(error);
      setError("Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        getUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserTableProvider");
  }

  return context;
};