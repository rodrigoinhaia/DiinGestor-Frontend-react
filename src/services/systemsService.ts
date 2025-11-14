import { apiClient } from './api';
import type { System, CreateSystemData, UpdateSystemData } from '@/types/api';

// Normaliza resposta extraindo envelope se necessário
function normalizeSystem(data: unknown): System {
  const rawData = data as { data?: unknown };
  const system = rawData.data || data;
  const sys = system as Record<string, unknown>;
  return {
    id: sys.id as string,
    name: sys.name as string,
    description: sys.description as string | undefined,
    code: sys.code as string | undefined,
    isActive: (sys.isActive as boolean) ?? true,
    createdAt: sys.createdAt as string,
    updatedAt: sys.updatedAt as string,
    modules: sys.modules as System['modules'],
  };
}

export const systemsService = {
  async getAll(): Promise<System[]> {
    const response = await apiClient.get('/plans/systems/available');
    console.log('📦 GET /plans/systems/available response:', response.data);
    
    const rawData = response.data as { data?: unknown };
    const data = rawData.data || response.data;
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
    } catch (error: unknown) {
      // Fallback para PUT se PATCH não suportado
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 404 || err.response?.status === 405) {
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
