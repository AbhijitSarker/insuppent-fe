import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => userService.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}
