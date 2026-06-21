import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { Loader2, Activity, Plus, Edit2, Trash2, ArrowRightLeft, UserPlus, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { ActivityItem, ActivityType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'CREATED': return <Plus size={14} className="text-blue-500" />;
    case 'UPDATED': return <Edit2 size={14} className="text-yellow-500" />;
    case 'DELETED': return <Trash2 size={14} className="text-red-500" />;
    case 'MOVED': return <ArrowRightLeft size={14} className="text-purple-500" />;
    case 'ASSIGNED': return <UserPlus size={14} className="text-orange-500" />;
    case 'COMPLETED': return <CheckCircle2 size={14} className="text-green-500" />;
    default: return <Activity size={14} className="text-muted-foreground" />;
  }
};

export const ActivityFeed = () => {
  const [activities, setActivities] = React.useState<ActivityItem[]>([]);

  // We use useQuery with refetchInterval to poll for new activities
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['activityFeed'],
    queryFn: () => apiClient<ActivityItem>('/activity'),
    refetchInterval: 15000, // Poll every 15 seconds
  });

  useEffect(() => {
    if (data) {
      setActivities(prev => {
        // Prevent duplicates if data is stale but returned again
        if (prev.some(a => a.id === data.id)) return prev;
        return [data, ...prev].slice(0, 50); // Keep last 50
      });
    }
  }, [data]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b p-4 font-semibold">
        <Activity size={18} className="text-primary" />
        <h3>Activity Feed</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && activities.length === 0 ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isError && activities.length === 0 ? (
          <ErrorState title="Feed unavailable" message="Couldn't load recent activity." onRetry={() => refetch()} />
        ) : activities.length === 0 ? (
          <EmptyState title="No recent activity" description="Check back later for updates." />
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 rounded-lg border bg-background p-3 text-sm shadow-sm transition-all hover:shadow-md animate-in slide-in-from-top-2">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-foreground leading-tight">{activity.message}</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
