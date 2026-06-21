import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { HelmetProvider } from 'react-helmet-async';
import { useAuthStore } from './store/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';

// Layouts & Pages
import { AppLayout } from './layouts/AppLayout';
import { LoginPage } from './features/auth/LoginPage';
import { BoardPage } from './features/boards/BoardPage';
import { PublicBoardPage } from './features/boards/PublicBoardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours global default
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) {
    const redirectUrl = encodeURIComponent(window.location.pathname);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }
  return children;
};

function App() {
  return (
    <HelmetProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: 1000 * 60 * 60 * 24, // 24 hours persist expiry
        }}
      >
        <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/public/board/:id" element={<PublicBoardPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<div className="p-8">Select a board from the sidebar to get started.</div>} />
                  <Route path="board/:id" element={<BoardPage />} />
                </Route>
              </Routes>
            </ErrorBoundary>
        </BrowserRouter>
      </PersistQueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
