import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { LoginPage } from './pages/LoginPage';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      {}
      <LoginPage />
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}