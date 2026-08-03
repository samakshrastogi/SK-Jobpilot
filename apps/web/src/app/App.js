import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppRoutes } from '../routes/app-routes';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
export function App() {
  return _jsx(QueryClientProvider, {
    client: queryClient,
    children: _jsxs(BrowserRouter, {
      children: [
        _jsx(AppRoutes, {}),
        _jsx(Toaster, { theme: 'dark', position: 'bottom-right', richColors: true }),
      ],
    }),
  });
}
//# sourceMappingURL=App.js.map
