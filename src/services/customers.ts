import { apiClient } from './api';
import type {
  Customer,
  CreateCustomerData,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api';

export const customerService = {
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Customer>> {
    const response = await apiClient.get<PaginatedResponse<Customer>>('/customers', { params });
    return response.data;
  },

  async getCustomer(id: string): Promise<Customer> {
    const response = await apiClient.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data.data;
  },

  async createCustomer(data: CreateCustomerData): Promise<Customer> {
    const response = await apiClient.post<ApiResponse<Customer>>('/customers', data);
    return response.data.data;
  },

  async updateCustomer(id: string, data: Partial<CreateCustomerData>): Promise<Customer> {
    const response = await apiClient.patch<ApiResponse<Customer>>(`/customers/${id}`, data);
    return response.data.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },

  async getCustomerStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    monthlyGrowth: number;
  }> {
    const response = await apiClient.get<ApiResponse<any>>('/customers/stats');
    return response.data.data;
  },
};