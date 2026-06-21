import React from 'react';
import { useParams } from 'react-router-dom';
import { usePublicBoard } from '@/hooks/queries';
import { Helmet } from 'react-helmet-async';
import { Loader2, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const PublicBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePublicBoard(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || !data.board) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20">
        <h1 className="text-2xl font-bold">Board not found</h1>
        <p className="text-muted-foreground mt-2">This board might be private or doesn't exist.</p>
      </div>
    );
  }

  const { board, tasks } = data;

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-muted/20 text-foreground flex flex-col">
      <Helmet>
        <title>{board.name} | Public TaskBoard</title>
        <meta name="description" content={`Public view of the ${board.name} task board.`} />
        <meta property="og:title" content={`${board.name} | Public TaskBoard`} />
        <meta property="og:description" content={`View tasks and progress for ${board.name}.`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": board.name,
            "description": `Public task board for ${board.name}`,
            "itemListElement": tasks.map((task, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Thing",
                "name": task.title,
                "description": task.description || "",
              }
            }))
          })}
        </script>
      </Helmet>

      <header className="flex h-14 items-center gap-4 border-b bg-background px-6 shadow-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Layers size={18} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">{board.name}</h1>
        <Badge variant="secondary" className="ml-2 pointer-events-none">Public View</Badge>
      </header>

      <main className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 h-full items-start">
          {board.columns.map(col => {
            const columnTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="flex flex-col h-[calc(100vh-8rem)] w-80 shrink-0 bg-background/50 rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b bg-muted/30">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    {col.title}
                    <span className="bg-background text-muted-foreground text-xs px-2 py-0.5 rounded-full border">
                      {columnTasks.length}
                    </span>
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                  {columnTasks.map(task => (
                    <Card key={task.id} className="shadow-sm">
                      <CardContent className="p-4 flex flex-col gap-3">
                        <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                        )}
                        <div className="mt-auto pt-2 border-t border-border/50">
                          <Badge variant="outline" className={`border-transparent text-[10px] uppercase font-bold px-1.5 py-0 ${priorityColors[task.priority]}`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
