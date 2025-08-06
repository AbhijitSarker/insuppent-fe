import { axiosOpen, axiosSecure } from '../axios/config';

export const authService = {
  login: async (credentials) => {
    const response = await axiosOpen.post('/admin/login', credentials);
    if (response.data?.data?.accessToken) {
      localStorage.setItem('token', response.data.data.accessToken);
    }
    return response.data;
  },

  signup: async (adminData) => {
    const response = await axiosOpen.post('/admin/signup', adminData);
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosOpen.post('/admin/refresh-token');
    if (response.data?.data?.accessToken) {
      localStorage.setItem('token', response.data.data.accessToken);
    }
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosSecure.get('/admin/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axiosSecure.patch('/admin/profile', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};