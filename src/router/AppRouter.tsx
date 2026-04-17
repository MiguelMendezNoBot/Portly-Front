import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RegisterPage } from '../modules/auth/presentation/pages/RegisterPage';
import LoginPage from '../modules/auth/presentation/pages/LoginPage';
import { AuthCallbackPage } from '../modules/auth/presentation/pages/AuthCallbackPage';
import { ForgotPasswordPage } from '../modules/auth/presentation/pages/ForgotPasswordPage';
import { VerifyCodePage } from '../modules/auth/presentation/pages/VerifyCodePage';
import { NewPasswordPage } from '../modules/auth/presentation/pages/NewPasswordPage';
import { HomePage } from '../modules/home/presentation/pages/HomePage';
import { UserProfilePage } from '../modules/profile/presentation/pages/UserProfilePage';
import { CompleteProfilePage } from '../modules/auth/presentation/pages/CompleteProfilePage';
import AuthenticatedLayout from '../shared/components/layouts/AuthenticatedLayout';
import ProfessionalProfilePage from "../modules/professional/presentation/pages/ProfessionalProfilePage"

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" replace />;
};

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
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/profile" element={<PrivateRoute element={<UserProfilePage />} />} />
        {/* Rutas autenticadas con layout compartido */}
        <Route element={<AuthenticatedLayout />}>
          <Route path="/dashboard" element={<div className="text-white p-8">dashboard</div>} />
          <Route path="/analytics" element={<div className="text-white p-8">analytics</div>} />
          <Route path="/portfolios" element={<div className="text-white p-8">portfolios</div>} />
          <Route path="/professional-profile" element={<ProfessionalProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
