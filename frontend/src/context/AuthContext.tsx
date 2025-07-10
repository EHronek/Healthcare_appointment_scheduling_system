import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "@/api/apiServices";

interface User {
  id: number;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  phone?: string;
  date_joined?: string;
  is_active?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: "patient" | "doctor" | "admin"
  ) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: "patient" | "doctor" | "admin") => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const userProfile = await api.UserService.getMyProfile();
          setUser({
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            role: userProfile.role,
          });
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.AuthService.login(email, password);
      const userData = {
        id: response.user.id,
        name: response.user.name || "",
        email: response.user.email,
        role: response.user.role,
      };
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: "patient" | "doctor" | "admin"
  ): Promise<boolean> => {
    try {
      const newUser = await api.UserService.createUser({
        name,
        email,
        password,
        role,
      });

      // Automatically log in the new user
      const loginSuccess = await login(email, password);
      return loginSuccess;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  };

  const logout = () => {
    api.AuthService.logout();
    setUser(null);
  };

  const switchRole = (role: "patient" | "doctor" | "admin") => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, switchRole, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
