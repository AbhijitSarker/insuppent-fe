import { axiosSecure } from '../axios/config';

export const getLeads = async ({ page = 1, limit = 15, sortBy = 'createdAt', sortOrder = 'desc', type, status, state, searchTerm }) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    sortBy,
    sortOrder,
    ...(type && { type }),
    ...(status && { status }),
    ...(state && { state }),
    ...(searchTerm && { searchTerm }),
  });

  const response = await axiosSecure.get(`/leads?${queryParams}`);
  return response.data;
};

export const updateStatus = async (leadId, status) => {
  try {
    const response = await axiosSecure.patch(`/leads/${leadId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};