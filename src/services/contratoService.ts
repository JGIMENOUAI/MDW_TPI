import type { Contrato } from '../types';
import axiosInstance from './axiosConfig';

export const contratoService = {
  getAll: async (): Promise<Contrato[]> => {
    const response = await axiosInstance.get('/contratos');
    return response.data;
  },

  getById: async (id: string): Promise<Contrato> => {
    const response = await axiosInstance.get(`/contratos/${id}`);
    return response.data;
  },

  create: async (contrato: Omit<Contrato, '_id'>): Promise<Contrato> => {
    const response = await axiosInstance.post('/contratos', contrato);
    return response.data;
  },

  update: async (id: string, contrato: Partial<Contrato>): Promise<Contrato> => {
    const response = await axiosInstance.put(`/contratos/${id}`, contrato);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/contratos/${id}`);
  },
};
