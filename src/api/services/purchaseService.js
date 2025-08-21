import axios from 'axios';
import { getToken } from '@/api/axios/config';

export const createCheckoutSession = async (leadIds) => {
  const token = getToken();
  const res = await axios.post(
    '/leads/purchase/checkout',
    { leadIds },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getPurchaseHistory = async () => {
  const token = getToken();
  const res = await axios.get('/leads/purchase/history', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
