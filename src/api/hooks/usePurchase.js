import { useMutation, useQuery } from '@tanstack/react-query';
import { createCheckoutSession, getPurchaseHistory } from '../services/purchaseService';

export const useCreateCheckoutSession = () => {
  return useMutation((leadIds) => createCheckoutSession(leadIds));
};

export const usePurchaseHistory = () => {
  return useQuery('purchaseHistory', getPurchaseHistory);
};
