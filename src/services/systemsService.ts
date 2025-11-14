import { apiClient } from './api';
import type { System, CreateSystemData, UpdateSystemData } from '@/types/api';

// Normaliza resposta extraindo envelope se necessário
function normalizeSystem(data: any): System {
  const system = data.data || data;
  return {
    id: system.id,
    name: system.name,
    description: system.description,
    code: system.code,
    isActive: system.isActive ?? true,
    createdAt: system.createdAt,
    updatedAt: system.updatedAt,
    modules: system.modules,
  };
}

export const systemsService = {
  async getAll(): Promise<System[]> {
    const response = await apiClient.get('/plans/systems/available');
    console.log('📦 GET /plans/systems/available response:', response.data);
    
    const data = response.data.data || response.data;
    const systems = Array.isArray(data) ? data : [];
    return systems.map(normalizeSystem);
  },

  async getById(id: string): Promise<System> {
    const response = await apiClient.get(`/plans/systems/${id}`);
    console.log(`📦 GET /plans/systems/${id} response:`, response.data);
    return normalizeSystem(response.data);
  },

  async create(data: CreateSystemData): Promise<System> {
    console.log('📤 [systemsService] POST /plans/systems Payload:', data);
    const response = await apiClient.post('/plans/systems', data);
    console.log('✅ [systemsService] POST /plans/systems response:', response.data);
    return normalizeSystem(response.data);
  },

  async update(id: string, data: UpdateSystemData): Promise<System> {
    console.log(`📤 [systemsService] PATCH /plans/systems/${id} Payload:`, data);
    try {
      const response = await apiClient.patch(`/plans/systems/${id}`, data);
      console.log(`✅ [systemsService] PATCH /plans/systems/${id} response:`, response.data);
      return normalizeSystem(response.data);
    } catch (error: any) {
      // Fallback para PUT se PATCH não suportado
      if (error.response?.status === 404 || error.response?.status === 405) {
        console.log('⚠️ PATCH não suportado, tentando PUT...');
        const response = await apiClient.put(`/plans/systems/${id}`, data);
        return normalizeSystem(response.data);
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/plans/systems/${id}`);
  },
};
