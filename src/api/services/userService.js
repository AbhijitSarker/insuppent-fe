
import { axiosAdmin, axiosOpen, axiosSecure } from '../axios/config';

export const userService = {
  async getAllUsers() {
    const res = await axiosAdmin.get('/users');
    return res.data.data;
  },
  async getUserById(id) {
    const res = await axiosAdmin.get(`/users/${id}`);
    return res.data.data;
  },
  async updateUserStatus(id, status) {
    const res = await axiosAdmin.patch(`/users/${id}/status`, { status });
    return res.data.data;
  },
};
