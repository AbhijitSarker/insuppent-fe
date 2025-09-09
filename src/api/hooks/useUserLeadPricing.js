import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { calculateLeadPrice, setPricingData } from '@/utils/leadPricing';
import { useQuery } from '@tanstack/react-query';
import { getLeadPricing } from '@/api/services/leadPricingService';

export const useUserLeadPricing = () => {
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);
  
  // Fetch pricing data from backend
  const { data: pricingData, isLoading: isPricingLoading } = useQuery({
    queryKey: ['leadPricing'],
    queryFn: getLeadPricing,
  });
  
  // Determine user's membership level
  const membershipLevel = user?.membership || 'Subscriber';
  
  // Calculate price for a specific lead type
  const getPriceForLeadType = (leadType) => {
    return calculateLeadPrice(membershipLevel, leadType);
  };
  
  useEffect(() => {
    if (pricingData && !isPricingLoading) {
      // Update the cache with fresh data from API
      setPricingData(pricingData);
      setIsReady(true);
    }
  }, [pricingData, isPricingLoading]);
  
  return {
    membershipLevel,
    getPriceForLeadType,
    isReady,
    isPricingLoading,
  };
};
