import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Task } from '@/types';
import { useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/mutations';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  columnId: string;
  task?: Task | null; // if passed, we are viewing/editing
}

export const TaskModal = ({ isOpen, onClose, boardId, columnId, task }: TaskModalProps) => {
  const [mode, setMode] = React.useState<'create' | 'view' | 'edit'>('create');
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: columnId,
    }
  });

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setMode('view');
        reset({ title: task.title, description: task.description, priority: task.priority, status: task.status });
      } else {
        setMode('create');
        reset({ title: '', description: '', priority: 'medium', status: columnId });
      }
    }
  }, [isOpen, task, reset, columnId]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      if (task) {
        await updateTask.mutateAsync({ id: task.id, updates: data, boardId });
      } else {
        await createTask.mutateAsync({ ...data, boardId, status: columnId });
      }
      onClose();
    } catch (e) {
      alert("Error saving task");
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    try {
      await deleteTask.mutateAsync({ id: task.id, boardId });
      onClose();
    } catch (e) {
      alert("Error deleting task");
    }
  };

  const isViewing = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogHeader>
        <DialogTitle>
          {mode === 'create' ? 'Create Task' : mode === 'edit' ? 'Edit Task' : task?.title}
        </DialogTitle>
        {mode !== 'view' && (
          <DialogDescription>
            {mode === 'create' ? 'Add a new task to your board.' : 'Make changes to your task here.'}
          </DialogDescription>
        )}
      </DialogHeader>

      {isViewing && task ? (
        <div className="space-y-6 pt-4">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Description</h4>
            <p className="text-sm">{task.description || 'No description provided.'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-1">Status</h4>
              <p className="text-sm capitalize">{task.status}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-1">Priority</h4>
              <p className="text-sm capitalize">{task.priority}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-1">Assignee</h4>
              <p className="text-sm">{task.assignee?.name || 'Unassigned'}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-1">Dates</h4>
              <p className="text-xs text-muted-foreground">Created: {new Date(task.createdAt).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Updated: {new Date(task.updatedAt).toLocaleString()}</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <Button type="button" variant="destructive" onClick={() => setShowConfirmDelete(true)} className="mr-auto">
              Delete
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Close</Button>
            <Button type="button" onClick={() => setMode('edit')}>Edit Task</Button>
          </DialogFooter>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input {...register("title")} placeholder="Task title" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              {...register("description")} 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Input {...register("status")} placeholder="Column ID" readOnly={mode === 'create'} className="bg-muted" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <select 
                {...register("priority")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            {mode === 'edit' && (
              <Button type="button" variant="outline" onClick={() => setMode('view')} className="mr-auto">
                Cancel Edit
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>Close</Button>
            <Button type="submit" isLoading={isSubmitting || createTask.isPending || updateTask.isPending}>
              {mode === 'edit' ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      )}
      <ConfirmDialog
        open={showConfirmDelete}
        onOpenChange={setShowConfirmDelete}
        onConfirm={handleDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        isLoading={deleteTask.isPending}
      />
    </Dialog>
  );
};
