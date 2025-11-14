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
    console.log('📦 GET /plans response:', response.data);
    
    // Extrai envelope se necessário
    const data = response.data.data || response.data;
    const plans = Array.isArray(data) ? data : [];
    return plans;
  },

  getById: async (id: string): Promise<Plan> => {
    const response = await apiClient.get(`/plans/${id}`);
    console.log(`📦 GET /plans/${id} response:`, response.data);
    
    // Extrai envelope se necessário
    return response.data.data || response.data;
  },

  create: async (data: CreatePlanData): Promise<Plan> => {
    console.log('📤 [plansService] POST /plans Payload:', data);
    const response = await apiClient.post('/plans', data);
    console.log('✅ [plansService] POST /plans response:', response.data);
    
    return response.data.data || response.data;
  },

  update: async (id: string, data: UpdatePlanData): Promise<Plan> => {
    console.log(`📤 [plansService] PUT /plans/${id} Payload:`, data);
    const response = await apiClient.put(`/plans/${id}`, data);
    console.log(`✅ [plansService] PUT /plans/${id} response:`, response.data);
    
    return response.data.data || response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/plans/${id}`);
  }
};