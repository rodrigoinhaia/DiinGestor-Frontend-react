import { apiClient } from './api';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
  AuthUser,
} from '@/types/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.clearTokens();
  },

  async verifyToken(): Promise<AuthUser> {
    const response = await apiClient.get<ApiResponse<AuthUser>>('/auth/verify');
    return response.data.data;
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await apiClient.patch('/auth/change-password', data);
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(data: { token: string; password: string }): Promise<void> {
    await apiClient.post('/auth/reset-password', data);
  },
};