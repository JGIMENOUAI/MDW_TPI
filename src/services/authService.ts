import axiosInstance from "./axiosConfig";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
}

export interface AuthResponse {
  mensaje: string;
  token: string;
  refreshToken: string;
  expiresIn: string;
  uid: string;
  email: string;
  nombre: string;
  user: User;
}

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";
const REFRESH_INTERVAL = 1 * 60 * 1000; // 1 minutos

let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/usuarios/login", { 
      email, 
      password 
    });
    
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/usuarios/register", data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get<User>("/usuarios/profile");
    return response.data;
  },

  // Refrescar token
  refreshToken: async (): Promise<string | null> => {
    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    try {
      const response = await axiosInstance.post<{ token: string }>("/usuarios/refresh", {
        refreshToken,
      });
      const newToken = response.data.token;
      sessionStorage.setItem(TOKEN_KEY, newToken);
      console.log("Token refrescado exitosamente");
      return newToken;
    } catch {
      authService.logout();
      return null;
    }
  },

  // Iniciar refresh automático cada 5 minutos
  startAutoRefresh: (): void => {
    if (refreshIntervalId) return; // Ya está corriendo
    
    refreshIntervalId = setInterval(async () => {
      const token = authService.getToken();
      if (token) {
        await authService.refreshToken();
      } else {
        authService.stopAutoRefresh();
      }
    }, REFRESH_INTERVAL);
    
    console.log("Auto refresh iniciado (cada 5 min)");
  },

  // Detener refresh automático
  stopAutoRefresh: (): void => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      refreshIntervalId = null;
      console.log("Auto refresh detenido");
    }
  },

  getToken: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  setRefreshToken: (refreshToken: string): void => {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  getUser: (): User | null => {
    const user = sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) as User : null;
  },

  setUser: (user: User): void => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logout: (): void => {
    authService.stopAutoRefresh(); // Detener refresh al cerrar sesión
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
