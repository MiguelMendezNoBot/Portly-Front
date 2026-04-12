import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '../../../../shared/components/SocialIcons';
import { useToast } from '../../../../shared/hooks/useToast';
import { Toast } from '../../../../shared/components/Toast';
import { changePassword } from '../../../../modules/auth/infrastructure/authService';

interface ChangePasswordFormProps {
  email: string;
}

export default function ChangePasswordForm({ email }: ChangePasswordFormProps) {
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
    <div className="w-full bg-src-0f111a border border-white/5 rounded-[16px] p-6 sm:p-8 flex flex-col gap-6 relative shadow-lg">
      <Toast toast={toast} />
      <h2 className="text-white text-xl font-bold">Cambiar Contraseña</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5 relative">
          <label className="text-white text-sm">
            Contraseña Actual
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-src-1e293b text-white text-sm px-4 py-3 rounded-[14px] border border-transparent outline-none pr-10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-gray-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
            >
              {showCurrentPassword ? (
                <EyeOffIcon className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-white text-sm">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-src-1e293b text-white text-sm px-4 py-3 rounded-[14px] border border-transparent outline-none pr-10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-gray-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
            >
              {showNewPassword ? (
                <EyeOffIcon className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors" />
              )}
            </button>
          </div>
          <span className="text-src-6b7280 text-[11px] mt-1 pl-1">
            Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo
            (!,#,$,*,-,/,~).
          </span>
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-white text-sm">
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-src-1e293b text-white text-sm px-4 py-3 rounded-[14px] border border-transparent outline-none pr-10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-gray-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-200 transition-colors" />
              )}
            </button>
          </div>
          {newPassword !== confirmPassword && confirmPassword.length > 0 && (
            <span className="text-red-400 text-[11px] mt-1 pl-1">
              Las contraseñas no coinciden.
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isLoading}
          className={`w-full py-3.5 rounded-2xl text-white font-bold transition-all mt-2.5 ${
            canSubmit && !isLoading
              ? 'bg-src-818cf8 hover:bg-src-6366f1 active:scale-[0.98] shadow-lg shadow-indigo-500/20 cursor-pointer'
              : 'bg-src-818cf8/50 cursor-not-allowed text-white/70'
          }`}
        >
          {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  );
}
