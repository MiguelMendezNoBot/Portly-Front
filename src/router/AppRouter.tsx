import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { RegisterPage } from "../pages/RegisterPage"
import { LoginPage } from "../pages/LoginPage"
import { AuthCallbackPage } from "../pages/AuthCallbackPage"
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage"
import { VerifyCodePage } from "../pages/VerifyCodePage"
import { NewPasswordPage } from "../pages/NewPasswordPage"

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/auth/verify-code" element={<VerifyCodePage />} />
                <Route path="/auth/reset-password" element={<NewPasswordPage />} />
                <Route path="*" element={<Navigate to="/auth/login" />} />
            </Routes>
        </BrowserRouter>
    )
}