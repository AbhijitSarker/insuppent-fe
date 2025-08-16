import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';


export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
  });
}

export function useUser(userId) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  });
}
