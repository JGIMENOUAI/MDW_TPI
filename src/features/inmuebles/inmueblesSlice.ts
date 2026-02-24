import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { inmuebleService } from "../../services/inmuebleService";
import type { Inmueble } from "../../types";

interface InmueblesState {
  inmuebles: Inmueble[];
  loading: boolean;
  error: string | null;
}

const initialState: InmueblesState = {
  inmuebles: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchInmuebles = createAsyncThunk(
  "inmuebles/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await inmuebleService.getAll();
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al cargar inmuebles",
      );
    }
  },
);

export const createInmueble = createAsyncThunk(
  "inmuebles/create",
  async (inmueble: Omit<Inmueble, "_id">, { rejectWithValue }) => {
    try {
      const data = await inmuebleService.create(inmueble);
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al crear inmueble",
      );
    }
  },
);

export const updateInmueble = createAsyncThunk(
  "inmuebles/update",
  async (
    { id, inmueble }: { id: string; inmueble: Partial<Inmueble> },
    { rejectWithValue },
  ) => {
    try {
      const data = await inmuebleService.update(id, inmueble);
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al actualizar inmueble",
      );
    }
  },
);

export const deleteInmueble = createAsyncThunk(
  "inmuebles/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await inmuebleService.delete(id);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al eliminar inmueble",
      );
    }
  },
);

const inmueblesSlice = createSlice({
  name: "inmuebles",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchInmuebles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInmuebles.fulfilled,
        (state, action: PayloadAction<Inmueble[]>) => {
          state.loading = false;
          state.inmuebles = action.payload;
        },
      )
      .addCase(fetchInmuebles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createInmueble.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createInmueble.fulfilled,
        (state, action: PayloadAction<Inmueble>) => {
          state.loading = false;
          state.inmuebles.push(action.payload);
        },
      )
      .addCase(createInmueble.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(
        updateInmueble.fulfilled,
        (state, action: PayloadAction<Inmueble>) => {
          const index = state.inmuebles.findIndex(
            (i) => i._id === action.payload._id,
          );
          if (index !== -1) {
            state.inmuebles[index] = action.payload;
          }
        },
      )
      .addCase(updateInmueble.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete
      .addCase(
        deleteInmueble.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.inmuebles = state.inmuebles.filter(
            (i) => i._id !== action.payload,
          );
        },
      )
      .addCase(deleteInmueble.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = inmueblesSlice.actions;
export default inmueblesSlice.reducer;
