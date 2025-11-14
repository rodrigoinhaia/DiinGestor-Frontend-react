import { apiClient } from './api';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerData {
  name: string;
  email: string;
  phone: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isActive?: boolean; // incluir flag de ativo no create
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {
  isActive?: boolean;
}

// Backend retorna endereço "flat" (city, state, etc no nível raiz)
// Frontend espera nested (address.city, address.state)
// Normalizar resposta do backend para formato do frontend
// Backend usa: address (string), addressNumber, city, state, zipCode, neighborhood, complement
// Frontend usa: address { street, number, city, state, zipCode, neighborhood, complement }
function normalizeCustomer(backendData: any): Customer {
  const normalized = {
    id: backendData.id,
    name: backendData.name,
    email: backendData.email,
    phone: backendData.phone,
    document: backendData.document,
    address: {
      street: backendData.address || '', // Backend usa 'address' (string) para rua
      number: backendData.addressNumber || '',
      complement: backendData.complement || '',
      neighborhood: backendData.neighborhood || '',
      city: backendData.city || '',
      state: backendData.state || '',
      zipCode: backendData.zipCode || '',
    },
    isActive: backendData.isActive ?? true,
    createdAt: backendData.createdAt,
    updatedAt: backendData.updatedAt,
  };
  
  return normalized;
}

// Converter formato frontend (nested) para backend (flat)
// Frontend usa: address { street, number, ... }
// Backend usa: address (string para rua), addressNumber, city, state, zipCode, neighborhood, complement
function denormalizeCustomer(data: CreateCustomerData | UpdateCustomerData): any {
  const payload: any = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    document: data.document,
    isActive: data.isActive,
  };

  // Mapear address nested para campos flat do backend
  if (data.address) {
    payload.address = data.address.street; // Backend usa 'address' (string) para rua
    payload.addressNumber = data.address.number;
    payload.complement = data.address.complement || '';
    payload.neighborhood = data.address.neighborhood;
    payload.city = data.address.city;
    payload.state = data.address.state;
    payload.zipCode = data.address.zipCode;
  }

  return payload;
}

export const customersService = {
  // Buscar todos os clientes
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get<{ data?: any[] } | any[]>('/customers');
    console.log('📦 GET /customers response:', response.data);
    // Backend retorna { success: true, data: [...], meta: {...} }
    let customers: any[] = [];
    const responseData = response.data as any;
    if (responseData?.data && Array.isArray(responseData.data)) {
      customers = responseData.data;
    } else if (Array.isArray(responseData)) {
      customers = responseData;
    }
    // Normalizar cada cliente (backend retorna endereço flat)
    return customers.map(normalizeCustomer);
  },

  // Buscar cliente por ID
  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<{ data?: any } | any>(`/customers/${id}`);
    console.log('📦 GET /customers/:id response:', response.data);
    const data = (response.data as any)?.data || response.data;
    return normalizeCustomer(data);
  },

  // Criar novo cliente
  create: async (data: CreateCustomerData): Promise<Customer> => {
    const payload = denormalizeCustomer(data);
    console.log('📤 [customersService] POST /customers Payload:', JSON.stringify(payload, null, 2));
    try {
      const response = await apiClient.post<{ data?: any } | any>('/customers', payload);
      const created = (response.data as any)?.data || response.data;
      return normalizeCustomer(created);
    } catch (error: any) {
      if (error?.response?.status === 409) {
        // Extrair informações detalhadas do backend
        const data = error.response?.data;
        const message = data?.message || 'Já existe um cliente cadastrado com esse CNPJ.';
        // Backend deve enviar o nome do tenant/parceiro diretamente
        const tenant = data?.tenant || data?.tenantName || data?.partner || data?.partnerName;
        
        // Criar erro com dados estruturados
        const err: any = new Error(message);
        err.tenant = tenant;
        err.isDuplicate = true;
        throw err;
      }
      throw error;
    }
  },

  // Atualizar cliente
  update: async (id: string, data: UpdateCustomerData): Promise<Customer> => {
    const payload = denormalizeCustomer(data);
    console.log('📤 [customersService] PATCH /customers/' + id, 'Payload:', JSON.stringify(payload, null, 2));
    try {
      // Tentar PATCH primeiro (padrão REST para update parcial)
      const response = await apiClient.patch<{ data?: any } | any>(`/customers/${id}`, payload);
      console.log('✅ [customersService] PATCH /customers response:', response.data);
      // Backend pode retornar envelope { success, data }
      const updated = (response.data as any)?.data || response.data;
      return normalizeCustomer(updated);
    } catch (error: any) {
      // Se PATCH não funcionar, tentar PUT
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        console.log('⚠️ PATCH failed, trying PUT...');
        const response = await apiClient.put<{ data?: any } | any>(`/customers/${id}`, payload);
        const updated = (response.data as any)?.data || response.data;
        return normalizeCustomer(updated);
      }
      throw error;
    }
  },

  // Deletar cliente
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },

  // Buscar clientes com paginação e filtros
  search: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<{
    customers: Customer[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await apiClient.get('/customers/search', { params });
    return response.data as {
      customers: Customer[];
      total: number;
      page: number;
      limit: number;
    };
  }
};