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
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {
  isActive?: boolean;
}

export const customersService = {
  // Buscar todos os clientes
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get('/customers');
    return response.data as Customer[];
  },

  // Buscar cliente por ID
  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data as Customer;
  },

  // Criar novo cliente
  create: async (data: CreateCustomerData): Promise<Customer> => {
    const response = await apiClient.post('/customers', data);
    return response.data as Customer;
  },

  // Atualizar cliente
  update: async (id: string, data: UpdateCustomerData): Promise<Customer> => {
    const response = await apiClient.put(`/customers/${id}`, data);
    return response.data as Customer;
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