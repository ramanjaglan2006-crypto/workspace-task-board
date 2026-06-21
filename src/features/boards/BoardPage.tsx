import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { useBoard, useTasks } from '@/hooks/queries';
import { useUpdateTask } from '@/hooks/mutations';
import type { Task, Column } from '@/types';
import { ColumnComponent } from './ColumnComponent';
import { TaskCard } from '../tasks/TaskCard';
import { TaskModal } from '../tasks/TaskModal';
import { BoardToolbar } from './BoardToolbar';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { Share2 } from 'lucide-react';

export const BoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: board, isLoading: isLoadingBoard, isError: isErrorBoard, refetch: refetchBoard } = useBoard(id);
  const { data: serverTasks, isLoading: isLoadingTasks, isError: isErrorTasks, refetch: refetchTasks } = useTasks(id);
  const updateTask = useUpdateTask();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string>('');

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  React.useEffect(() => {
    if (serverTasks) setTasks(serverTasks);
  }, [serverTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const columnsId = useMemo(() => board?.columns.map(col => col.id) || [], [board]);

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const overIndex = tasks.findIndex(t => t.id === overId);
        
        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setTasks(tasks => {
        const activeIndex = tasks.findIndex(t => t.id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex].status = overId as string;
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const previousTask = activeTask;
    setActiveTask(null);
    
    if (!over || !previousTask) return;
    
    const activeTaskData = tasks.find(t => t.id === active.id);
    if (activeTaskData && activeTaskData.status !== previousTask.status) {
       updateTask.mutate({ id: activeTaskData.id, updates: { status: activeTaskData.status }, boardId: board.id });
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (task.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setTargetColumnId(task.status);
    setIsModalOpen(true);
  };

  const handleAddTask = (columnId: string) => {
    setEditingTask(null);
    setTargetColumnId(columnId);
    setIsModalOpen(true);
  };

  if (isLoadingBoard || isLoadingTasks) {
    return (
      <div className="flex h-full flex-col p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-6 h-full overflow-hidden">
          <Skeleton className="h-full min-h-[500px] w-80 rounded-lg shrink-0" />
          <Skeleton className="h-full min-h-[500px] w-80 rounded-lg shrink-0" />
          <Skeleton className="h-full min-h-[500px] w-80 rounded-lg shrink-0" />
        </div>
      </div>
    );
  }

  if (isErrorBoard || isErrorTasks) {
    return <ErrorState title="Failed to load board" message="We couldn't load the board details." onRetry={() => { refetchBoard(); refetchTasks(); }} />;
  }

  if (!board) return <EmptyState title="Board not found" description="The board you are looking for does not exist or you do not have access." />;

  return (
    <div className="flex h-full flex-col">
      <Helmet>
        <title>{board.name} | TaskBoard</title>
      </Helmet>
      <div className="flex items-center justify-between border-b px-6 py-4 bg-background">
        <h1 className="text-2xl font-bold">{board.name}</h1>
        <Button variant="outline" size="sm" onClick={() => window.open(`/public/board/${board.id}`, '_blank')}>
          <Share2 size={16} className="mr-2" />
          Share Public Link
        </Button>
      </div>

      <BoardToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
      />

      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className="flex gap-6 h-full items-start">
            <SortableContext items={columnsId}>
              {board.columns.map(col => (
                <ColumnComponent
                  key={col.id}
                  column={col}
                  tasks={filteredTasks.filter(t => t.status === col.id)}
                  onTaskClick={handleTaskClick}
                  onAddTask={handleAddTask}
                />
              ))}
            </SortableContext>
          </div>
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} onClick={() => {}} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {isModalOpen && (
        <TaskModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          boardId={board.id}
          columnId={targetColumnId}
          task={editingTask}
        />
      )}
    </div>
  );
};
