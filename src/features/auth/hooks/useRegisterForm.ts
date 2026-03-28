import { useState } from "react"
import { registerUser } from "../../../services/authService"
import { useToast } from "../../../hooks/useToast"
import { saveToken, saveUsuarioId } from "../../../utils/storage"

interface FormFields {
    nombre: string
    apellido: string
    profesion: string
    email: string
    biografia: string
    password: string
    confirmPassword: string
}

interface FormErrors {
    nombre?: string
    apellido?: string
    profesion?: string
    email?: string
    password?: string
    confirmPassword?: string
}

const onlyLeters = /^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ]+([a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]*[a-záéíóúüñA-ZÁÉÍÓÚÜÑ])?$/
const emailValidation = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/
const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$*\-/~]).{8,}$/

const validateAlphaField = (value: string, fieldName: string): string | undefined => {
    if (!value.trim()) return `${fieldName} es obligatorio`
    if (value.trim().length < 3) return `${fieldName} debe tener al menos 3 caracteres`
    if (value.trim().length > 50) return `${fieldName} no puede superar 50 caracteres`
    if (!onlyLeters.test(value.trim())) return `${fieldName} solo acepta letras y espacios`
    return undefined
}

const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return "El correo es obligatorio"
    if (value.length > 320) return "El correo no puede superar 320 caracteres"
    if (/\s/.test(value)) return "El correo no puede contener espacios"
    if (!emailValidation.test(value)) return "Ingresa un correo válido (ej: nombre@dominio.com)"
    return undefined
}

const validatePassword = (value: string): string | undefined => {
    if (!value) return "La contraseña es obligatoria"
    if (!passwordValidation.test(value)) {
        return "Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo (!#$*-/~)"
    }
    return undefined
}

export const useRegisterForm = () => {
    const [fields, setFields] = useState<FormFields>({
        nombre: "", apellido: "", profesion: "",biografia:"",
        email: "", password: "", confirmPassword: ""
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const { toast, showToast } = useToast()

    const handleChange = (field: keyof FormFields) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFields(prev => ({ ...prev, [field]: e.target.value }))
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }

    const validate = (): boolean => {
        const newErrors: FormErrors = {
            nombre: validateAlphaField(fields.nombre, "El nombre"),
            apellido: validateAlphaField(fields.apellido, "El apellido"),
            profesion: validateAlphaField(fields.profesion, "La profesión"),
            email: validateEmail(fields.email),
            password: validatePassword(fields.password),
            confirmPassword: !fields.confirmPassword
            ? "Confirma tu contraseña"
            : fields.confirmPassword !== fields.password
            ? "Las contraseñas no coinciden"
            : undefined
        }
        setErrors(newErrors)
        return Object.values(newErrors).every(e => e === undefined)
    }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
        showToast("Por favor corrige los errores del formulario", "error")
        return
    }

    try {
        const data = await registerUser({
            nombre: fields.nombre.trim(),
            apellido: fields.apellido.trim(),
            profesion: fields.profesion.trim(),
            correoElectronico: fields.email.trim(),
            biografia: fields.biografia?.trim() ?? "",
            contrasena: fields.password,
            confirmarContrasena: fields.confirmPassword
        })

        saveToken(data.token)
        saveUsuarioId(data.usuarioId) 
        showToast("¡Cuenta creada exitosamente!", "success")

    } catch (error: any) {
        if (error.status === 409 || error.message?.toLowerCase().includes("correo")) {
            setErrors(prev => ({ ...prev, email: "Este correo ya está registrado" }))
        }
        showToast(error.message ?? "Error al registrarse, intenta de nuevo", "error")
    }
}

    return { fields, errors, toast, handleChange, handleSubmit }
}