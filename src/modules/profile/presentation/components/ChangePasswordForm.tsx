import { useState } from 'react';

// Si ya tienes estos iconos en './SocialIcons', puedes importarlos y borrar estos.
// Los dejo aquí para que el componente funcione directamente.
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const [isLoading, setIsLoading] = useState(false);
const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export const ChangePasswordForm = () => {
    // Estados para los valores
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Estados para los ojitos
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Estado para manejar los errores visuales
    const [errors, setErrors] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    // Lógica de Validación
    const validateForm = () => {
        let isValid = true;
        const newErrors = { current: '', new: '', confirm: '' };

        // 1. Validar contraseña actual
        if (!currentPassword) {
            newErrors.current = 'Debes ingresar tu contraseña actual.';
            isValid = false;
        }

        // 2. Validar requisitos de la nueva contraseña
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$*\-/~]).{8,}$/;
        
        if (!newPassword) {
            newErrors.new = 'La nueva contraseña es obligatoria.';
            isValid = false;
        } else if (!passwordRegex.test(newPassword)) {
            newErrors.new = 'Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo (!,#,$,*,-,/,~).';
            isValid = false;
        } else if (newPassword === currentPassword) {
            newErrors.new = 'La nueva contraseña no puede ser igual a la actual.';
            isValid = false;
        }

        // 3. Validar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            newErrors.confirm = 'Las contraseñas no coinciden.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Ejecutamos la validación en el frontend antes de molestar al backend
    if (!validateForm()) return;

    // 2. Activamos el estado de carga
    setIsLoading(true);

    try {
        // 👇 REEMPLAZA ESTO CON LA URL REAL DE TU BACKEND
        const url = 'https://tu-api.com/api/usuarios/cambiar-contrasena';
        
        // 👇 SI USAS UN TOKEN DE SESIÓN (JWT), RECUPÉRALO AQUÍ (ej. de localStorage o un contexto)
        const token = localStorage.getItem('token'); 

        const response = await fetch(url, {
            method: 'PUT', // o 'POST', depende de cómo hayan hecho tu backend
            headers: {
                'Content-Type': 'application/json',
                // Si tu backend requiere autenticación, envías el token así:
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                // OJO: El backend NO necesita el "confirmPassword". Solo la actual y la nueva.
                // Asegúrate de que estos nombres ("contrasenaActual", "nuevaContrasena") 
                // sean exactamente los que el backend espera recibir.
                contrasenaActual: currentPassword,
                nuevaContrasena: newPassword
            })
        });

        // Convertimos la respuesta del backend a JSON
        const data = await response.json();

        if (!response.ok) {
            // Si el backend rechaza la petición (ej. la contraseña actual era incorrecta)
            throw new Error(data.message || 'Error al actualizar la contraseña');
        }

        // --- SI LLEGAMOS AQUÍ, TODO SALIÓ BIEN ---
        console.log("¡Éxito!", data);
        
        // Aquí deberías lanzar una notificación (Toast) de éxito
        // alert('¡Contraseña actualizada con éxito!');

        // Limpiamos los recuadros
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({ current: '', new: '', confirm: '' });

    } catch (error: any) {
        // --- SI HUBO UN ERROR ---
        console.error("Error en la petición:", error);
        
        // Mostramos el error en el recuadro de la contraseña actual, o en un Toast general
        setErrors(prev => ({ ...prev, current: error.message }));
        
    } finally {
        // Pase lo que pase (éxito o error), quitamos el estado de carga
        setIsLoading(false);
    }
};

    return (
        <div className="bg-[#091328] rounded-2xl p-6 w-full text-white shadow-lg border border-gray-800/50">
            {/* Header del Componente */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white tracking-wide">Cambiar Contraseña</h3>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {/* --- CONTRASEÑA ACTUAL --- */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[#8e95a3] text-xs font-bold tracking-wider uppercase">
                        Contraseña Actual
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => {
                                setCurrentPassword(e.target.value);
                                if (errors.current) setErrors({ ...errors, current: '' });
                            }}
                            className={`w-full bg-black border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-all pr-12 ${
                                errors.current ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-gray-400'
                            }`}
                            placeholder="••••••••"
                        />
                        <button 
                            type="button" 
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setShowCurrent(!showCurrent);
                            }}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                            tabIndex={-1}
                        >
                            {showCurrent ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.current && <p className="text-red-500 text-[11px] font-medium">{errors.current}</p>}
                </div>

                {/* --- NUEVA CONTRASEÑA --- */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[#8e95a3] text-xs font-bold tracking-wider uppercase">
                        Nueva Contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (errors.new) setErrors({ ...errors, new: '' });
                            }}
                            className={`w-full bg-black border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-all pr-12 ${
                                errors.new ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-gray-400'
                            }`}
                            placeholder="••••••••"
                        />
                        <button 
                            type="button" 
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setShowNew(!showNew);
                            }}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                            tabIndex={-1}
                        >
                            {showNew ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                    {/* Mensaje de ayuda que se vuelve rojo si hay error */}
                    <p className={`text-[11px] font-medium mt-1 ${errors.new ? 'text-red-500' : 'text-[#8e95a3]'}`}>
                        {errors.new || "Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo (!,#,$,*,-,/,~)."}
                    </p>
                </div>

                {/* --- CONFIRMAR NUEVA CONTRASEÑA --- */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[#8e95a3] text-xs font-bold tracking-wider uppercase">
                        Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (errors.confirm) setErrors({ ...errors, confirm: '' });
                            }}
                            className={`w-full bg-black border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-all pr-12 ${
                                errors.confirm ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-gray-400'
                            }`}
                            placeholder="••••••••"
                        />
                        <button 
                            type="button" 
                            onMouseDown={(e) => {
                                e.preventDefault();
                                setShowConfirm(!showConfirm);
                            }}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                            tabIndex={-1}
                        >
                            {showConfirm ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.confirm && <p className="text-red-500 text-[11px] font-medium">{errors.confirm}</p>}
                </div>

                {/* --- BOTONES DE ACCIÓN --- */}
                <div className="flex flex-col gap-3 mt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-[#8b7cf7] hover:bg-[#7a6ce0] transition-colors text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        // Un pequeño spinner de carga animado
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        // El icono del candado original
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    )}
                    {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
</button>
                    
                    <button
                        type="button"
                        onClick={() => {
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            setErrors({ current: '', new: '', confirm: '' }); // Limpia errores al cancelar
                        }}
                        className="bg-transparent border border-gray-600 hover:bg-gray-800 transition-colors text-white font-semibold py-3 rounded-xl text-sm"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};