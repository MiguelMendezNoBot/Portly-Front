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
import { VisibilityPage } from '../modules/profile/presentation/pages/VisibilityPage';
import { IntegrationsPage } from '../modules/profile/presentation/pages/IntegrationsPage';
import { CompleteProfilePage } from '../modules/auth/presentation/pages/CompleteProfilePage';
import AuthenticatedLayout from '../shared/components/layouts/AuthenticatedLayout';
import ProfessionalProfilePage from '../modules/professional/presentation/pages/ProfessionalProfilePage';
import ProfessionalsPage from '../modules/professionals/presentation/pages/ProfessionalsPage';
import PublicProfessionalDetailPage from '../modules/professionals/presentation/pages/PublicProfessionalDetailPage';
import PortfoliosPage from '../modules/portfolios/presentation/pages/PortfoliosPage';
import PortfolioPublicPage from '../modules/portfolios/presentation/pages/PortfolioPublicPage';
import ExplorePage from '../modules/explore/presentation/pages/ExplorePage';
import AnalyticsPage from '../modules/analytics/presentation/pages/AnalyticsPage';
import { AdminLayout } from '../modules/admin/presentation/layouts/AdminLayout';
import { ReportsPage } from '../modules/admin/presentation/pages/ReportsPage';
import { AdminPlaceholderPage } from '../modules/admin/presentation/pages/AdminPlaceholderPage';
import { DashboardPage } from '../modules/admin/presentation/pages/DashboardPage';
import { UsersPage } from '../modules/admin/presentation/pages/UsersPage';
import { ComplaintPage } from '../modules/admin/presentation/pages/ComplaintPage';
import { ComplaintDetailPage } from '../modules/admin/presentation/components/complaint/ComplaintDetailPage';
import { SuspendedUsersPage } from '../modules/admin/presentation/pages/SuspendedUsersPage';

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
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/portfolios" element={<PortfoliosPage />} />
          <Route path="/professional-profile" element={<ProfileCompleteRoute element={<ProfessionalProfilePage />} />} />
          <Route path="/visibility" element={<ProfileCompleteRoute element={<VisibilityPage />} />} />
          <Route path="/integrations" element={<ProfileCompleteRoute element={<IntegrationsPage />} />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="usuarios" element={<UsersPage />} />
          <Route path="denuncias" element={<ComplaintPage />} />
          <Route path="denuncias/:id/revisar" element={<ComplaintDetailPage />} />
          <Route path="suspendidos" element={<SuspendedUsersPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="configuracion" element={<AdminPlaceholderPage title="Configuración" />} />
        </Route>

        <Route path="/profesionales" element={<ProfessionalsPage />} />
        <Route path="/profesionales/:id" element={<PublicProfessionalDetailPage />} />

        {/* Portafolio renderizado (Público) */}
        <Route path="/p/:portfolioId" element={<PortfolioPublicPage />} />

        {/* Explorar portafolios (Público, integrado en HomePage) */}
        <Route path="/explorar" element={<HomePage />} />
        <Route path="/explorar/:portfolioId" element={<HomePage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
