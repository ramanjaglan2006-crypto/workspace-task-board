import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 border-2 border-primary rounded-lg h-32 bg-primary/5"
      />
    );
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onClick(task)}>
      <Card className="cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors shadow-sm">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-medium text-sm leading-tight line-clamp-2">{task.title}</h4>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
            <Badge variant="outline" className={`border-transparent text-[10px] uppercase font-bold px-1.5 py-0 ${priorityColors[task.priority]}`}>
              {task.priority}
            </Badge>
            <div className="flex items-center gap-2">
              {task.assignee && (
                <Avatar src={task.assignee.avatar} fallback={task.assignee.name[0]} className="h-6 w-6 text-[10px]" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
