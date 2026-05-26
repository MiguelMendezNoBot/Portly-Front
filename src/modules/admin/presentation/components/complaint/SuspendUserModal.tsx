import { useState } from 'react';
import { HttpAdminComplaintRepository } from '../../../infrastructure/repositories/HttpAdminComplaintRepository';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onSuccess: () => void;
}

const repo = new HttpAdminComplaintRepository();

export function SuspendUserModal({ isOpen, onClose, userId, userName, onSuccess }: Props) {
  const [motivo, setMotivo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!motivo.trim()) {
      setError('El motivo de suspensión es obligatorio.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // Crear registro de suspensión
      await repo.createSuspension({
        userId,
        motivo,
        fechaSuspension: new Date().toISOString(),
        adminId: 'admin1',
        motivoCancelacion: null,
      });
      // Actualizar denuncias del usuario
      await repo.updateDenunciasByUser(userId, 'suspendido');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al suspender al usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#0f111a] w-full max-w-md rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-8 pb-0">
          <div className="flex items-center gap-4 mb-6">
            {/* Icono de advertencia estilo DeleteSkillConfirmModal */}
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M12 2L2 20h20L12 2m0 4l7 12H5l7-12zm0 4h0v4h0v-4zm0 6h0v2h0v-2z" />
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold">Suspender a {userName}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[#a7aab9] text-xs font-bold uppercase tracking-widest ml-1">
                Motivo de suspensión
              </label>
              <textarea
                value={motivo}
                onChange={(e) => {
                  setMotivo(e.target.value);
                  setError(null);
                }}
                placeholder="Describe el motivo de la suspensión..."
                className="w-full bg-[#0d1117] border border-white/10 text-white rounded-2xl px-5 py-4 mt-2 focus:outline-none focus:ring-2 focus:ring-red-500/40 transition-all min-h-[100px] resize-none"
                maxLength={300}
              />
              {error && (
                <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="p-8 flex gap-3">
          <button
            onClick={() => {
              setError(null);
              onClose();
            }}
            disabled={isSubmitting}
            className="flex-1 py-4 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 rounded-2xl transition-colors"
          >
            CANCELAR
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'SUSPENDER'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}