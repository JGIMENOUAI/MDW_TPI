import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import type { User } from "../../services/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: authService.getUser(),
  token: authService.getToken(),
  isAuthenticated: !!authService.getToken(),
  loading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  "usuarios/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.login(email, password);

      // Mapear uid a id para consistencia
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

      return { user: userData, token: response.token };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al iniciar sesión",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "usuarios/register",
  async (
    {
      email,
      password,
      nombre,
    }: { email: string; password: string; nombre: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await authService.register({ email, password, nombre });

      const userData: User = {
        id: response.uid,
        uid: response.uid,
        email: response.email,
        nombre: response.nombre || nombre,
        rol: response.user?.rol,
      };

      authService.setToken(response.token);
      if (response.refreshToken) {
        authService.setRefreshToken(response.refreshToken);
      }
      authService.setUser(userData);
      authService.startAutoRefresh();

      return { user: userData, token: response.token };
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al registrar usuario",
      );
    }
  },
);

export const logoutUser = createAsyncThunk("usuarios/logout", async () => {
  authService.logout();
});

const authSlice = createSlice({
  name: "usuarios",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.error = null;
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
