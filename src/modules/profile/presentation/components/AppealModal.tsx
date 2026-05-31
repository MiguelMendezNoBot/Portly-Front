// src/modules/profile/presentation/components/AppealModal.tsx
import { useState } from 'react';
import { httpClient } from '../../../../infrastructure/http/httpClient';
import { useAuth } from '../../../../modules/home/presentation/hooks/useAuth';

interface AppealModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  canClose: boolean; // true para "restringido", false para "suspendido"
  estado: string;
  motivoSuspension?: string | null;
  apelacionPendiente?: boolean;
  onAppealSubmitted?: () => void;
}

export default function AppealModal({
  isOpen,
  onClose,
  userEmail,
  canClose,
  estado,
  motivoSuspension,
  apelacionPendiente,
  onAppealSubmitted,
}: AppealModalProps) {
  const { logout } = useAuth();
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await httpClient.postAuth(
        '/api/appeal',
        {
          email: userEmail,
          motivo,
          tipoEstado: estado,
        },
        'Error al enviar la apelación'
      );
      setEnviado(true);
      if (onAppealSubmitted) {
        onAppealSubmitted();
      }
    } catch (err) {
      console.error('Error al enviar apelación:', err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Fondo blur obligatorio */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative z-10 bg-[#0F131F] border border-white/10 rounded-[2rem] shadow-2xl w-[90%] max-w-md p-8 animate-fade-in">
        {apelacionPendiente ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-yellow-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold">Apelación en trámite</h3>
            <p className="text-src-6b7280 text-sm">
              Ya has enviado una solicitud de revisión para esta cuenta. Estamos revisando tu caso y te contactaremos a la brevedad.
            </p>
            {canClose && (
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 rounded-full bg-src-7c6bec text-white font-semibold hover:bg-src-6b5edb transition-colors"
              >
                Cerrar
              </button>
            )}
            {estado === 'suspendido' && (
              <button
                onClick={logout}
                className="mt-2 w-full py-2.5 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        ) : enviado ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-400"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold">Apelación enviada</h3>
            <p className="text-src-6b7280 text-sm">
              Revisaremos tu caso y te contactaremos por correo electrónico.
            </p>
            {canClose && (
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2 rounded-full bg-src-7c6bec text-white font-semibold hover:bg-src-6b5edb transition-colors"
              >
                Cerrar
              </button>
            )}
            {estado === 'suspendido' && (
              <button
                onClick={logout}
                className="mt-2 w-full py-2.5 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-lg font-bold">
                {estado === 'suspendido'
                  ? 'Cuenta Suspendida'
                  : 'Cuenta Restringida'}
              </h3>
              {canClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            <p className="text-src-6b7280 text-sm mb-6">
              {estado === 'suspendido'
                ? 'Tu cuenta ha sido suspendida. Para apelar esta decisión, por favor explica tu situación a continuación.'
                : 'Tu cuenta ha sido restringida. Algunas funciones están limitadas. Puedes solicitar una revisión explicando tu caso.'}
            </p>

            {motivoSuspension && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 text-left">
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider block mb-1">
                  Motivo de la {estado === 'suspendido' ? 'suspensión' : 'restricción'}:
                </span>
                <p className="text-white text-sm leading-relaxed">
                  {motivoSuspension}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-white text-sm block mb-2">
                  Motivo de la apelación
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={4}
                  placeholder="Explica por qué deberíamos revisar tu caso..."
                  className="w-full bg-[#1A1F2E] border border-white/10 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-src-7c6bec"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={enviando || !motivo.trim()}
                className="w-full py-3 rounded-full bg-src-7c6bec hover:bg-src-6b5edb text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enviando ? 'Enviando...' : 'Enviar apelación'}
              </button>
              {estado === 'suspendido' && (
                <button
                  type="button"
                  onClick={logout}
                  className="w-full py-3 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold transition-colors cursor-pointer"
                >
                  Cerrar sesión
                </button>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
