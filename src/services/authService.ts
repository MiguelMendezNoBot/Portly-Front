const BASE_URL = "http://localhost:8080"

interface RegisterData {
    nombre: string
    apellido: string
    profesion: string
    correoElectronico: string
    biografia: string
    contrasena: string
    confirmarContrasena: string
}
export const registerUser = async (data: RegisterData) => {
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