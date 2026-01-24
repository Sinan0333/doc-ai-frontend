import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authService, RegisterData, LoginData, User } from "@/services/auth.service";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: "patient" | "doctor" | "admin") => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateUser: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string, role: "patient" | "doctor" | "admin") => {
    try {
      const loginData: LoginData = { email, password };
      let response;
      if (role === "patient") {
        response = await authService.loginPatient(loginData);
      } else if (role === "doctor") {
        response = await authService.loginDoctor(loginData);
      } else {
        response = await authService.loginAdmin(loginData);
      }
      
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
    } catch (error: any) {
      // Error is handled by axios interceptor
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const registerData: RegisterData = {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        age: userData.age ? parseInt(userData.age) : undefined,
        gender: userData.gender,
        phone: userData.phone,
        address: userData.address,
      };
      
      const response = await authService.register(registerData);
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
    } catch (error: any) {
      // Error is handled by axios interceptor
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        updateUser,
        logout,
        isAuthenticated: !!user,
        isLoading,
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
