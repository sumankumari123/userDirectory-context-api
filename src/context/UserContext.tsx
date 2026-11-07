
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
  phone: string;
  gender: string;
  age?: number;
}

// User Form Data
export type UserInput = Omit<User, "id">;

// Context Interface
interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;

  getUsers: () => Promise<void>;
  createUser: (user: UserInput) => Promise<boolean>;
  updateUser: (id: string, user: UserInput) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    "https://6aa35594e7ae868cdf7ad9e1.mockapi.io/crud";


  // GET ALL USERS
  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: User[] = await response.json();

      setUsers(data);

    } catch (error) {
      console.error(error);
      setError("Unable to fetch users.");
    } finally {
      setLoading(false);
    }
  }, []);


  // CREATE USER - POST
  const createUser = async (user: UserInput): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data: User = await response.json();

      setUsers((previousUsers) => [
        ...previousUsers,
        data,
      ]);

      return true;

    } catch (error) {
      console.error(error);
      setError("Failed to create user.");
      return false;
    } finally {
      setLoading(false);
    }
  };


  // UPDATE USER - PUT
  const updateUser = async (
    id: string,
    user: UserInput
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser: User = await response.json();

      // Update user in Context state
      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item.id === id ? updatedUser : item
        )
      );

      return true;

    } catch (error) {
      console.error(error);
      setError("Failed to update user.");
      return false;
    } finally {
      setLoading(false);
    }
  };


  // DELETE USER - DELETE
  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove deleted user from Context state
      setUsers((previousUsers) =>
        previousUsers.filter((user) => user.id !== id)
      );

      return true;

    } catch (error) {
      console.error(error);
      setError("Failed to delete user.");
      return false;
    } finally {
      setLoading(false);
    }
  };


  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        getUsers,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


// Custom Hook
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
};
