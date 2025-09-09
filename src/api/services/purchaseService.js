import { axiosAdmin, axiosSecure } from '@/api/axios/config';


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

export const getUserPurchasedLeads = async (userId) => {
  const res = await axiosAdmin.get(`/purchase/user/${userId}/leads`);
  return res.data;
};
export const updatePurchasedLeadStatus = async (leadId, status) => {
  const res = await axiosSecure.patch(`/purchase/${leadId}/status`, { status });
  return res.data;
};

export const upsertPurchasedLeadComment = async (leadId, comment) => {
  const res = await axiosSecure.patch(`/purchase/${leadId}/comment`, { comment });
  return res.data;
};

export const markLeadUserRefunded = async (leadUserId, isRefunded) => {
  const res = await axiosAdmin.patch(`/admin/lead-user/${leadUserId}/refund`, { isRefunded });
  return res.data;
};
