import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getLeadPricing, updateLeadPricing } from '../services/leadPricingService';
import { setPricingData } from '../../utils/leadPricing';

export const useLeadPricing = () => {
  return useQuery({
    queryKey: ['leadPricing'],
    queryFn: async () => {
      const data = await getLeadPricing();
      // Store pricing data in our utility for reuse across the app
      setPricingData(data);
      return data;
    },
  });
};

export const useUpdateLeadPricing = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pricing) => {
      const data = await updateLeadPricing(pricing);
      // Update cached pricing data immediately
      setPricingData(pricing);
      return data;
    },
    onSuccess: () => {
      console.log('Lead pricing updated successfully');
      queryClient.invalidateQueries({ queryKey: ['leadPricing'] });
    },
    onError: (error) => {
      console.error('Error updating lead pricing:', error);
      // Optionally, you could add toast notifications here
    }
  });
};
