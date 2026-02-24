import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { personaService } from "../../services/personaService";
import type { Persona } from "../../types";

interface PersonasState {
  personas: Persona[];
  loading: boolean;
  error: string | null;
}

const initialState: PersonasState = {
  personas: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchPersonas = createAsyncThunk(
  "personas/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await personaService.getAll();
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al cargar personas",
      );
    }
  },
);

export const createPersona = createAsyncThunk(
  "personas/create",
  async (persona: Omit<Persona, "_id">, { rejectWithValue }) => {
    try {
      const data = await personaService.create(persona);
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al crear persona",
      );
    }
  },
);

export const updatePersona = createAsyncThunk(
  "personas/update",
  async (
    { id, persona }: { id: string; persona: Partial<Persona> },
    { rejectWithValue },
  ) => {
    try {
      const data = await personaService.update(id, persona);
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al actualizar persona",
      );
    }
  },
);

export const deletePersona = createAsyncThunk(
  "personas/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await personaService.delete(id);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { mensaje?: string } } };
      return rejectWithValue(
        err.response?.data?.mensaje || "Error al eliminar persona",
      );
    }
  },
);

const personasSlice = createSlice({
  name: "personas",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPersonas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPersonas.fulfilled,
        (state, action: PayloadAction<Persona[]>) => {
          state.loading = false;
          state.personas = action.payload;
        },
      )
      .addCase(fetchPersonas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createPersona.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createPersona.fulfilled,
        (state, action: PayloadAction<Persona>) => {
          state.loading = false;
          state.personas.push(action.payload);
        },
      )
      .addCase(createPersona.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(
        updatePersona.fulfilled,
        (state, action: PayloadAction<Persona>) => {
          const index = state.personas.findIndex(
            (p) => p._id === action.payload._id,
          );
          if (index !== -1) {
            state.personas[index] = action.payload;
          }
        },
      )
      .addCase(updatePersona.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete
      .addCase(
        deletePersona.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.personas = state.personas.filter(
            (p) => p._id !== action.payload,
          );
        },
      )
      .addCase(deletePersona.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = personasSlice.actions;
export default personasSlice.reducer;
