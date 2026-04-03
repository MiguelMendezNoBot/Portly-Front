import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegisterPage } from '../modules/auth/presentation/pages/RegisterPage';
import LoginPage from '../modules/auth/presentation/pages/LoginPage';
import { AuthCallbackPage } from '../modules/auth/presentation/pages/AuthCallbackPage';
import { ForgotPasswordPage } from '../modules/auth/presentation/pages/ForgotPasswordPage';
import { VerifyCodePage } from '../modules/auth/presentation/pages/VerifyCodePage';
import { NewPasswordPage } from '../modules/auth/presentation/pages/NewPasswordPage';
import { HomePage } from '../modules/home/presentation/pages/HomePage';
import { UserProfilePage } from '../modules/profile/presentation/pages/UserProfilePage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        <Route path="/reset-password" element={<NewPasswordPage />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route
          path="/inicio"
          element={<div className="text-white p-8">Inicio</div>}
        />
        <Route
          path="/tablero"
          element={<div className="text-white p-8">Tablero</div>}
        />
        <Route
          path="/mis-portafolios"
          element={<div className="text-white p-8">Mis portafolios</div>}
        />
        <Route
          path="/analiticas"
          element={<div className="text-white p-8">Analíticas</div>}
        />
        <Route
          path="/perfil-profesional"
          element={<div className="text-white p-8">Perfil profesional</div>}
        />
      </Routes>
    </BrowserRouter>
  );
};
