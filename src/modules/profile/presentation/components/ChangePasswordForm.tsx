import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '../../../../shared/components/SocialIcons';
import { useToast } from '../../../../shared/hooks/useToast';
import { Toast } from '../../../../shared/components/Toast';
import { changePassword } from '../../../../modules/auth/infrastructure/authService';

interface ChangePasswordFormProps {
  email: string;
  onCancel?: () => void;
}

interface FieldErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const MAX_LENGTH = 64;
const MIN_NEW_LENGTH = 8;

export default function ChangePasswordForm({
  email,
  onCancel,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast } = useToast();

  const validateField = (name: string, value: string): string => {
    if (!value.trim()) return 'Este campo es obligatorio';
    if (name === 'newPassword') {
      if (value.length < MIN_NEW_LENGTH)
        return `La nueva contraseña debe tener un mínimo de ${MIN_NEW_LENGTH} caracteres`;
      if (value.length > MAX_LENGTH)
        return `El texto no puede superar los ${MAX_LENGTH} caracteres`;
    }
    if (name === 'confirmPassword') {
      if (value.length > MAX_LENGTH)
        return `El texto no puede superar los ${MAX_LENGTH} caracteres`;
      if (value !== newPassword) return 'Las contraseñas no coinciden';
    }
    if (name === 'currentPassword' && value.length > MAX_LENGTH)
      return `El texto no puede superar los ${MAX_LENGTH} caracteres`;
    return '';
  };

  const handleBlur = (name: string, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = (): FieldErrors => {
    return {
      currentPassword: validateField('currentPassword', currentPassword),
      newPassword: validateField('newPassword', newPassword),
      confirmPassword: validateField('confirmPassword', confirmPassword),
    };
  };

  const hasErrors = (errors: FieldErrors) =>
    Object.values(errors).some((e) => e && e.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateAll();
    setFieldErrors(errors);
    setTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    if (hasErrors(errors)) return;

    setIsLoading(true);
    try {
      await changePassword({
        email,
        contrasenaActual: currentPassword,
        nuevaContrasena: newPassword,
      });

      showToast('Cambio de contraseña exitoso', 'success');
      setTimeout(() => {
        if (onCancel) onCancel();
      }, 1500);
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message ||
            'Error al actualizar contraseña';

      // Detect wrong current password
      if (
        msg.toLowerCase().includes('incorrecta') ||
        msg.toLowerCase().includes('incorrect') ||
        msg.toLowerCase().includes('actual') ||
        msg.toLowerCase().includes('wrong') ||
        (error as { status?: number })?.status === 401
      ) {
        setFieldErrors((prev) => ({
          ...prev,
          currentPassword: 'La contraseña actual es incorrecta',
        }));
      } else {
        showToast(msg, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="w-[calc(100vw-2rem)] sm:w-[340px] md:w-[320px] bg-[#11131f] border border-white/5 rounded-[28px] p-7 flex flex-col gap-5 relative shadow-2xl">
      <Toast toast={toast} />
      <h2 className="text-white text-[28px] font-bold leading-[1.1] mb-1">
        Actualizar
        <br />
        contraseña
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {/* Contraseña actual */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[#a1a1aa] text-[13px] font-medium">
            Contraseña actual *
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (touched.currentPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    currentPassword: validateField(
                      'currentPassword',
                      e.target.value
                    ),
                  }));
                }
              }}
              onBlur={(e) => handleBlur('currentPassword', e.target.value)}
              className={`w-full bg-white text-slate-800 text-[14px] font-bold tracking-[0.1em] px-4 py-3 rounded-full outline-none pr-11 transition-all placeholder-gray-400 ${
                touched.currentPassword && fieldErrors.currentPassword
                  ? 'ring-2 ring-red-400'
                  : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
            >
              {showCurrentPassword ? (
                <EyeOffIcon className="w-[18px] h-[18px] text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <EyeIcon className="w-[18px] h-[18px] text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
          {touched.currentPassword && fieldErrors.currentPassword && (
            <p className="text-red-400 text-[12px] px-1 mt-0.5">
              {fieldErrors.currentPassword}
            </p>
          )}
        </div>

        {/* Nueva contraseña */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[#a1a1aa] text-[13px] font-medium">
            Nueva contraseña *
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (touched.newPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    newPassword: validateField('newPassword', e.target.value),
                  }));
                }
              }}
              onBlur={(e) => handleBlur('newPassword', e.target.value)}
              className={`w-full bg-white text-slate-800 text-[14px] font-bold tracking-[0.1em] px-4 py-3 rounded-full outline-none pr-11 transition-all placeholder-gray-400 ${
                touched.newPassword && fieldErrors.newPassword
                  ? 'ring-2 ring-red-400'
                  : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
            >
              {showNewPassword ? (
                <EyeOffIcon className="w-[18px] h-[18px] text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <EyeIcon className="w-[18px] h-[18px] text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
          {touched.newPassword && fieldErrors.newPassword && (
            <p className="text-red-400 text-[12px] px-1 mt-0.5">
              {fieldErrors.newPassword}
            </p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[#a1a1aa] text-[13px] font-medium">
            Confirmar contraseña *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (touched.confirmPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: validateField(
                      'confirmPassword',
                      e.target.value
                    ),
                  }));
                }
              }}
              onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
              className={`w-full bg-white text-slate-800 text-[14px] font-bold tracking-[0.1em] px-4 py-3 rounded-full outline-none pr-11 transition-all placeholder-gray-400 ${
                touched.confirmPassword && fieldErrors.confirmPassword
                  ? 'ring-2 ring-red-400'
                  : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="w-[18px] h-[18px] text-gray-400 hover:text-gray-600 transition-colors" />
              ) : (
                <EyeIcon className="w-[18px] h-[18px] text-gray-400 hover:text-gray-600 transition-colors" />
              )}
            </button>
          </div>
          {touched.confirmPassword && fieldErrors.confirmPassword && (
            <p className="text-red-400 text-[12px] px-1 mt-0.5">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5 mt-3">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-full text-src-1c1154 font-bold text-[13px] tracking-wide uppercase transition-all ${
              !isLoading
                ? 'bg-[#c3b6f9] hover:bg-[#a998f5] active:scale-[0.98] cursor-pointer'
                : 'bg-[#c3b6f9]/50 cursor-not-allowed text-src-1c1154/50'
            }`}
          >
            {isLoading ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full py-3 rounded-full bg-transparent border border-white/20 text-white font-bold text-[13px] tracking-wide uppercase hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer"
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
}
