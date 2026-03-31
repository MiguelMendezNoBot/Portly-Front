import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LoginPage  from './pages/LoginPage';
import {RegisterPage } from './pages/RegisterPage'; // 1. Importamos tu página de registro
import { AuthCallbackPage } from './pages/AuthCallbackPage';

const path = window.location.pathname;

const App = () => {
  // 2. Agregamos la condición para la ruta de registro
  if (path === '/register') {
    return <RegisterPage />;
  }
  
  if (path === '/auth/callback') {
    return <AuthCallbackPage />;
  }
  
  // 3. Por defecto, si pones '/' o cualquier otra cosa, muestra el Login
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