import type { User, Workspace, Board, Task, Column } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', email: 'raman@test.com', name: 'Raman', avatar: '/avtaar.png' },
  { id: 'u2', email: 'alice@test.com', name: 'Alice Smith', avatar: 'https://i.pravatar.cc/150?u=u2' }
];

export const mockWorkspaces: Workspace[] = [
  { id: 'w1', name: 'Engineering', members: mockUsers },
  { id: 'w2', name: 'Marketing', members: mockUsers }
];

const genColumns = (prefix: string): Column[] => [
  { id: `${prefix}-c1`, title: 'Todo', order: 0 },
  { id: `${prefix}-c2`, title: 'In Progress', order: 1 },
  { id: `${prefix}-c3`, title: 'Review', order: 2 },
  { id: `${prefix}-c4`, title: 'Done', order: 3 }
];

export let mockBoards: Board[] = [
  { id: 'b1', name: 'Sprint 1', workspaceId: 'w1', columns: genColumns('b1') },
  { id: 'b2', name: 'Backlog', workspaceId: 'w1', columns: genColumns('b2') },
  { id: 'b3', name: 'Campaign Q3', workspaceId: 'w2', columns: genColumns('b3') }
];

export let mockTasks: Task[] = [
  { id: 't1', boardId: 'b1', title: 'Setup Vite Project', description: 'Initialize repository with Vite, React, TS', status: 'b1-c4', priority: 'high', assignee: mockUsers[0], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't2', boardId: 'b1', title: 'Configure MSW', description: 'Setup Mock Service Worker for API mocking', status: 'b1-c2', priority: 'medium', assignee: mockUsers[0], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't3', boardId: 'b1', title: 'Design Database Schema', description: 'Design tables for tasks, boards, workspaces', status: 'b1-c1', priority: 'high', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

// Mutators
export const addMockTask = (task: Task) => { mockTasks.push(task); }
export const updateMockTask = (id: string, updates: Partial<Task>) => {
  const index = mockTasks.findIndex(t => t.id === id);
  if (index !== -1) mockTasks[index] = { ...mockTasks[index], ...updates };
}
export const deleteMockTask = (id: string) => {
  const index = mockTasks.findIndex(t => t.id === id);
  if (index !== -1) mockTasks.splice(index, 1);
}
