import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Asegúrate de tener los iconos sociales y de visibilidad definidos en un archivo separado
// como lo tienes en tu LoginForm, o inclúyelos directamente. Para este ejemplo los incluiré.
import { EyeIcon, EyeOffIcon } from '../../../components/SocialIcons';

// --- Iconos SVGs para Requisitos de Seguridad y Botón ---
const CheckmarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-blue-500 mr-2.5">
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EmptyCircleIcon = () => (
  <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-2.5"></div>
);

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 ml-2.5 text-white">
    <path
      d="M15.5 10.5V5.5L22 12L15.5 18.5V13.5H9.5V10.5H15.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
// --- Fin Iconos ---

export const NewPasswordForm = () => {
  // Estado para los inputs y su visibilidad
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estado para errores o mensajes de confirmación
  const [error, setError] = useState<string | null>(null);
  //const navigate = useNavigate();

  // --- Lógica de Validación en Tiempo Real ---
  const requirements = useMemo(() => {
    return {
      hasMinLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      // La validación de 'No igual a la anterior' es lógica de backend,
      // no se puede verificar en el frontend sin el historial.
      // Para la maqueta, la dejaremos en false/grey.
      isNotSameAsPrevious: false,
    };
  }, [password]);

  // Verificar si todos los requisitos se cumplen para habilitar el botón
  const canSubmit = requirements.hasMinLength && requirements.hasNumber;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    console.log('Cambiando contraseña...', { password });
    // Aquí iría la llamada al backend: changePassword(password)
    // navigate('/login'); // Ejemplo de redirección al login
  };

  // Función auxiliar para renderizar los requisitos con el icono correcto
  const RequirementItem = ({
    isMet,
    label,
  }: {
    isMet: boolean;
    label: string;
  }) => (
    <div className="flex items-center mt-2.5">
      {isMet ? <CheckmarkIcon /> : <EmptyCircleIcon />}
      <span
        className={`text-[12.5px] font-medium ${isMet ? 'text-gray-900' : 'text-gray-500'}`}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div className="w-[85%] sm:w-full max-w-sm mx-auto px-5 sm:px-10 py-10 bg-white rounded-[35px] relative shadow-lg flex flex-col items-center">
      {/* Cabecera del formulario idéntica a la maqueta */}
      <div className="pb-8 text-center">
        <h1 className="font-bold text-3xl leading-tight">Nueva Contraseña</h1>
        <h2 className="text-gray-500 font-normal text-[13px] mt-4 px-2">
          Asegura tu cuenta con una clave robusta
        </h2>
      </div>

      <form onSubmit={handleSubmit} noValidate className="w-full">
        {/* --- Input 1: Nueva Contraseña (Estilo Manual de LoginForm) --- */}
        <div className="flex flex-col gap-1 mt-1 relative">
          <label className="text-black text-[12.5px] font-bold mt-1 uppercase tracking-wide">
            NUEVA CONTRASEÑA
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Usando las mismas clases base que tu <Input>
              className={`w-full text-xs px-2 pt-2.5 pb-1.5 border rounded-xl outline-none pr-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 border-gray-400`}
              required
            />
            {/* Icono del ojo para ver/ocultar */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 tabIndex={-1}"
            >
              {showPassword ? (
                <EyeOffIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* --- Input 2: Confirmar Nueva Contraseña (Estilo Manual de LoginForm) --- */}
        <div className="flex flex-col gap-1 mt-4.5 relative">
          <label className="text-black text-[12.5px] font-bold mt-1 uppercase tracking-wide">
            CONFIRMAR NUEVA CONTRASEÑA
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              // Usando las mismas clases base que tu <Input>
              className={`w-full text-xs px-2 pt-2.5 pb-1.5 border rounded-xl outline-none pr-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 border-gray-400`}
              required
            />
            {/* Icono del ojo para ver/ocultar */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 tabIndex={-1}"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>
        {error && (
          <span className="text-red-500 text-[11px] mt-1.5 block">{error}</span>
        )}

        {/* --- Recuadro de Requisitos de Seguridad --- */}
        <div className="mt-8 bg-[#EEF2FF] px-6 py-6 rounded-2xl w-full border border-gray-200">
          <label className="text-black text-[12.5px] font-bold mt-1 uppercase tracking-wide">
            REQUISITOS DE SEGURIDAD
          </label>

          <div className="mt-1">
            <RequirementItem
              isMet={requirements.hasMinLength}
              label="Mínimo 8 caracteres"
            />
            <RequirementItem
              isMet={requirements.hasNumber}
              label="Incluye un número"
            />
            <RequirementItem
              isMet={requirements.isNotSameAsPrevious}
              label="No puede ser igual a la anterior"
            />
          </div>
        </div>

        {/* Botón principal Cambiar Contraseña */}
        <div>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`mt-10 w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center transition-colors text-[14px] shadow-lg shadow-indigo-100 ${canSubmit ? 'bg-[#6C63FF] hover:bg-[#5a52d5] cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Cambiar contraseña
            <KeyIcon />
          </button>
        </div>
      </form>
    </div>
  );
};
