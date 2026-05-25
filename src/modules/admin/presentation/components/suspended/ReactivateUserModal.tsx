import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  onReactivate: (userId: number, motivo: string) => Promise<void>;
}

export function ReactivateUserModal({ isOpen, onClose, userId, userName, onReactivate }: Props) {
  const [motivo, setMotivo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!motivo.trim()) {
      setError('El motivo de reactivación es obligatorio.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onReactivate(userId, motivo);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al reactivar la cuenta');
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
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold">Reactivar cuenta de {userName}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[#a7aab9] text-xs font-bold uppercase tracking-widest ml-1">
                Motivo de reactivación *
              </label>
              <textarea
                value={motivo}
                onChange={(e) => {
                  setMotivo(e.target.value);
                  setError(null);
                }}
                placeholder="Describe por qué se reactiva la cuenta..."
                className="w-full bg-[#0d1117] border border-white/10 text-white rounded-2xl px-5 py-4 mt-2 focus:outline-none focus:ring-2 focus:ring-green-500/40 transition-all min-h-[100px] resize-none"
                maxLength={300}
              />
              {error && (
                <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-4 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 rounded-2xl transition-colors"
          >
            CANCELAR
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-4 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'ACTIVAR CUENTA'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}