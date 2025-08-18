import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, updateStatus } from '../services/leadService';

export const useLeads = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['leads'],
    queryFn: () => getLeads(),
    keepPreviousData: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({ leadId, status }) => updateStatus(leadId, status),
    onMutate: async ({ leadId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['leads'] });

      // Snapshot the previous value
      const previousLeads = queryClient.getQueryData(['leads']);

      // Optimistically update to the new value
      queryClient.setQueryData(['leads'], old => ({
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
      queryClient.setQueryData(['leads'], context.previousLeads);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  return {
    ...query,
    updateStatus: (leadId, status) => statusMutation.mutateAsync({ leadId, status }),
    isUpdating: statusMutation.isLoading,
  };
};