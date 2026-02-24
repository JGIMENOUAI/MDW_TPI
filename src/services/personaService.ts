import type { Persona } from "../types";
import axiosInstance from "./axiosConfig";

export const personaService = {
  getAll: async (): Promise<Persona[]> => {
    const response = await axiosInstance.get("/personas");
    return response.data;
  },

  getById: async (id: string): Promise<Persona> => {
    const response = await axiosInstance.get(`/personas/${id}`);
    return response.data;
  },

  create: async (persona: Omit<Persona, "_id">): Promise<Persona> => {
    const response = await axiosInstance.post("/personas", persona);
    return response.data;
  },

  update: async (id: string, persona: Partial<Persona>): Promise<Persona> => {
    const response = await axiosInstance.put(`/personas/${id}`, persona);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/personas/${id}`);
  },

  desactivar: async (id: string): Promise<Persona> => {
    const response = await axiosInstance.patch(`/personas/${id}/desactivar`);
    return response.data;
  },
};
