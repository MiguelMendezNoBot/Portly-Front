import { useState } from 'react';
import { DenunciaAgrupada } from '../../../domain/entities/Complaint';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  denuncia: DenunciaAgrupada | null;
  onUpdateStatus: (id: number, newStatus: string) => Promise<void>;
}

export function ReviewDenunciaModal({ isOpen, onClose, denuncia, onUpdateStatus }: Props) {
  const [status, setStatus] = useState('revisado');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !denuncia) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onUpdateStatus(denuncia.id, status);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f111a] w-full max-w-md rounded-[24px] border border-white/10 p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="text-[#F59E0B]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold">Revisar denuncia</h2>
        </div>

        <p className="text-[#9ca3af] text-sm mb-4">Portafolio: <span className="text-white">{denuncia.portfolioTitle}</span></p>

        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">Nuevo estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-[#1a1c29] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#7c6bec] appearance-none"
          >
            <option value="revisado">Revisado</option>
            <option value="suspendido">Suspendido</option>
            <option value="pendiente">Pendiente (reactivar)</option>
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#bdbefe] to-[#a092ec] text-[#1c1154] font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-[#1c1154] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}