import { apiClient } from './api';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  features: Array<{
    name: string;
    included: boolean;
  }>;
  isActive: boolean;
  contractsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanData {
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  features: Array<{
    name: string;
    included: boolean;
  }>;
}

export interface UpdatePlanData extends Partial<CreatePlanData> {
  isActive?: boolean;
}

export const plansService = {
  getAll: async (): Promise<Plan[]> => {
    const response = await apiClient.get('/plans');
    return response.data as Plan[];
  },

  getById: async (id: string): Promise<Plan> => {
    const response = await apiClient.get(`/plans/${id}`);
    return response.data as Plan;
  },

  create: async (data: CreatePlanData): Promise<Plan> => {
    const response = await apiClient.post('/plans', data);
    return response.data as Plan;
  },

  update: async (id: string, data: UpdatePlanData): Promise<Plan> => {
    const response = await apiClient.put(`/plans/${id}`, data);
    return response.data as Plan;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/plans/${id}`);
  }
};