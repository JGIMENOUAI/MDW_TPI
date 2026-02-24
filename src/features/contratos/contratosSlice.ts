import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { contratoService } from "../../services/contratoService";
import type { Contrato } from "../../types";

interface ContratosState {
  contratos: Contrato[];
  loading: boolean;
  error: string | null;
}

const initialState: ContratosState = {
  contratos: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchContratos = createAsyncThunk(
  "contratos/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await contratoService.getAll();
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al cargar contratos",
      );
    }
  },
);

export const createContrato = createAsyncThunk(
  "contratos/create",
  async (contrato: Omit<Contrato, "_id">, { rejectWithValue }) => {
    try {
      const data = await contratoService.create(contrato);
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al crear contrato",
      );
    }
  },
);

export const updateContrato = createAsyncThunk(
  "contratos/update",
  async (
    { id, contrato }: { id: string; contrato: Partial<Contrato> },
    { rejectWithValue },
  ) => {
    try {
      const data = await contratoService.update(id, contrato);
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al actualizar contrato",
      );
    }
  },
);

export const deleteContrato = createAsyncThunk(
  "contratos/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await contratoService.delete(id);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al eliminar contrato",
      );
    }
  },
);

const contratosSlice = createSlice({
  name: "contratos",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchContratos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContratos.fulfilled,
        (state, action: PayloadAction<Contrato[]>) => {
          state.loading = false;
          state.contratos = action.payload;
        },
      )
      .addCase(fetchContratos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createContrato.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createContrato.fulfilled,
        (state, action: PayloadAction<Contrato>) => {
          state.loading = false;
          state.contratos.push(action.payload);
        },
      )
      .addCase(createContrato.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(
        updateContrato.fulfilled,
        (state, action: PayloadAction<Contrato>) => {
          const index = state.contratos.findIndex(
            (c) => c._id === action.payload._id,
          );
          if (index !== -1) {
            state.contratos[index] = action.payload;
          }
        },
      )
      .addCase(updateContrato.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete
      .addCase(
        deleteContrato.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.contratos = state.contratos.filter(
            (c) => c._id !== action.payload,
          );
        },
      )
      .addCase(deleteContrato.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = contratosSlice.actions;
export default contratosSlice.reducer;
