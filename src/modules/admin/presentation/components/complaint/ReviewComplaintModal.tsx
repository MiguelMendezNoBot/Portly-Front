import { useState } from 'react';
import { HttpAdminComplaintRepository } from '../../../infrastructure/repositories/HttpAdminComplaintRepository';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  complaintId: number;
  onSuccess: () => void;
}

const repo = new HttpAdminComplaintRepository();

export function ReviewComplaintModal({
  isOpen,
  onClose,
  complaintId,
  onSuccess,
}: Props) {
  const [resultado, setResultado] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!resultado.trim()) {
      setError('El resultado de revisión es obligatorio.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await repo.updateStatus(complaintId, {
        status: 'revisado',
        revision: {
          resultado,
          fecha: new Date().toISOString(),
          adminId: 'admin1',
        },
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al revisar la denuncia');
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
            <div className="w-12 h-12 rounded-full bg-[#6b72ff]/10 flex items-center justify-center text-[#6b72ff]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold">
              Resultado de revisión
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[#a7aab9] text-xs font-bold uppercase tracking-widest ml-1">
                Resultado *
              </label>
              <textarea
                value={resultado}
                onChange={(e) => {
                  setResultado(e.target.value);
                  setError(null);
                }}
                placeholder="Describe el resultado de la revisión..."
                className="w-full bg-[#0d1117] border border-white/10 text-white rounded-2xl px-5 py-4 mt-2 focus:outline-none focus:ring-2 focus:ring-[#6b72ff]/40 transition-all min-h-[100px] resize-none"
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
            className="flex-1 py-4 px-2 bg-gradient-to-r from-[#bdbefe] to-[#8285fe] text-[#471499] font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Enviar revisión'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
