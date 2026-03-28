import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// Importamos la página de Login que acabamos de crear
import { LoginPage } from './pages/LoginPage';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      {/* Mostramos el Login */}
      <LoginPage />
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}