
import { axiosSecure } from '@/api/axios/config';


export const createCheckoutSession = async (leadIds) => {
  const res = await axiosSecure.post(
    '/purchase/checkout',
    { leadIds }
  );
  return res.data;
};

export const getPurchaseHistory = async () => {
  const res = await axiosSecure.get('/purchase/history');
  return res.data;
};
