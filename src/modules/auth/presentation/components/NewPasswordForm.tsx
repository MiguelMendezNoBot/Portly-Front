import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from '../../../../shared/components/SocialIcons';
import { resetPassword, loginUser } from '../../infrastructure/authService';
import { saveToken, saveUsuarioId, saveEmail } from '../../../../infrastructure/storage/storage';
import { useToast } from '../../../../shared/hooks/useToast';
import { Toast } from '../../../../shared/components/Toast';

// --- Iconos SVGs ---
const CheckmarkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-4 h-4 text-[#6C63FF] mr-2.5"
  >
    <path
      d="M5 13l4 4L19 7"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ErrorCrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-red-500 mr-2.5">
    <path
      d="M18 6L6 18M6 6l12 12"
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

export const NewPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados de control y peticiones
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Este estado controla si el backend rechazó la contraseña por ser igual a la anterior
  const [isSameAsOld, setIsSameAsOld] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast, showToast } = useToast();

  // Obtenemos los datos pasados desde VerifyCodeForm
  const email = location.state?.email;
  const codigo = location.state?.codigo;

  // Redirección de seguridad si acceden sin el flujo normal
  useEffect(() => {
    if (!email || !codigo) {
      navigate('/login', { replace: true });
    }
  }, [email, codigo, navigate]);

  // --- Lógica de Validación en Tiempo Real ---
  const requirements = useMemo(() => {
    return {
      hasMinLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      // Cumple si el backend NO ha dicho que es igual a la anterior
      isNotSameAsPrevious: !isSameAsOld,
    };
  }, [password, isSameAsOld]);

  // El botón solo se habilita si TODOS los requisitos visuales se cumplen y las contraseñas coinciden
  const canSubmit =
    requirements.hasMinLength &&
    requirements.hasNumber &&
    requirements.isNotSameAsPrevious &&
    password === confirmPassword &&
    password.length > 0;

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Si el usuario empieza a borrar o cambiar la contraseña, limpiamos el error del backend
    if (isSameAsOld) setIsSameAsOld(false);
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    setIsLoading(true);
    try {
      // Llamamos a tu endpoint pasándole el JSON requerido
      await resetPassword(email, codigo, password);

      // Auto-iniciar sesión con las nuevas credenciales para que el estado
      // de la aplicación esté actualizado al dirigirse a 'Home'
      try {
        const loginData = await loginUser({ correoElectronico: email, contraseña: password });
        if (loginData?.token) saveToken(loginData.token);
        if (loginData?.idUsuario) saveUsuarioId(loginData.idUsuario);
        if (loginData?.email) saveEmail(loginData.email);

        showToast('¡Contraseña restablecida con éxito!', 'success');
        setTimeout(() => navigate('/', { replace: true }), 1500);
      } catch (loginError) {
        // En caso de que el login automático falle (muy raro)
        showToast('Contraseña restablecida. Por favor inicia sesión.', 'success');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    } catch (err: any) {
      // Si el backend lanza la IllegalArgumentException
      const errorMessage = err.message?.toLowerCase() || '';
      if (errorMessage.includes('igual') || errorMessage.includes('actual')) {
        setIsSameAsOld(true); // Disparamos el check 3 para que se ponga rojo
      } else {
        setGeneralError(
          err.message || 'Ocurrió un error al cambiar la contraseña.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Componente auxiliar para pintar los checks (con soporte para estado de error)
  const RequirementItem = ({
    isMet,
    hasError,
    label,
  }: {
    isMet: boolean;
    hasError?: boolean;
    label: string;
  }) => {
    let Icon = EmptyCircleIcon;
    let textColor = 'text-gray-500';

    if (hasError) {
      Icon = ErrorCrossIcon;
      textColor = 'text-red-500 font-semibold';
    } else if (isMet) {
      Icon = CheckmarkIcon;
      textColor = 'text-gray-900';
    }

    return (
      <div className="flex items-center mt-2.5 transition-colors">
        <Icon />
        <span className={`text-[12.5px] font-medium ${textColor}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="w-[85%] sm:w-full max-w-sm mx-auto px-5 sm:px-10 py-10 bg-white rounded-[35px] relative shadow-lg flex flex-col items-center">
      <Toast toast={toast} />
      <div className="pb-8 text-center">
        <h1 className="font-bold text-3xl leading-tight">Nueva Contraseña</h1>
        <h2 className="text-gray-500 font-normal text-[13px] mt-4 px-2">
          Asegura tu cuenta con una clave robusta
        </h2>
      </div>

      <form onSubmit={handleSubmit} noValidate className="w-full">
        {/* --- Input 1: Nueva Contraseña --- */}
        <div className="flex flex-col gap-1 mt-1 relative">
          <label className="text-black text-[12.5px] font-bold mt-1 uppercase tracking-wide">
            NUEVA CONTRASEÑA
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full text-xs px-2 pt-2.5 pb-1.5 border rounded-xl outline-none pr-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${isSameAsOld ? 'border-red-400' : 'border-gray-400'}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 tabIndex={-1}"
            >
              {showPassword ? (
                <EyeOffIcon className="w-4 h-4 text-gray-400" />
              ) : (
                <EyeIcon className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* --- Input 2: Confirmar Nueva Contraseña --- */}
        <div className="flex flex-col gap-1 mt-4 relative">
          <label className="text-black text-[12.5px] font-bold mt-1 uppercase tracking-wide">
            CONFIRMAR NUEVA CONTRASEÑA
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setGeneralError(null);
              }}
              className={`w-full text-xs px-2 pt-2.5 pb-1.5 border rounded-xl outline-none pr-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${password !== confirmPassword && confirmPassword.length > 0 ? 'border-red-400' : 'border-gray-400'}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 tabIndex={-1}"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="w-4 h-4 text-gray-400" />
              ) : (
                <EyeIcon className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
          {password !== confirmPassword && confirmPassword.length > 0 && (
            <span className="text-red-500 text-[11px] mt-1 block">
              Las contraseñas no coinciden
            </span>
          )}
        </div>

        {/* --- Recuadro de Requisitos de Seguridad --- */}
        <div
          className={`mt-8 bg-[#EEF2FF] px-6 py-5 rounded-2xl w-full border ${isSameAsOld ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}
        >
          <label className="text-black text-[12.5px] font-bold uppercase tracking-wide">
            REQUISITOS DE SEGURIDAD
          </label>

          <div className="mt-2">
            <RequirementItem
              isMet={requirements.hasMinLength}
              label="Mínimo 8 caracteres"
            />
            <RequirementItem
              isMet={requirements.hasNumber}
              label="Incluye un número"
            />
            {/* Este tercer check se pone rojo (hasError) si el backend lanza la excepción */}
            <RequirementItem
              isMet={requirements.isNotSameAsPrevious}
              hasError={isSameAsOld}
              label="No puede ser igual a la anterior"
            />
          </div>
        </div>

        {generalError && (
          <div className="text-red-500 text-[12px] font-medium mt-4 text-center">
            {generalError}
          </div>
        )}

        {/* Botón principal Cambiar Contraseña */}
        <div>
          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            className={`mt-8 w-full py-3 rounded-2xl text-white font-semibold flex items-center justify-center transition-colors text-[14px] shadow-lg ${
              canSubmit && !isLoading
                ? 'bg-[#6C63FF] hover:bg-[#5a52d5] cursor-pointer shadow-indigo-100'
                : 'bg-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            {isLoading ? 'Cambiando...' : 'Cambiar contraseña'}
            {!isLoading && <KeyIcon />}
          </button>
        </div>
      </form>
    </div>
  );
};
