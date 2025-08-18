
import { axiosOpen } from '../axios/config';

export const userService = {
  async getAllUsers() {
    const res = await axiosOpen.get('/users');
    return res.data.data;
  },
  async getUserById(id) {
    const res = await axiosOpen.get(`/users/${id}`);
    return res.data.data;
  },
  async updateUserStatus(id, status) {
    const res = await axiosOpen.patch(`/users/${id}/status`, { status });
    return res.data.data;
  },
};
