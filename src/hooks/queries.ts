import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import type { Workspace, Board, Task } from '@/types';

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: () => apiClient<Workspace[]>('/workspaces'),
  });
};

export const useBoards = (workspaceId: string | null) => {
  return useQuery({
    queryKey: ['boards', workspaceId],
    queryFn: () => apiClient<Board[]>(`/boards?workspaceId=${workspaceId}`),
    enabled: !!workspaceId,
  });
};

export const useBoard = (boardId: string | undefined) => {
  return useQuery({
    queryKey: ['board', boardId],
    queryFn: () => apiClient<Board>(`/board/${boardId}`),
    enabled: !!boardId,
  });
};

export const usePublicBoard = (boardId: string | undefined) => {
  return useQuery({
    queryKey: ['publicBoard', boardId],
    queryFn: () => apiClient<{ board: Board; tasks: Task[] }>(`/public/board/${boardId}`),
    enabled: !!boardId,
  });
};

export const useTasks = (boardId: string | undefined) => {
  return useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => apiClient<Task[]>(`/tasks?boardId=${boardId}`),
    enabled: !!boardId,
  });
};
