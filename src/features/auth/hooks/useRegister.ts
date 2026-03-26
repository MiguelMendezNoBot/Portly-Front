    import { useState } from "react"

    interface FormErrors {
    nombre: string
    apellido: string
    profesion: string
    email: string
    password: string
    confirmPassword: string
    }

    interface FormValues {
    nombre: string
    apellido: string
    profesion: string
    email: string
    password: string
    confirmPassword: string
    }

    export const useRegister = () => {
    const [values, setValues] = useState<FormValues>({
        nombre: "",
        apellido: "",
        profesion: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState<FormErrors>({
        nombre: "",
        apellido: "",
        profesion: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const validateNombre = (value: string) => {
        if (value.trim().length === 0) return "No puede estar vacío"
        if (value.trim().length < 3) return "Mínimo 3 caracteres"
        if (value.length > 50) return "Máximo 50 caracteres"
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) return "Solo letras y espacios"
        return ""
    }

    const validateEmail = (value: string) => {
        if (value.trim().length === 0) return "No puede estar vacío"
        if (value.length > 320) return "Máximo 320 caracteres"
        if (/\s/.test(value)) return "No se permiten espacios"
        if (!/^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/.test(value))
        return "Correo inválido (ej: nombre@dominio.com)"
        return ""
    }

    const validatePassword = (value: string) => {
        if (value.trim().length === 0) return "No puede estar vacío"
        if (value.length < 8) return "Mínimo 8 caracteres"
        if (!/[A-Z]/.test(value)) return "Debe tener al menos una mayúscula"
        if (!/[a-z]/.test(value)) return "Debe tener al menos una minúscula"
        if (!/[0-9]/.test(value)) return "Debe tener al menos un número"
        if (!/[!#$*\-/~]/.test(value)) return "Debe tener al menos un símbolo (!,#,$,*,-,/,~)"
        return ""
    }

    const validateConfirmPassword = (value: string) => {
        if (value !== values.password) return "Las contraseñas no coinciden"
        return ""
    }

    const handleChange = (field: keyof FormValues) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setValues(prev => ({ ...prev, [field]: value }))

        const validators: Record<keyof FormValues, (v: string) => string> = {
            nombre: validateNombre,
            apellido: validateNombre,
            profesion: validateNombre,
            email: validateEmail,
            password: validatePassword,
            confirmPassword: validateConfirmPassword
        }

        setErrors(prev => ({ ...prev, [field]: validators[field](value) }))
        }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const newErrors = {
        nombre: validateNombre(values.nombre),
        apellido: validateNombre(values.apellido),
        profesion: validateNombre(values.profesion),
        email: validateEmail(values.email),
        password: validatePassword(values.password),
        confirmPassword: validateConfirmPassword(values.confirmPassword)
        }

        setErrors(newErrors)

        const hasErrors = Object.values(newErrors).some(e => e !== "")
        if (hasErrors) return

        console.log("Formulario válido, enviando...", values)
    }

    return { values, errors, handleChange, handleSubmit }
    }