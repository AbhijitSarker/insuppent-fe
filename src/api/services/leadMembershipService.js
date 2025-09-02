import { axiosSecure } from '../axios/config';

export const getLeadMembershipMaxSaleCounts = async () => {
  const res = await axiosSecure.get(`/leads/max-lead-sale-count`);
  return res.data.data;
};

export const updateLeadMembershipMaxSaleCount = async (membership, maxLeadSaleCount) => {
    const res = await axiosSecure.patch(`/leads/max-lead-sale-count/${membership}`, { maxLeadSaleCount });
  return res.data.data;
};
