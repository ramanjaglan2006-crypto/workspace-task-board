import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkspaceState {
  selectedWorkspaceId: string | null;
  setWorkspaceId: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      selectedWorkspaceId: null,
      setWorkspaceId: (id) => set({ selectedWorkspaceId: id }),
    }),
    { name: 'workspace-storage' }
  )
);
