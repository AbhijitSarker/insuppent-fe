import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, updateStatus } from '../services/leadService';

export const useLeads = (params) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['leads', params],
    queryFn: () => getLeads(params),
    keepPreviousData: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({ leadId, status }) => updateStatus(leadId, status),
    onMutate: async ({ leadId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['leads', params] });

      // Snapshot the previous value
      const previousLeads = queryClient.getQueryData(['leads', params]);

      // Optimistically update to the new value
      queryClient.setQueryData(['leads', params], old => ({
        ...old,
        data: old.data.map(lead =>
          lead.id === leadId ? { ...lead, status } : lead
        ),
      }));

      // Return a context object with the snapshotted value
      return { previousLeads };
    },
    onError: (err, { leadId }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['leads', params], context.previousLeads);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ['leads', params] });
    },
  });

  return {
    ...query,
    updateStatus: (leadId, status) => statusMutation.mutate({ leadId, status }),
    isUpdating: statusMutation.isLoading,
  };
};