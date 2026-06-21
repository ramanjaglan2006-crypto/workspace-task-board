import React, { useMemo } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Column, Task } from '@/types';
import { TaskCard } from '@/features/tasks/TaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
}

export const ColumnComponent = React.memo(({ column, tasks, onTaskClick, onAddTask }: ColumnProps) => {
  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  return (
    <div className="flex flex-col h-full w-80 shrink-0 bg-muted/40 rounded-xl border border-border/50 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b bg-muted/20">
        <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
          {column.title}
          <span className="bg-background text-muted-foreground text-xs px-2 py-0.5 rounded-full border">
            {tasks.length}
          </span>
        </h3>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => onAddTask(column.id)}>
          <Plus size={16} />
        </Button>
      </div>
      
      <div 
        ref={setNodeRef} 
        className={`flex-1 overflow-y-auto p-3 flex flex-col gap-3 transition-colors ${isOver ? 'bg-primary/5' : ''}`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="h-20 border-2 border-dashed border-border/60 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
});
