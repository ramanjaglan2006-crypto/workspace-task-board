import { useAuthStore } from '@/store/authStore';

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const authState = useAuthStore.getState();
  const token = authState.token;
  const loginAt = authState.loginAt;

  if (token && loginAt && Date.now() - loginAt > 5 * 60 * 1000) {
    authState.logout();
    alert("Session expired. Please login again.");
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    throw new Error("Session expired");
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`/api${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = `API error: ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.message) errorMsg = errorJson.message;
    } catch {
      // Not JSON
    }
    throw new Error(errorMsg);
  }
  return response.json();
};
