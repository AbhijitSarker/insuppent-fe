
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, getPublicLeads, updateStatus, getMyLeads } from '../services/leadService';
import { updatePurchasedLeadStatus, upsertPurchasedLeadComment, getUserPurchasedLeads } from '../services/purchaseService';

export const useUserPurchasedLeads = (userId) => {
  return useQuery({
    queryKey: ['userPurchasedLeads', userId],
    queryFn: () => getUserPurchasedLeads(userId),
    enabled: !!userId,
  });
};


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
      await queryClient.cancelQueries({ queryKey: ['leads'] });
      const previousLeads = queryClient.getQueryData(['leads']);
      queryClient.setQueryData(['leads'], old => ({
        ...old,
        data: old.data.map(lead =>
          lead.id === leadId ? { ...lead, status } : lead
        ),
      }));
      return { previousLeads };
    },
    onError: (err, { leadId }, context) => {
      queryClient.setQueryData(['leads'], context.previousLeads);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  return {
    ...query,
    updateStatus: (leadId, status) => statusMutation.mutateAsync({ leadId, status }),
    isUpdating: statusMutation.isLoading,
  };
};

export const usePublicLeads = () => {
  return useQuery({
    queryKey: ['public-leads'],
    queryFn: () => getPublicLeads(),
    keepPreviousData: true,
  });
};

// Fetch only the current user's leads
export const useMyLeads = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['my-leads'],
    queryFn: () => getMyLeads(),
    keepPreviousData: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({ leadId, status }) => updatePurchasedLeadStatus(leadId, status),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['my-leads'] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ leadId, comment }) => upsertPurchasedLeadComment(leadId, comment),
    onMutate: async ({ leadId, comment }) => {
      await queryClient.cancelQueries({ queryKey: ['my-leads'] });
      const previousLeads = queryClient.getQueryData(['my-leads']);
      // Optimistically update the comment
      queryClient.setQueryData(['my-leads'], old => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map(lead =>
            lead.id === leadId ? { ...lead, comment } : lead
          ),
        };
      });
      return { previousLeads };
    },
    onError: (err, variables, context) => {
      if (context?.previousLeads) {
        queryClient.setQueryData(['my-leads'], context.previousLeads);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['my-leads'] });
    },
  });

  return {
    ...query,
    updateStatus: (leadId, status) => statusMutation.mutateAsync({ leadId, status }),
    isUpdatingStatus: statusMutation.isLoading,
    upsertComment: (leadId, comment) => commentMutation.mutateAsync({ leadId, comment }),
    isUpdatingComment: commentMutation.isLoading,
  };
};