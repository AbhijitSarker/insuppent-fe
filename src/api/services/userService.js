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
};
