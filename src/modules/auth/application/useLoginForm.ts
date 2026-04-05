import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {loginUser} from "../infrastructure/authService"
import { useToast } from "../../../shared/hooks/useToast"
import { saveToken, saveUsuarioId, saveEmail } from "../../../infrastructure/storage/storage"

interface FormFields {
    email: string
    password: string
}

interface FormErrors {
    email?: string
    password?: string
}

export const useLoginForm = () => {
    const navigate = useNavigate()
    const [fields, setFields] = useState<FormFields>({ email: "", password: "" })
    const [errors, setErrors] = useState<FormErrors>({})
    const { toast, showToast } = useToast()

    const handleChange = (field: keyof FormFields) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setFields(prev => ({ ...prev, [field]: e.target.value }))
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    const validate = (): boolean => {
        const newErrors: FormErrors = {
            email: !fields.email.trim() ? "El correo es obligatorio" : undefined,
            password: !fields.password ? "La contraseña es obligatoria" : undefined
        }
        setErrors(newErrors)
        return Object.values(newErrors).every(e => e === undefined)
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        try {
            const data = await loginUser({
                correoElectronico: fields.email.trim(),
                contraseña: fields.password
            })
            saveToken(data.token)
            saveUsuarioId(data.idUsuario)
            saveEmail(data.email)
            showToast("¡Bienvenido!", "success")
            setTimeout(() => navigate("/"), 1500)
        } catch (error: any) {
            showToast("Credenciales inválidas", "error")
        }
    }
    return { fields, errors, toast, handleChange, handleSubmit }
}