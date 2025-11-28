import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "patient" | "doctor";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: "patient" | "doctor") => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: "patient" | "doctor") => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: "1",
      name: role === "patient" ? "John Doe" : "Dr. Sarah Smith",
      email,
      role,
    };
    
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const register = async (userData: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: "1",
      name: userData.fullName,
      email: userData.email,
      role: "patient",
    };
    
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
