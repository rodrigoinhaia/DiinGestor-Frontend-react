import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/contexts/QueryProvider';
import { router } from '@/router';
import { Toaster } from 'sonner';

function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </QueryProvider>
  );
}

export default App;
