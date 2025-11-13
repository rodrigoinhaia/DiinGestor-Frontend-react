import { apiClient } from './api';

export interface Tenant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const tenantsService = {
  // Buscar tenant por ID
  getById: async (id: string): Promise<Tenant> => {
    const response = await apiClient.get(`/tenants/${id}`);
    return response.data as Tenant;
  },

  // Buscar todos os tenants (se houver permissão)
  getAll: async (): Promise<Tenant[]> => {
    const response = await apiClient.get('/tenants');
    return response.data as Tenant[];
  },

  // Cache simples em memória para evitar múltiplas requisições
  _cache: new Map<string, { data: Tenant; timestamp: number }>(),
  
  // Buscar com cache (5 minutos de validade)
  getByIdCached: async (id: string): Promise<Tenant> => {
    const cached = tenantsService._cache.get(id);
    const now = Date.now();
    
    if (cached && now - cached.timestamp < 5 * 60 * 1000) {
      return cached.data;
    }
    
    try {
      const tenant = await tenantsService.getById(id);
      tenantsService._cache.set(id, { data: tenant, timestamp: now });
      return tenant;
    } catch {
      // Se falhar, retornar objeto com ID
      return {
        id,
        name: `Parceiro ${id.substring(0, 8)}...`,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      };
    }
  }
};
