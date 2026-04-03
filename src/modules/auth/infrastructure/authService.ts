import type { RegisterData, LoginData, AuthResponse } from "../domain/authTypes"

const BASE_URL = import.meta.env.VITE_API_URL  // ← usas la tuya, no el hardcodeado

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    const json = await response.json()
    if (!response.ok) {
        throw { status: response.status, message: json.message }
    }
    return json
}

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    const json = await response.json()
    if (!response.ok) {
        throw { status: response.status, message: json.message }
    }
    return json
}

export const forgotPassword = async (email: string) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })
    const json = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw { status: response.status, message: json.message || 'No se encontró una cuenta con este correo.' }
    }
    return json
}

export const verifyCode = async (email: string, codigo: string) => {
    const response = await fetch(`${BASE_URL}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo }),
    })
    const json = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw { status: response.status, message: json.message || 'El código es incorrecto o ha expirado.' }
    }
    return json
}

export const resetPassword = async (email: string, codigo: string, nuevaPassword: string) => {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo, nuevaPassword }),
    })
    const json = await response.json().catch(() => ({}))
    if (!response.ok) {
        throw { status: response.status, message: json.message || 'Error al cambiar la contraseña.' }
    }
    return json
}