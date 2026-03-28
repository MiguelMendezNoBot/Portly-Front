import type { RegisterData, LoginData, AuthResponse } from "../features/auth/types/authTypes"
const BASE_URL = import.meta.env.VITE_API_URL

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