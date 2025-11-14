import { apiClient } from './api';
import type { Module, CreateModuleData, UpdateModuleData } from '@/types/api';

// Normaliza resposta extraindo envelope se necessário
function normalizeModule(data: unknown): Module {
  const rawData = data as { data?: unknown };
  const module = rawData.data || rawData;
  const mod = module as Record<string, unknown>;
  return {
    id: mod.id as string,
    name: mod.name as string,
    description: mod.description as string | undefined,
    code: mod.code as string | undefined,
    systemId: mod.systemId as string,
    system: mod.system as Module['system'],
    costPrice: (mod.costPrice as number) || 0,
    salePrice: (mod.salePrice as number) || 0,
    isActive: (mod.isActive as boolean) ?? true,
    createdAt: mod.createdAt as string,
    updatedAt: mod.updatedAt as string,
  };
}

export const modulesService = {
  async getAll(params?: { search?: string; isActive?: boolean; systemId?: string }): Promise<Module[]> {
    const response = await apiClient.get('/plans/modules/available', { params });
    console.log('📦 GET /plans/modules/available response:', response.data);
    
    const rawData = response.data as { data?: unknown };
    const data = rawData.data || response.data;
    const modules = Array.isArray(data) ? data : [];
    return modules.map(normalizeModule);
  },

  async getBySystemId(systemId: string): Promise<Module[]> {
    const response = await apiClient.get(`/plans/systems/${systemId}/modules`);
    console.log(`📦 GET /plans/systems/${systemId}/modules response:`, response.data);
    
    const rawData = response.data as { data?: unknown };
    const data = rawData.data || response.data;
    const modules = Array.isArray(data) ? data : [];
    return modules.map(normalizeModule);
  },

  async getById(id: string): Promise<Module> {
    const response = await apiClient.get(`/plans/modules/${id}`);
    console.log(`📦 GET /plans/modules/${id} response:`, response.data);
    return normalizeModule(response.data);
  },

  async create(data: CreateModuleData): Promise<Module> {
    console.log('📤 [modulesService] POST /plans/modules Payload:', data);
    const response = await apiClient.post('/plans/modules', data);
    console.log('✅ [modulesService] POST /plans/modules response:', response.data);
    return normalizeModule(response.data);
  },

  async update(id: string, data: UpdateModuleData): Promise<Module> {
    console.log(`📤 [modulesService] PATCH /plans/modules/${id} Payload:`, data);
    try {
      const response = await apiClient.patch(`/plans/modules/${id}`, data);
      console.log(`✅ [modulesService] PATCH /plans/modules/${id} response:`, response);
      console.log(`📦 [modulesService] response.data:`, response.data);
      const normalized = normalizeModule(response.data);
      console.log(`🔄 [modulesService] normalized:`, normalized);
      return normalized;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: unknown } };
      console.error(`❌ [modulesService] PATCH error:`, err.response?.status, err.response?.data);
      
      // Fallback para PUT se PATCH não suportado
      if (err.response?.status === 404 || err.response?.status === 405) {
        console.log('⚠️ PATCH não suportado, tentando PUT...');
        const response = await apiClient.put(`/plans/modules/${id}`, data);
        console.log(`✅ [modulesService] PUT response:`, response.data);
        return normalizeModule(response.data);
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/plans/modules/${id}`);
  },
};
