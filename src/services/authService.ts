import axiosInstance from "./axiosConfig";

interface LoginResponse {
  mensaje: string;
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  uid: string;
  email: string;
}

interface RegisterData {
  email: string;
  password: string;
  nombre: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<LoginResponse>(
      "/usuarios/login",
      { email, password },
    );
    return data;
  },

  register: async (userData: RegisterData): Promise<any> => {
    const { data } = await axiosInstance.post("/usuarios/create", userData);
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  getUser: (): any | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  setToken: (token: string) => {
    localStorage.setItem("token", token);
  },

  setUser: (user: any) => {
    localStorage.setItem("user", JSON.stringify(user));
  },
};
