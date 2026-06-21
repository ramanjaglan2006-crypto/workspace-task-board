import React, { useEffect } from 'react';
import { useWorkspaces } from '@/hooks/queries';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Loader2, ChevronsUpDown } from 'lucide-react';

export const WorkspaceSwitcher = () => {
  const { data: workspaces, isLoading } = useWorkspaces();
  const { selectedWorkspaceId, setWorkspaceId } = useWorkspaceStore();

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !selectedWorkspaceId) {
      setWorkspaceId(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspaceId, setWorkspaceId]);

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
        onChange={(e) => setWorkspaceId(e.target.value)}
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
