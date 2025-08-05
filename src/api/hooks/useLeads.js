import { useQuery } from '@tanstack/react-query';
import { getLeads } from '../services/leadService';

export const useLeads = (params) => {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => getLeads(params),
    keepPreviousData: true,
  });
};