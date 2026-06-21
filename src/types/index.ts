export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Workspace {
  id: string;
  name: string;
  members: User[];
}

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Task {
  id: string;
  boardId: string;
  title: string;
  description: string;
  status: string; // references Column ID
  priority: 'low' | 'medium' | 'high';
  assignee?: User;
  storyPoints?: number;
  labels?: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  workspaceId: string;
  columns: Column[];
}

export type ActivityType = 'CREATED' | 'UPDATED' | 'DELETED' | 'MOVED' | 'ASSIGNED' | 'COMPLETED';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  actor: User;
  targetTaskTitle?: string;
  timestamp: string;
}
