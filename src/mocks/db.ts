import type { User, Workspace, Board, Task, Column, ActivityItem, ActivityType } from '@/types';
import { subDays, subHours, subMinutes } from 'date-fns';

export const mockUsers: User[] = [
  { id: 'u1', email: 'raman@test.com', name: 'Raman', avatar: '/avtaar.png' },
  { id: 'u2', email: 'demo@test.com', name: 'Demo User', avatar: 'https://i.pravatar.cc/150?u=u2' },
  { id: 'u3', email: 'sarah@test.com', name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=u3' }
];

export const mockWorkspaces: Workspace[] = [
  { id: 'w1', name: 'Engineering', members: mockUsers },
  { id: 'w2', name: 'Marketing', members: mockUsers },
  { id: 'w3', name: 'Product', members: mockUsers }
];

const genColumns = (prefix: string): Column[] => [
  { id: `${prefix}-c1`, title: 'Todo', order: 0 },
  { id: `${prefix}-c2`, title: 'In Progress', order: 1 },
  { id: `${prefix}-c3`, title: 'Review', order: 2 },
  { id: `${prefix}-c4`, title: 'Done', order: 3 }
];

export let mockBoards: Board[] = [
  { id: 'b1', name: 'Sprint 1', workspaceId: 'w1', columns: genColumns('b1') },
  { id: 'b2', name: 'Q3 Campaign', workspaceId: 'w2', columns: genColumns('b2') },
  { id: 'b3', name: 'Roadmap 2026', workspaceId: 'w3', columns: genColumns('b3') }
];

const now = new Date();

export let mockTasks: Task[] = [
  // Engineering Tasks
  { id: 't1', boardId: 'b1', title: 'Design Database Schema', description: 'Design tables for tasks, boards, workspaces', status: 'b1-c4', priority: 'high', assignee: mockUsers[1], storyPoints: 5, labels: ['backend', 'database'], dueDate: subDays(now, 2).toISOString(), createdAt: subDays(now, 10).toISOString(), updatedAt: subDays(now, 2).toISOString() },
  { id: 't2', boardId: 'b1', title: 'Configure MSW', description: 'Setup Mock Service Worker for API mocking', status: 'b1-c4', priority: 'medium', assignee: mockUsers[0], storyPoints: 3, labels: ['frontend', 'testing'], createdAt: subDays(now, 9).toISOString(), updatedAt: subDays(now, 3).toISOString() },
  { id: 't3', boardId: 'b1', title: 'Implement JWT Authentication', description: 'Add secure token-based auth to login flow', status: 'b1-c3', priority: 'high', assignee: mockUsers[0], storyPoints: 8, labels: ['security'], dueDate: now.toISOString(), createdAt: subDays(now, 8).toISOString(), updatedAt: subHours(now, 5).toISOString() },
  { id: 't4', boardId: 'b1', title: 'Setup React Query', description: 'Install and configure tanstack react query for caching', status: 'b1-c3', priority: 'medium', assignee: mockUsers[2], storyPoints: 3, labels: ['frontend'], createdAt: subDays(now, 7).toISOString(), updatedAt: subHours(now, 10).toISOString() },
  { id: 't5', boardId: 'b1', title: 'Build Workspace Switcher', description: 'Sidebar dropdown to toggle active workspaces', status: 'b1-c2', priority: 'medium', assignee: mockUsers[1], storyPoints: 5, labels: ['ui'], createdAt: subDays(now, 6).toISOString(), updatedAt: subDays(now, 1).toISOString() },
  { id: 't6', boardId: 'b1', title: 'Create Public Board Page', description: 'Read-only view for external board sharing', status: 'b1-c2', priority: 'low', storyPoints: 5, labels: ['feature'], createdAt: subDays(now, 5).toISOString(), updatedAt: subDays(now, 5).toISOString() },
  { id: 't7', boardId: 'b1', title: 'Implement Activity Feed', description: 'Real-time event log for board history', status: 'b1-c1', priority: 'medium', assignee: mockUsers[2], storyPoints: 8, labels: ['feature'], createdAt: subDays(now, 4).toISOString(), updatedAt: subDays(now, 4).toISOString() },
  { id: 't8', boardId: 'b1', title: 'Optimize Board Rendering', description: 'Add React.memo and useCallback to prevent lag', status: 'b1-c1', priority: 'high', storyPoints: 5, labels: ['performance'], dueDate: now.toISOString(), createdAt: subDays(now, 3).toISOString(), updatedAt: subDays(now, 3).toISOString() },
  { id: 't9', boardId: 'b1', title: 'Setup CI/CD Pipeline', description: 'GitHub Actions config for automated testing and deployment', status: 'b1-c1', priority: 'high', assignee: mockUsers[0], storyPoints: 13, labels: ['devops'], createdAt: subDays(now, 2).toISOString(), updatedAt: subDays(now, 2).toISOString() },
  { id: 't10', boardId: 'b1', title: 'Add Role Based Access', description: 'Admin, Editor, Viewer permission structures', status: 'b1-c1', priority: 'medium', storyPoints: 8, labels: ['security'], createdAt: subDays(now, 1).toISOString(), updatedAt: subDays(now, 1).toISOString() },

  // Marketing Tasks
  { id: 't11', boardId: 'b2', title: 'Landing Page Copy', description: 'Draft high-converting headlines and hero text', status: 'b2-c3', priority: 'high', assignee: mockUsers[2], storyPoints: 5, labels: ['copywriting'], createdAt: subDays(now, 10).toISOString(), updatedAt: subDays(now, 2).toISOString() },
  { id: 't12', boardId: 'b2', title: 'Social Media Calendar', description: 'Plan posts for Q3 across Twitter and LinkedIn', status: 'b2-c2', priority: 'medium', assignee: mockUsers[1], storyPoints: 3, labels: ['planning'], createdAt: subDays(now, 9).toISOString(), updatedAt: subDays(now, 3).toISOString() },
  { id: 't13', boardId: 'b2', title: 'Email Campaign Design', description: 'Create Figma templates for newsletter', status: 'b2-c1', priority: 'medium', assignee: mockUsers[0], storyPoints: 5, labels: ['design'], createdAt: subDays(now, 8).toISOString(), updatedAt: subDays(now, 8).toISOString() },
  { id: 't14', boardId: 'b2', title: 'Influencer Outreach', description: 'Contact top 20 industry leaders for collaboration', status: 'b2-c2', priority: 'high', storyPoints: 8, labels: ['outreach'], dueDate: now.toISOString(), createdAt: subDays(now, 7).toISOString(), updatedAt: subDays(now, 1).toISOString() },
  { id: 't15', boardId: 'b2', title: 'Blog Publishing Schedule', description: 'Content roadmap for Q3', status: 'b2-c1', priority: 'low', assignee: mockUsers[2], storyPoints: 3, labels: ['content'], createdAt: subDays(now, 6).toISOString(), updatedAt: subDays(now, 6).toISOString() },
  { id: 't16', boardId: 'b2', title: 'SEO Keyword Research', description: 'Identify top ranking opportunities', status: 'b2-c4', priority: 'high', assignee: mockUsers[1], storyPoints: 5, labels: ['seo'], createdAt: subDays(now, 5).toISOString(), updatedAt: subDays(now, 4).toISOString() },
  { id: 't17', boardId: 'b2', title: 'Campaign Analytics Dashboard', description: 'Setup Looker studio for tracking', status: 'b2-c1', priority: 'medium', storyPoints: 8, labels: ['analytics'], createdAt: subDays(now, 4).toISOString(), updatedAt: subDays(now, 4).toISOString() },
  { id: 't18', boardId: 'b2', title: 'Ad Creative Review', description: 'Approve final banner designs', status: 'b2-c3', priority: 'high', assignee: mockUsers[0], storyPoints: 3, labels: ['design'], createdAt: subDays(now, 3).toISOString(), updatedAt: subHours(now, 12).toISOString() },
  { id: 't19', boardId: 'b2', title: 'Product Launch Announcement', description: 'Draft press release', status: 'b2-c2', priority: 'high', assignee: mockUsers[2], storyPoints: 5, labels: ['pr'], createdAt: subDays(now, 2).toISOString(), updatedAt: subDays(now, 1).toISOString() },
  { id: 't20', boardId: 'b2', title: 'Newsletter Setup', description: 'Import contacts to Mailchimp', status: 'b2-c1', priority: 'low', storyPoints: 2, labels: ['ops'], createdAt: subDays(now, 1).toISOString(), updatedAt: subDays(now, 1).toISOString() },

  // Product Tasks
  { id: 't21', boardId: 'b3', title: 'User Feedback Analysis', description: 'Review Q2 survey results', status: 'b3-c4', priority: 'high', assignee: mockUsers[1], storyPoints: 8, labels: ['research'], createdAt: subDays(now, 15).toISOString(), updatedAt: subDays(now, 10).toISOString() },
  { id: 't22', boardId: 'b3', title: 'Feature Prioritization', description: 'RICE scoring for upcoming backlog', status: 'b3-c2', priority: 'high', assignee: mockUsers[0], storyPoints: 5, labels: ['planning'], createdAt: subDays(now, 14).toISOString(), updatedAt: subDays(now, 5).toISOString() },
  { id: 't23', boardId: 'b3', title: 'Public API Planning', description: 'Draft endpoints for external integrations', status: 'b3-c1', priority: 'medium', storyPoints: 13, labels: ['architecture'], createdAt: subDays(now, 13).toISOString(), updatedAt: subDays(now, 13).toISOString() },
  { id: 't24', boardId: 'b3', title: 'Mobile App Strategy', description: 'Evaluate React Native vs Flutter', status: 'b3-c2', priority: 'low', assignee: mockUsers[2], storyPoints: 8, labels: ['research'], createdAt: subDays(now, 12).toISOString(), updatedAt: subDays(now, 2).toISOString() },
  { id: 't25', boardId: 'b3', title: 'Subscription Flow Improvements', description: 'Reduce churn during checkout', status: 'b3-c3', priority: 'high', assignee: mockUsers[1], storyPoints: 5, labels: ['growth'], createdAt: subDays(now, 11).toISOString(), updatedAt: subHours(now, 4).toISOString() },
  { id: 't26', boardId: 'b3', title: 'Analytics Tracking', description: 'Add Mixpanel events to core flows', status: 'b3-c1', priority: 'medium', assignee: mockUsers[0], storyPoints: 5, labels: ['data'], createdAt: subDays(now, 10).toISOString(), updatedAt: subDays(now, 10).toISOString() },
  { id: 't27', boardId: 'b3', title: 'Team Permissions System', description: 'Define granular RBAC roles', status: 'b3-c1', priority: 'high', storyPoints: 13, labels: ['security'], createdAt: subDays(now, 9).toISOString(), updatedAt: subDays(now, 9).toISOString() },
  { id: 't28', boardId: 'b3', title: 'Advanced Search Design', description: 'Mockups for global elastic search', status: 'b3-c1', priority: 'medium', assignee: mockUsers[2], storyPoints: 8, labels: ['design'], createdAt: subDays(now, 8).toISOString(), updatedAt: subDays(now, 8).toISOString() },
  { id: 't29', boardId: 'b3', title: 'Notification Center', description: 'In-app alert history dropdown', status: 'b3-c1', priority: 'medium', storyPoints: 8, labels: ['feature'], createdAt: subDays(now, 7).toISOString(), updatedAt: subDays(now, 7).toISOString() },
  { id: 't30', boardId: 'b3', title: 'AI Recommendation Engine', description: 'Explore OpenAI integrations for task tagging', status: 'b3-c1', priority: 'low', assignee: mockUsers[0], storyPoints: 21, labels: ['ai'], createdAt: subDays(now, 6).toISOString(), updatedAt: subDays(now, 6).toISOString() }
];

// Generate 30+ Activities
export let mockActivities: ActivityItem[] = [
  { id: 'a1', type: 'MOVED', message: 'moved', targetTaskTitle: 'JWT Authentication', actor: mockUsers[0], timestamp: subHours(now, 5).toISOString() },
  { id: 'a2', type: 'COMPLETED', message: 'completed', targetTaskTitle: 'Database Schema', actor: mockUsers[1], timestamp: subDays(now, 2).toISOString() },
  { id: 'a3', type: 'UPDATED', message: 'updated', targetTaskTitle: 'Landing Page Copy', actor: mockUsers[2], timestamp: subDays(now, 2).toISOString() },
  { id: 'a4', type: 'CREATED', message: 'created task', targetTaskTitle: 'AI Recommendation Engine', actor: mockUsers[0], timestamp: subDays(now, 6).toISOString() },
  { id: 'a5', type: 'ASSIGNED', message: 'assigned to', targetTaskTitle: 'Advanced Search Design', actor: mockUsers[2], timestamp: subDays(now, 8).toISOString() },
  { id: 'a6', type: 'MOVED', message: 'moved', targetTaskTitle: 'Configure MSW', actor: mockUsers[0], timestamp: subDays(now, 3).toISOString() },
  { id: 'a7', type: 'CREATED', message: 'created task', targetTaskTitle: 'Setup React Query', actor: mockUsers[2], timestamp: subDays(now, 7).toISOString() },
  { id: 'a8', type: 'UPDATED', message: 'updated priority on', targetTaskTitle: 'Subscription Flow Improvements', actor: mockUsers[1], timestamp: subHours(now, 4).toISOString() },
  { id: 'a9', type: 'COMPLETED', message: 'completed', targetTaskTitle: 'User Feedback Analysis', actor: mockUsers[1], timestamp: subDays(now, 10).toISOString() },
  { id: 'a10', type: 'MOVED', message: 'moved', targetTaskTitle: 'Feature Prioritization', actor: mockUsers[0], timestamp: subDays(now, 5).toISOString() },
  { id: 'a11', type: 'CREATED', message: 'created task', targetTaskTitle: 'Mobile App Strategy', actor: mockUsers[2], timestamp: subDays(now, 12).toISOString() },
  { id: 'a12', type: 'ASSIGNED', message: 'assigned to', targetTaskTitle: 'Ad Creative Review', actor: mockUsers[0], timestamp: subHours(now, 12).toISOString() },
  { id: 'a13', type: 'COMPLETED', message: 'completed', targetTaskTitle: 'SEO Keyword Research', actor: mockUsers[1], timestamp: subDays(now, 4).toISOString() },
  { id: 'a14', type: 'MOVED', message: 'moved', targetTaskTitle: 'Social Media Calendar', actor: mockUsers[1], timestamp: subDays(now, 3).toISOString() },
  { id: 'a15', type: 'CREATED', message: 'created task', targetTaskTitle: 'Influencer Outreach', actor: mockUsers[0], timestamp: subDays(now, 7).toISOString() },
  { id: 'a16', type: 'UPDATED', message: 'added story points to', targetTaskTitle: 'Build Workspace Switcher', actor: mockUsers[1], timestamp: subDays(now, 1).toISOString() },
  { id: 'a17', type: 'MOVED', message: 'moved', targetTaskTitle: 'Setup CI/CD Pipeline', actor: mockUsers[0], timestamp: subDays(now, 2).toISOString() },
  { id: 'a18', type: 'CREATED', message: 'created task', targetTaskTitle: 'Optimize Board Rendering', actor: mockUsers[0], timestamp: subDays(now, 3).toISOString() },
  { id: 'a19', type: 'ASSIGNED', message: 'assigned to', targetTaskTitle: 'Implement Activity Feed', actor: mockUsers[2], timestamp: subDays(now, 4).toISOString() },
  { id: 'a20', type: 'MOVED', message: 'moved', targetTaskTitle: 'Create Public Board Page', actor: mockUsers[1], timestamp: subDays(now, 5).toISOString() },
  { id: 'a21', type: 'CREATED', message: 'created task', targetTaskTitle: 'Add Role Based Access', actor: mockUsers[2], timestamp: subDays(now, 1).toISOString() },
  { id: 'a22', type: 'UPDATED', message: 'updated description of', targetTaskTitle: 'Email Campaign Design', actor: mockUsers[0], timestamp: subDays(now, 8).toISOString() },
  { id: 'a23', type: 'MOVED', message: 'moved', targetTaskTitle: 'Campaign Analytics Dashboard', actor: mockUsers[2], timestamp: subDays(now, 4).toISOString() },
  { id: 'a24', type: 'CREATED', message: 'created task', targetTaskTitle: 'Product Launch Announcement', actor: mockUsers[2], timestamp: subDays(now, 2).toISOString() },
  { id: 'a25', type: 'ASSIGNED', message: 'assigned to', targetTaskTitle: 'Newsletter Setup', actor: mockUsers[1], timestamp: subDays(now, 1).toISOString() },
  { id: 'a26', type: 'COMPLETED', message: 'completed', targetTaskTitle: 'Public API Planning', actor: mockUsers[0], timestamp: subDays(now, 13).toISOString() },
  { id: 'a27', type: 'MOVED', message: 'moved', targetTaskTitle: 'Analytics Tracking', actor: mockUsers[0], timestamp: subDays(now, 10).toISOString() },
  { id: 'a28', type: 'CREATED', message: 'created task', targetTaskTitle: 'Team Permissions System', actor: mockUsers[1], timestamp: subDays(now, 9).toISOString() },
  { id: 'a29', type: 'UPDATED', message: 'updated priority on', targetTaskTitle: 'Notification Center', actor: mockUsers[2], timestamp: subDays(now, 7).toISOString() },
  { id: 'a30', type: 'ASSIGNED', message: 'assigned to', targetTaskTitle: 'Design Database Schema', actor: mockUsers[1], timestamp: subDays(now, 10).toISOString() }
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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
export const addMockActivity = (activity: ActivityItem) => {
  mockActivities.unshift(activity);
}
