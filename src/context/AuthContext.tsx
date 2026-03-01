import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";
import type { User } from "../services/authService";
import type { ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para obtener el usuario inicial
function getInitialUser(): User | null {
  const savedUser = authService.getUser();
  const token = authService.getToken();
  return savedUser && token ? savedUser : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [loading] = useState(false); // Ya no necesita cambiar

  // Solo para iniciar el auto-refresh
  useEffect(() => {
    if (user) {
      authService.startAutoRefresh();
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    const userData: User = {
      id: response.uid,
      uid: response.uid,
      email: response.email,
      nombre: response.nombre,
      rol: response.user?.rol,
    };

    authService.setToken(response.token);
    if (response.refreshToken) {
      authService.setRefreshToken(response.refreshToken);
    }
    authService.setUser(userData);
    authService.startAutoRefresh();
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
