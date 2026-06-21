import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import type { Task } from '@/types';

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskData: Partial<Task>) => 
      apiClient<Task>('/task', {
        method: 'POST',
        body: JSON.stringify(taskData),
      }),
    onMutate: async (newTask) => {
      if (!newTask.boardId) return;
      await queryClient.cancelQueries({ queryKey: ['tasks', newTask.boardId] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', newTask.boardId]);

      const optimisticTask: Task = {
        id: `temp-${Date.now()}`,
        boardId: newTask.boardId,
        title: newTask.title || '',
        description: newTask.description || '',
        status: newTask.status || '',
        priority: newTask.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...newTask
      };

      queryClient.setQueryData<Task[]>(['tasks', newTask.boardId], (old) => {
        return old ? [...old, optimisticTask] : [optimisticTask];
      });

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      if (context?.previousTasks && newTask.boardId) {
        queryClient.setQueryData(['tasks', newTask.boardId], context.previousTasks);
      }
    },
    onSettled: (data, error, variables) => {
      if (variables.boardId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', variables.boardId] });
      }
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates, boardId }: { id: string; updates: Partial<Task>; boardId: string }) => 
      apiClient<Task>(`/task/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }),
    onMutate: async ({ id, updates, boardId }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', boardId] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', boardId]);

      queryClient.setQueryData<Task[]>(['tasks', boardId], (old) => {
        if (!old) return old;
        return old.map(t => t.id === id ? { ...t, ...updates } : t);
      });

      return { previousTasks, boardId };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks && context.boardId) {
        queryClient.setQueryData(['tasks', context.boardId], context.previousTasks);
      }
    },
    onSettled: (data, error, variables, context) => {
      if (context?.boardId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', context.boardId] });
      }
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; boardId: string }) => 
      apiClient<{success: boolean}>(`/task/${id}`, {
        method: 'DELETE',
      }),
    onMutate: async ({ id, boardId }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', boardId] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks', boardId]);

      queryClient.setQueryData<Task[]>(['tasks', boardId], (old) => {
        if (!old) return old;
        return old.filter(t => t.id !== id);
      });

      return { previousTasks, boardId };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks && context.boardId) {
        queryClient.setQueryData(['tasks', context.boardId], context.previousTasks);
      }
    },
    onSettled: (data, error, variables, context) => {
      if (context?.boardId) {
        queryClient.invalidateQueries({ queryKey: ['tasks', context.boardId] });
      }
    },
  });
};
