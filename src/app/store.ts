import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import contratosReducer from "../features/contratos/contratosSlice";
import personasReducer from "../features/personas/personasSlice";
import inmueblesReducer from "../features/inmuebles/inmueblesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contratos: contratosReducer,
    personas: personasReducer,
    inmuebles: inmueblesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
