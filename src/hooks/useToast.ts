import { useState } from "react"

interface Toast {
    message: string
    type: "success" | "error"
}

export const useToast = () => {
    const [toast, setToast] = useState<Toast | null>(null)
    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type })
        setTimeout(() => setToast(null), 3500)
    }
    return { toast, showToast }
}