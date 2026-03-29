import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { LoginPage } from './pages/LoginPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';

const path = window.location.pathname;

const App = () => {
  if (path === '/auth/callback') {
    return <AuthCallbackPage />;
  }
  return <LoginPage />;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}