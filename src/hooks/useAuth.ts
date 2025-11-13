import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import type { LoginCredentials, RegisterData } from '@/types/api';

export function useAuth() {
  const { user, isAuthenticated, setAuth, clearAuth, setLoading } = useAuthStore();

  return {
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
    setLoading,
  };
}

export function useLoginMutation() {
  const { setAuth, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.tokens);
    },
    onError: () => {
      setLoading(false);
    },
  });
}

export function useRegisterMutation() {
  const { setAuth, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.tokens);
    },
    onError: () => {
      setLoading(false);
    },
  });
}

export function useLogoutMutation() {
  const { clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear(); // Limpa todas as queries em cache
    },
  });
}

export function useVerifyToken() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['verify-token'],
    queryFn: () => authService.verifyToken(),
    enabled: isAuthenticated,
    retry: false,
  });
}