import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '../../../../shared/components/SocialIcons';
import { useToast } from '../../../../shared/hooks/useToast';
import { Toast } from '../../../../shared/components/Toast';
import { changePassword } from '../../../../modules/auth/infrastructure/authService';

interface ChangePasswordFormProps {
  email: string;
  onCancel?: () => void;
}

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

  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast } = useToast();

  const passwordsMatch = newPassword === confirmPassword;

  const canSubmit =
    currentPassword.length > 0 && newPassword.length >= 8 && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      await changePassword({
        email,
        contrasenaActual: currentPassword,
        nuevaContrasena: newPassword,
      });

      showToast('Contraseña actualizada con éxito', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        if (onCancel) onCancel();
      }, 1500);
    } catch (error: unknown) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Error al actualizar contraseña',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[calc(100vw-2rem)] sm:w-[340px] md:w-[320px] bg-[#11131f] border border-white/5 rounded-[28px] p-7 flex flex-col gap-5 relative shadow-2xl">
      <Toast toast={toast} />
      <h2 className="text-white text-[28px] font-bold leading-[1.1] mb-1">
        Actualizar
        <br />
        contraseña
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[#a1a1aa] text-[13px] font-medium">
            Contraseña actual
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-white text-slate-800 text-[14px] font-bold tracking-[0.1em] px-4 py-3 rounded-full outline-none pr-11 transition-all placeholder-gray-400"
              required
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
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[#a1a1aa] text-[13px] font-medium">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white text-slate-800 text-[14px] font-bold tracking-[0.1em] px-4 py-3 rounded-full outline-none pr-11 transition-all placeholder-gray-400"
              required
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
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[#a1a1aa] text-[13px] font-medium">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white text-slate-800 text-[14px] font-bold tracking-[0.1em] px-4 py-3 rounded-full outline-none pr-11 transition-all placeholder-gray-400"
              required
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
        </div>

        <div className="flex flex-col gap-2.5 mt-3">
          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            className={`w-full py-3 rounded-full text-src-1c1154 font-bold text-[13px] tracking-wide uppercase transition-all ${
              canSubmit && !isLoading
                ? 'bg-[#c3b6f9] hover:bg-[#a998f5] active:scale-[0.98] cursor-pointer'
                : 'bg-[#c3b6f9]/50 cursor-not-allowed text-src-1c1154/50'
            }`}
          >
            {isLoading ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 rounded-full bg-transparent border border-white/20 text-white font-bold text-[13px] tracking-wide uppercase hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer"
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
}
