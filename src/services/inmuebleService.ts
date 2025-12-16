import type { Inmueble } from '../types';
import axiosInstance from './axiosConfig';

export const inmuebleService = {
  getAll: async (): Promise<Inmueble[]> => {
    const response = await axiosInstance.get('/inmuebles');
    return response.data;
  },

  getById: async (id: string): Promise<Inmueble> => {
    const response = await axiosInstance.get(`/inmuebles/${id}`);
    return response.data;
  },

  create: async (inmueble: Omit<Inmueble, '_id'>): Promise<Inmueble> => {
    const response = await axiosInstance.post('/inmuebles', inmueble);
    return response.data;
  },

  update: async (id: string, inmueble: Partial<Inmueble>): Promise<Inmueble> => {
    const response = await axiosInstance.put(`/inmuebles/${id}`, inmueble);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/inmuebles/${id}`);
  },
};
