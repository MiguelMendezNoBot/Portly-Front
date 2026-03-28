import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { RegisterPage } from "../pages/RegisterPage"
import { LoginPage } from "../pages/LoginPage"

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/auth/login" />} />
            </Routes>
        </BrowserRouter>
    )
}