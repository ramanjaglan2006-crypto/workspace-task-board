import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface BoardToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: string;
  onPriorityChange: (priority: string) => void;
}

export const BoardToolbar = ({ searchQuery, onSearchChange, priorityFilter, onPriorityChange }: BoardToolbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 px-6 py-4 border-b bg-muted/20">
      <div className="relative flex-1 w-full max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search tasks..."
          className="pl-9 bg-background w-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          <option value="ALL">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>
    </div>
  );
};
