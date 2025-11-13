import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsService } from '@/services/contractsService';
import type { CreateContractData, UpdateContractData } from '@/services/contractsService';

export const contractKeys = {
  all: ['contracts'] as const,
  lists: () => [...contractKeys.all, 'list'] as const,
  details: () => [...contractKeys.all, 'detail'] as const,
  detail: (id: string) => [...contractKeys.details(), id] as const,
};

export const useContracts = () => {
  return useQuery({
    queryKey: contractKeys.lists(),
    queryFn: contractsService.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useContract = (id: string) => {
  return useQuery({
    queryKey: contractKeys.detail(id),
    queryFn: () => contractsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContractData) => contractsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
};

export const useUpdateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContractData }) =>
      contractsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(id) });
    },
  });
};

export const useDeleteContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
};