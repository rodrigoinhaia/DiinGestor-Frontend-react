import { apiClient } from './api';

export interface Contract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  planId: string;
  planName: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  monthlyValue: number;
  totalValue: number;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  autoRenew: boolean;
  nextBilling: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractData {
  customerId: string;
  planId: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export interface UpdateContractData extends Partial<CreateContractData> {
  status?: 'active' | 'pending' | 'expired' | 'cancelled';
}

export const contractsService = {
  getAll: async (): Promise<Contract[]> => {
    const response = await apiClient.get('/contracts');
    return response.data as Contract[];
  },

  getById: async (id: string): Promise<Contract> => {
    const response = await apiClient.get(`/contracts/${id}`);
    return response.data as Contract;
  },

  create: async (data: CreateContractData): Promise<Contract> => {
    const response = await apiClient.post('/contracts', data);
    return response.data as Contract;
  },

  update: async (id: string, data: UpdateContractData): Promise<Contract> => {
    const response = await apiClient.put(`/contracts/${id}`, data);
    return response.data as Contract;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/contracts/${id}`);
  }
};