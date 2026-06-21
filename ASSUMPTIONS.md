# Assumptions & Trade-offs

1. **Authentication**: Assumed the user is fully trusted after login. MSW handles auth via simple token verification.
2. **Data Model**: Assumed tasks can be dragged freely between columns (status changes). Story points and due dates are optional, but the UI expects a basic priority (low/medium/high) for all tasks.
3. **Caching**: Configured `staleTime` with the assumption that workspaces change rarely, boards change occasionally, and tasks change frequently.
4. **Offline Mode**: The offline mode relies on `localStorage` size limits (~5MB). Given the mock data scale, this is perfectly adequate. Heavy offline operations (mutations while offline) are not currently queued to a sync layer, but rather rely on optimistic updates that might fail if reloaded.
5. **Prefetching**: Assumed aggressive prefetching on hover/focus is desired. For a massive enterprise application, this could cause network spam, but React Query deduplicates and caches these requests making it extremely safe and performant for this scale.
