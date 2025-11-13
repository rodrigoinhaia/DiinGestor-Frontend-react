import { apiClient } from './api';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  contractId: string;
  contractNumber: string;
  planName: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled' | 'draft';
  dueDate: string;
  paidDate: string | null;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceData {
  contractId: string;
  dueDate: string;
  amount: number;
  description: string;
}

export interface UpdateInvoiceData extends Partial<CreateInvoiceData> {
  status?: 'paid' | 'pending' | 'overdue' | 'cancelled' | 'draft';
  paidDate?: string | null;
}

export const invoicesService = {
  getAll: async (): Promise<Invoice[]> => {
    const response = await apiClient.get('/invoices');
    return response.data as Invoice[];
  },

  getById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data as Invoice;
  },

  create: async (data: CreateInvoiceData): Promise<Invoice> => {
    const response = await apiClient.post('/invoices', data);
    return response.data as Invoice;
  },

  update: async (id: string, data: UpdateInvoiceData): Promise<Invoice> => {
    const response = await apiClient.put(`/invoices/${id}`, data);
    return response.data as Invoice;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/invoices/${id}`);
  },

  markAsPaid: async (id: string): Promise<Invoice> => {
    const response = await apiClient.patch(`/invoices/${id}/mark-as-paid`);
    return response.data as Invoice;
  }
};