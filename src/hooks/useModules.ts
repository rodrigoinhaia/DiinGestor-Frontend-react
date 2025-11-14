import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modulesService } from '@/services/modulesService';
import type { CreateModuleData, UpdateModuleData } from '@/types/api';

export const moduleKeys = {
  all: ['modules'] as const,
  lists: () => [...moduleKeys.all, 'list'] as const,
  bySystem: (systemId: string) => [...moduleKeys.all, 'by-system', systemId] as const,
  details: () => [...moduleKeys.all, 'detail'] as const,
  detail: (id: string) => [...moduleKeys.details(), id] as const,
};

export const useModules = (params?: { search?: string; isActive?: boolean; systemId?: string }) => {
  return useQuery({
    queryKey: [...moduleKeys.lists(), params],
    queryFn: () => modulesService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useModulesBySystem = (systemId: string) => {
  return useQuery({
    queryKey: moduleKeys.bySystem(systemId),
    queryFn: () => modulesService.getBySystemId(systemId),
    enabled: !!systemId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useModule = (id: string) => {
  return useQuery({
    queryKey: moduleKeys.detail(id),
    queryFn: () => modulesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateModuleData) => modulesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.all });
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModuleData }) =>
      modulesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.all });
      queryClient.invalidateQueries({ queryKey: moduleKeys.detail(id) });
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => modulesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.all });
    },
  });
};
