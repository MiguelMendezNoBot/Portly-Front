import {Input} from '../../../components/Input'
import { useRegisterForm } from '../hooks/useRegisterForm'

export const RegisterForm = () => {
    const { fields, errors, toast, handleChange, handleSubmit } = useRegisterForm()
    return (
            <div className="w-[85%] sm:w-full max-w-sm mx-auto px-5 sm:px-8 py-6 bg-white rounded-[35px] relative">
            {toast && (
                <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-[90%] text-center text-sm px-4 py-2 rounded-lg text-white shadow-lg transition-all z-50
                    ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toast.message}
                </div>
            )}
            <div className="pb-2 text-center">
                <h1 className="font-bold text-3xl">Crea tu cuenta</h1>
                <h2 className="text-gray-500 font-thin text-[13px]">Regístrate en el sistema, mediante el siguiente formulario</h2>
            </div>
            <form onSubmit={handleSubmit} noValidate>
                <div className='flex flex-col sm:gap-5 sm:flex-row'>
                    <div className='flex-1'>
                        <Input label="Nombre" type="text" placeholder="Nombre" value={fields.nombre} onChange={handleChange('nombre')} error={errors.nombre} />
                    </div>
                    <div className='flex-1'>
                        <Input label="Apellido" type="text" placeholder="Apellido" value={fields.apellido} onChange={handleChange('apellido')} error={errors.apellido} />
                    </div>
                </div>
                <Input
                    label="Profesión" type="text" placeholder="Ej: Diseñador UI/UX"
                    value={fields.profesion} onChange={handleChange('profesion')} error={errors.profesion}
                />
                <Input
                    label="Correo electrónico" type="email" placeholder="nombre@dominio.com"
                    value={fields.email} onChange={handleChange('email')} error={errors.email}
                />
                <Input
                    label="Contraseña" type="password"
                    value={fields.password} onChange={handleChange('password')} error={errors.password}
                />
                <Input
                    label="Confirmar Contraseña" type="password"
                    value={fields.confirmPassword} onChange={handleChange('confirmPassword')} error={errors.confirmPassword}
                />
                <div>
                    <button
                        type="submit"
                        className="mt-6 w-full py-2 rounded-lg text-white font-medium bg-[#6C63FF] hover:bg-[#5a52d5] transition-colors"
                    >
                        Registrarse
                    </button>
                    <div className="text-center mt-2">
                        <span className="text-gray-500 text-sm">¿Ya tienes cuenta? </span>
                        <span className="text-[#6C63FF] font-medium text-sm cursor-pointer">Iniciar Sesión</span>
                    </div>
                </div>
            </form>
        </div>
    )
}
