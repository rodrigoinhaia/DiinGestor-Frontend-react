import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plansService } from '@/services/plansService';
import type { CreatePlanData, UpdatePlanData } from '@/types/api';

export const planKeys = {
  all: ['plans'] as const,
  lists: () => [...planKeys.all, 'list'] as const,
  details: () => [...planKeys.all, 'detail'] as const,
  detail: (id: string) => [...planKeys.details(), id] as const,
};

export const usePlans = () => {
  return useQuery({
    queryKey: planKeys.lists(),
    queryFn: plansService.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlan = (id: string) => {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: () => plansService.getById(id),
    enabled: !!id,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanData) => plansService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanData }) =>
      plansService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      queryClient.invalidateQueries({ queryKey: planKeys.detail(id) });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plansService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
    },
  });
};