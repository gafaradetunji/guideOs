import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/router';
import { MockDataProvider } from '@/mock/MockDataProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MockDataProvider>
      {/* Routes */}
      <RouterProvider router={router} />
    </MockDataProvider>
  </StrictMode>
);
