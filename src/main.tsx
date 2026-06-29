import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { MockDataProvider } from './mock/MockDataProvider.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MockDataProvider>
      <App />
    </MockDataProvider>
  </StrictMode>
);
