import { apiClient } from './api';
import type { Plan, CreatePlanData, UpdatePlanData } from '@/types/api';

export type { Plan, CreatePlanData, UpdatePlanData };

function normalizePlan(data: unknown): Plan {
  const raw = data as Record<string, unknown>;
  
  return {
    id: raw.id as string,
    name: raw.name as string,
    description: raw.description as string | undefined,
    billingCycle: raw.billingCycle as 'monthly' | 'quarterly' | 'annual',
    baseCost: Number(raw.baseCost) || 0,
    basePrice: Number(raw.basePrice) || 0,
    finalPrice: Number(raw.finalPrice) || 0,
    profit: Number(raw.profit) || 0,
    profitMargin: Number(raw.profitMargin) || 0,
    configuration: raw.configuration as Plan['configuration'],
    modules: (raw.modules || []) as Plan['modules'],
    isActive: Boolean(raw.isActive),
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export const plansService = {
  getAll: async (): Promise<Plan[]> => {
    const response = await apiClient.get<{ data?: unknown } | unknown>('/plans');
    console.log('📦 GET /plans response:', response.data);
    
    const rawData = (response.data as { data?: unknown })?.data || response.data;
    const data = Array.isArray(rawData) ? rawData : [];
    return data.map(normalizePlan);
  },

  getById: async (id: string): Promise<Plan> => {
    const response = await apiClient.get<{ data?: unknown } | unknown>(`/plans/${id}`);
    console.log(`📦 GET /plans/${id} response:`, response.data);
    
    const data = (response.data as { data?: unknown })?.data || response.data;
    return normalizePlan(data);
  },

  create: async (data: CreatePlanData): Promise<Plan> => {
    console.log('📤 [plansService] POST /plans Payload:', data);
    const response = await apiClient.post<{ data?: unknown } | unknown>('/plans', data);
    console.log('✅ [plansService] POST /plans response:', response.data);
    
    const result = (response.data as { data?: unknown })?.data || response.data;
    return normalizePlan(result);
  },

  update: async (id: string, data: UpdatePlanData): Promise<Plan> => {
    console.log(`📤 [plansService] PATCH /plans/${id} Payload:`, data);
    
    try {
      const response = await apiClient.patch<{ data?: unknown } | unknown>(`/plans/${id}`, data);
      console.log(`✅ [plansService] PATCH /plans/${id} response:`, response.data);
      
      const result = (response.data as { data?: unknown })?.data || response.data;
      return normalizePlan(result);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        console.log('⚠️ PATCH não suportado, tentando PUT...');
        const response = await apiClient.put<{ data?: unknown } | unknown>(`/plans/${id}`, data);
        const result = (response.data as { data?: unknown })?.data || response.data;
        return normalizePlan(result);
      }
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/plans/${id}`);
  }
};