import { Link } from "react-router-dom"
import { Input } from "../../../components/Input"
import { useLoginForm } from "../hooks/useLoginForm"
import { useState } from "react"

export const LoginForm = () => {
    const { fields, errors, toast, handleChange, handleSubmit } = useLoginForm()
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="w-[85%] sm:w-full max-w-sm mx-auto px-5 sm:px-8 py-6 bg-white rounded-[35px] relative">

            {toast && (
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-[90%] text-center text-sm px-4 py-2 rounded-lg text-white shadow-lg z-50
                    ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}

            <div className="pb-4 text-center">
                <h1 className="font-bold text-3xl tracking-tight">Bienvenido de nuevo</h1>
                <h2 className="text-gray-500 font-thin text-[13px] mt-1">
                    Ingresa en la plataforma con tus redes profesionales
                </h2>
            </div>

            {/* Botones sociales */}
            <button type="button" className="mt-2 w-full py-2 rounded-xl text-black font-medium border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" />
                Continua con Google
            </button>

            <div className="flex gap-3 mt-3">
                <button type="button" className="flex-1 py-2 rounded-xl text-black font-medium border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    {/* GitHub icon */}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                    </svg>
                    GitHub
                </button>
                <button type="button" className="flex-1 py-2 rounded-xl text-black font-medium border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    {/* LinkedIn icon */}
                    <svg className="w-4 h-4 text-[#0A66C2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                </button>
            </div>

            {/* Separador */}
            <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-[11px] font-medium tracking-widest">INICIO DE SESION</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <Input
                    label="Correo Electrónico" type="email" placeholder="nombre@dominio.com"
                    value={fields.email} onChange={handleChange('email')} error={errors.email}
                />

                {/* Contraseña con ojo y link */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center mt-3">
                        <label className="text-black text-[13.5px] font-semibold">Contraseña</label>
                        <span className="text-[#6C63FF] text-[11px] cursor-pointer hover:underline">
                            ¿Olvidaste tu contraseña?
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={fields.password}
                            onChange={handleChange('password')}
                            className={`w-full text-xs px-2 pt-2 pb-1 border rounded-xl outline-none pr-8 ${errors.password ? 'border-red-400' : 'border-gray-400'}`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && <span className="text-red-500 text-[11px]">{errors.password}</span>}
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full py-2 rounded-lg text-white font-medium bg-[#6C63FF] hover:bg-[#5a52d5] transition-colors"
                >
                    Iniciar Sesión
                </button>

                <div className="text-center mt-4">
                    <span className="text-gray-500 text-sm">¿Nuevo en la plataforma? </span>
                    <Link to="/auth/register" className="text-[#6C63FF] font-medium text-sm hover:underline">
                        Crea una cuenta
                    </Link>
                </div>
            </form>
        </div>
    )
}