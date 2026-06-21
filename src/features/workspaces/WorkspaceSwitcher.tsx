import React, { useEffect } from 'react';
import { useWorkspaces } from '@/hooks/queries';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Loader2, ChevronsUpDown } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import type { Board } from '@/types';

export const WorkspaceSwitcher = () => {
  const { data: workspaces, isLoading } = useWorkspaces();
  const { selectedWorkspaceId, setWorkspaceId } = useWorkspaceStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !selectedWorkspaceId) {
      setWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspaceId, setWorkspaceId]);

  const handleWorkspaceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWorkspaceId = e.target.value;
    setWorkspaceId(newWorkspaceId);

    // Prefetch boards for the new workspace
    await queryClient.prefetchQuery({
      queryKey: ['boards', newWorkspaceId],
      queryFn: () => apiClient<Board[]>(`/boards?workspaceId=${newWorkspaceId}`),
      staleTime: 5 * 60 * 1000,
    });

    // Prefetch tasks for the first board
    const boards = queryClient.getQueryData<Board[]>(['boards', newWorkspaceId]);
    if (boards && boards.length > 0) {
      const firstBoardId = boards[0].id;
      queryClient.prefetchQuery({
        queryKey: ['tasks', firstBoardId],
        queryFn: () => apiClient(`/tasks?boardId=${firstBoardId}`),
        staleTime: 2 * 60 * 1000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between rounded-md border px-3 py-2">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  const selected = workspaces?.find(w => w.id === selectedWorkspaceId) || workspaces?.[0];

  return (
    <div className="relative group">
      <select
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
        value={selectedWorkspaceId || ''}
        onChange={handleWorkspaceChange}
      >
        {workspaces?.map(w => (
          <option key={w.id} value={w.id}>{w.name}</option>
        ))}
      </select>
      
      <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2 shadow-sm group-hover:border-primary/50 transition-colors">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-xs">
            {selected?.name.charAt(0)}
          </div>
          <span className="text-sm font-medium truncate w-32">{selected?.name}</span>
        </div>
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};
