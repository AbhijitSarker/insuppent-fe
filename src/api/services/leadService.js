import { axiosSecure } from '../axios/config';

export const getLeads = async () => {
  const response = await axiosSecure.get('/leads');
  return response.data;
};

export const getPublicLeads = async () => {
  const response = await axiosSecure.get('/leads/find');
  return response.data;
};

export const updateStatus = async (leadId, status) => {
  const response = await axiosSecure.patch(`/leads/${leadId}/status`, { status });
  return response.data;
};

export const getMyLeads = async () => {
  const response = await axiosSecure.get('/purchase/my-leads');
  return response.data;
};
