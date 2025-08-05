import { axiosSecure } from '../axios/config';

export const getLeads = async ({ page = 1, limit = 15, sortBy = 'createdAt', sortOrder = 'desc', type, status, searchTerm }) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    sortBy,
    sortOrder,
    ...(type && { type }),
    ...(status && { status }),
    ...(searchTerm && { searchTerm }),
  });

  const response = await axiosSecure.get(`/leads?${queryParams}`);
  return response.data;
};