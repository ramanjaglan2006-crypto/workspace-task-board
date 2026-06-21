import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import type { Workspace, Board, Task, ActivityItem } from '@/types';

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: () => apiClient<Workspace[]>('/workspaces'),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useBoards = (workspaceId: string) => {
  return useQuery({
    queryKey: ['boards', workspaceId],
    queryFn: () => apiClient<Board[]>(`/boards?workspaceId=${workspaceId}`),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
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

export const useTasks = (boardId?: string) => {
  return useQuery({
    queryKey: ['tasks', boardId],
    queryFn: () => apiClient<Task[]>(`/tasks?boardId=${boardId}`),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!boardId,
  });
};

export const useActivity = () => {
  return useQuery({
    queryKey: ['activity'],
    queryFn: () => apiClient<ActivityItem[]>('/activity'),
    staleTime: 15 * 1000,
    refetchInterval: 15 * 1000,
  });
};
