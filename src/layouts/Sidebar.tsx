import React from 'react';
import { NavLink } from 'react-router-dom';
import { useBoards } from '@/hooks/queries';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { WorkspaceSwitcher } from '@/features/workspaces/WorkspaceSwitcher';
import { Loader2, LayoutDashboard, X, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const selectedWorkspaceId = useWorkspaceStore(state => state.selectedWorkspaceId);
  const { data: boards, isLoading: isLoadingBoards } = useBoards(selectedWorkspaceId);

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2 font-bold text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
             <Layers size={18} />
          </div>
          <span>TaskBoard</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X size={18} />
          </Button>
        )}
      </div>

      <div className="p-4 border-b bg-muted/10">
        <WorkspaceSwitcher />
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
            Boards
          </h2>
          {isLoadingBoards ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : boards?.length === 0 ? (
            <p className="px-2 text-sm text-muted-foreground">No boards found.</p>
          ) : (
            <div className="space-y-1">
              {boards?.map(board => (
                <NavLink
                  key={board.id}
                  to={`/board/${board.id}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActive ? 'bg-secondary text-secondary-foreground shadow-sm' : 'text-muted-foreground'
                    }`
                  }
                >
                  <LayoutDashboard size={16} />
                  {board.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
