import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemsService } from '@/services/systemsService';
import type { CreateSystemData, UpdateSystemData } from '@/types/api';

export const systemKeys = {
  all: ['systems'] as const,
  lists: () => [...systemKeys.all, 'list'] as const,
  details: () => [...systemKeys.all, 'detail'] as const,
  detail: (id: string) => [...systemKeys.details(), id] as const,
};

export const useSystems = () => {
  return useQuery({
    queryKey: systemKeys.lists(),
    queryFn: systemsService.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSystem = (id: string) => {
  return useQuery({
    queryKey: systemKeys.detail(id),
    queryFn: () => systemsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSystemData) => systemsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemKeys.all });
    },
  });
};

export const useUpdateSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSystemData }) =>
      systemsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: systemKeys.all });
      queryClient.invalidateQueries({ queryKey: systemKeys.detail(id) });
    },
  });
};

export const useDeleteSystem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => systemsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: systemKeys.all });
    },
  });
};
