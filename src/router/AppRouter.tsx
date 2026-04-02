import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { RegisterPage } from "../pages/RegisterPage"
import { LoginPage } from "../pages/LoginPage"
import { AuthCallbackPage } from "../pages/AuthCallbackPage"
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage"
import { VerifyCodePage } from "../pages/VerifyCodePage"
import { NewPasswordPage } from "../pages/NewPasswordPage"
import { HomePage } from "../pages/HomePage"

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
            </Routes>
        </BrowserRouter>
    )
}