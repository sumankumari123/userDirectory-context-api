import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: number;
}

interface UserContextType {
  createUser: (user: User) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (user: User): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://6aa35594e7ae868cdf7ad9e1.mockapi.io/crud",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const data = await response.json();

      console.log("User created:", data);

      return true;
    } catch (error) {
      console.error(error);

      setError("Something went wrong. Please try again.");

      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        createUser,
        loading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
};