import { http, HttpResponse, delay } from 'msw';
import { mockWorkspaces, mockBoards, mockTasks, mockUsers, addMockTask, updateMockTask, deleteMockTask } from './db';
import type { Task } from '@/types';

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    await delay(800);
    const body = (await request.json()) as any;
    if (body.email === 'raman@test.com' && body.password === 'password123') {
      return HttpResponse.json({
        token: 'mock-jwt-token-123',
        user: mockUsers[0]
      });
    }
    return new HttpResponse(null, { status: 401, statusText: 'Invalid credentials' });
  }),

  http.get('/api/workspaces', async () => {
    await delay(500);
    return HttpResponse.json(mockWorkspaces);
  }),

  http.get('/api/boards', async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const workspaceId = url.searchParams.get('workspaceId');
    if (!workspaceId) return new HttpResponse(null, { status: 400 });
    
    const boards = mockBoards.filter(b => b.workspaceId === workspaceId);
    return HttpResponse.json(boards);
  }),

  http.get('/api/board/:id', async ({ params }) => {
    await delay(500);
    const { id } = params;
    const board = mockBoards.find(b => b.id === id);
    if (!board) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(board);
  }),

  http.get('/api/public/board/:id', async ({ params }) => {
    await delay(500);
    const { id } = params;
    const board = mockBoards.find(b => b.id === id);
    if (!board) return new HttpResponse(null, { status: 404 });
    const tasks = mockTasks.filter(t => t.boardId === id);
    return HttpResponse.json({ board, tasks });
  }),

  http.get('/api/tasks', async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const boardId = url.searchParams.get('boardId');
    if (!boardId) return new HttpResponse(null, { status: 400 });
    
    const tasks = mockTasks.filter(t => t.boardId === boardId);
    return HttpResponse.json(tasks);
  }),

  http.post('/api/task', async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as any;
    const newTask: Task = {
      id: `t-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addMockTask(newTask);
    return HttpResponse.json(newTask);
  }),

  http.patch('/api/task/:id', async ({ params, request }) => {
    await delay(500);
    const { id } = params;
    const body = (await request.json()) as Partial<Task>;
    updateMockTask(id as string, { ...body, updatedAt: new Date().toISOString() });
    const updated = mockTasks.find(t => t.id === id);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/task/:id', async ({ params }) => {
    await delay(500);
    const { id } = params;
    deleteMockTask(id as string);
    return HttpResponse.json({ success: true });
  }),

  // Activity Feed polling endpoint
  http.get('/api/activity', async () => {
    const activities = [
      { type: 'MOVED', message: "Raman moved 'Configure MSW' from In Progress to Review" },
      { type: 'CREATED', message: "Raman created 'Implement Authentication'" },
      { type: 'ASSIGNED', message: "New task 'Setup Auth' assigned to Alice" },
      { type: 'COMPLETED', message: "Task 'Deploy to Prod' completed!" },
      { type: 'UPDATED', message: "Task 'Design Database' updated by Raman" },
    ];
    // Return a random activity and current time to simulate a feed
    const randomAct = activities[Math.floor(Math.random() * activities.length)];
    return HttpResponse.json({
      id: `act-${Date.now()}`,
      type: randomAct.type,
      message: randomAct.message,
      actor: mockUsers[0],
      timestamp: new Date().toISOString()
    });
  })
];
