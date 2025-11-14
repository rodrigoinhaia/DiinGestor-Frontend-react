import { apiClient } from './api';
import type { Module, CreateModuleData, UpdateModuleData } from '@/types/api';

// Normaliza resposta extraindo envelope se necessário
function normalizeModule(data: unknown): Module {
  const rawData = data as any;
  const module = rawData.data || rawData;
  return {
    id: module.id,
    name: module.name,
    description: module.description,
    code: module.code,
    systemId: module.systemId,
    system: module.system,
    costPrice: module.costPrice || 0,
    salePrice: module.salePrice || 0,
    isActive: module.isActive ?? true,
    createdAt: module.createdAt,
    updatedAt: module.updatedAt,
  };
}

export const modulesService = {
  async getAll(params?: { search?: string; isActive?: boolean; systemId?: string }): Promise<Module[]> {
    const response = await apiClient.get('/plans/modules/available', { params });
    console.log('📦 GET /plans/modules/available response:', response.data);
    
    const data = response.data.data || response.data;
    const modules = Array.isArray(data) ? data : [];
    return modules.map(normalizeModule);
  },

  async getBySystemId(systemId: string): Promise<Module[]> {
    const response = await apiClient.get(`/plans/systems/${systemId}/modules`);
    console.log(`📦 GET /plans/systems/${systemId}/modules response:`, response.data);
    
    const data = response.data.data || response.data;
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
      console.log(`✅ [modulesService] PATCH /plans/modules/${id} response:`, response.data);
      return normalizeModule(response.data);
    } catch (error: unknown) {
      // Fallback para PUT se PATCH não suportado
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 404 || err.response?.status === 405) {
        console.log('⚠️ PATCH não suportado, tentando PUT...');
        const response = await apiClient.put(`/plans/modules/${id}`, data);
        return normalizeModule(response.data);
      }
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/plans/modules/${id}`);
  },
};
