import type { ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegisterPage } from '../modules/auth/presentation/pages/RegisterPage';
import LoginPage from '../modules/auth/presentation/pages/LoginPage';
import { AuthCallbackPage } from '../modules/auth/presentation/pages/AuthCallbackPage';
import { OAuthCallbackRedirectPage } from '../modules/auth/presentation/pages/OAuthCallbackRedirectPage';
import { ForgotPasswordPage } from '../modules/auth/presentation/pages/ForgotPasswordPage';
import { VerifyCodePage } from '../modules/auth/presentation/pages/VerifyCodePage';
import { NewPasswordPage } from '../modules/auth/presentation/pages/NewPasswordPage';
import { HomePage } from '../modules/home/presentation/pages/HomePage';
import { UserProfilePage } from '../modules/profile/presentation/pages/UserProfilePage';
import { CompleteProfilePage } from '../modules/auth/presentation/pages/CompleteProfilePage';
import AuthenticatedLayout from '../shared/components/layouts/AuthenticatedLayout';
import ProfessionalProfilePage from '../modules/professional/presentation/pages/ProfessionalProfilePage';
import ProfessionalsPage from '../modules/professionals/presentation/pages/ProfessionalsPage';
import PublicProfessionalDetailPage from '../modules/professionals/presentation/pages/PublicProfessionalDetailPage';

const getTokenPayload = (): Record<string, unknown> | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

// Requiere token Y perfilCompleto = true
const ProfileCompleteRoute = ({ element }: { element: ReactElement }) => {
  const payload = getTokenPayload();
  if (!payload) return <Navigate to="/login" replace />;
  if (payload.perfilCompleto === false) return <Navigate to="/complete-profile" replace />;
  return element;
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/auth/github/callback" element={<OAuthCallbackRedirectPage provider="github" />} />
        <Route path="/auth/linkedin/callback" element={<OAuthCallbackRedirectPage provider="linkedin" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        <Route path="/reset-password" element={<NewPasswordPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />

        <Route path="/profile" element={<ProfileCompleteRoute element={<UserProfilePage />} />} />

        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<div className="text-white p-8">dashboard</div>} />
          <Route path="/analytics" element={<div className="text-white p-8">analytics</div>} />
          <Route path="/portfolios" element={<div className="text-white p-8">portfolios</div>} />
          <Route path="/professional-profile" element={<ProfileCompleteRoute element={<ProfessionalProfilePage />} />} />
        </Route>

        <Route path="/profesionales" element={<ProfessionalsPage />} />
        <Route path="/profesionales/:id" element={<PublicProfessionalDetailPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
