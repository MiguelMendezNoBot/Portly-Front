import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {RegisterPage} from './pages/RegisterPage';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RegisterPage />
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
