import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { AuthTokens } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;
  private baseURL = import.meta.env.DEV ? '/api/v1' : (import.meta.env.VITE_API_URL || 'https://backendgestor.sdbr.app/api/v1');

  constructor() {
    // Log da configuração para debug
    console.log('🌐 API Client Config:', {
      isDev: import.meta.env.DEV,
      baseURL: this.baseURL,
      envApiUrl: import.meta.env.VITE_API_URL
    });

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Adiciona token de autenticação
    this.client.interceptors.request.use(
      (config) => {
        const tokens = this.getStoredTokens();
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Trata respostas e erros
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const tokens = this.getStoredTokens();
            if (tokens?.refreshToken) {
              const response = await this.refreshToken(tokens.refreshToken);
              this.setTokens(response.data);
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            // Redirecionar para login
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getStoredTokens(): AuthTokens | null {
    try {
      const tokens = localStorage.getItem('auth-tokens');
      return tokens ? JSON.parse(tokens) : null;
    } catch {
      return null;
    }
  }

  public setTokens(tokens: AuthTokens): void {
    localStorage.setItem('auth-tokens', JSON.stringify(tokens));
  }

  public clearTokens(): void {
    localStorage.removeItem('auth-tokens');
  }

  private async refreshToken(refreshToken: string) {
    return this.client.post('/auth/refresh', { refreshToken });
  }

  // Métodos HTTP genéricos
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();