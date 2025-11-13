// Tipos de autenticação
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  tenant: {
    id: string;
    name: string;
  };
  permissions: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

// Tipos de clientes
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  address?: {
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
  phone?: string;
  document?: string;
  address?: Customer['address'];
}

// Tipos de contratos
export interface Contract {
  id: string;
  customerId: string;
  customer: Customer;
  planId: string;
  plan: Plan;
  status: 'active' | 'suspended' | 'cancelled' | 'pending';
  startDate: string;
  endDate?: string;
  value: number;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractData {
  customerId: string;
  planId: string;
  startDate: string;
  endDate?: string;
  value: number;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
}

// Tipos de planos
export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  features: PlanFeature[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
  limit?: number;
}

export interface CreatePlanData {
  name: string;
  description?: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  features: Omit<PlanFeature, 'id'>[];
}

// Tipos de faturas
export interface Invoice {
  id: string;
  contractId: string;
  contract: Contract;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceData {
  contractId: string;
  amount: number;
  dueDate: string;
  description?: string;
}

// Tipos de tickets
export interface Ticket {
  id: string;
  customerId: string;
  customer: Customer;
  assignedUserId?: string;
  assignedUser?: AuthUser;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  createdAt: string;
  updatedAt: string;
  comments: TicketComment[];
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  user: AuthUser;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface CreateTicketData {
  customerId: string;
  title: string;
  description: string;
  priority: Ticket['priority'];
  category?: string;
}

// Tipos de dashboard e estatísticas
export interface DashboardStats {
  totalCustomers: number;
  activeContracts: number;
  totalRevenue: number;
  pendingInvoices: number;
  openTickets: number;
  monthlyGrowth: {
    customers: number;
    revenue: number;
  };
}

export interface RevenueData {
  month: string;
  revenue: number;
  contracts: number;
  churn: number;
}

// Tipos utilitários
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}