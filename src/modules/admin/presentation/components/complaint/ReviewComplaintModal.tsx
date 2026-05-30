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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await repo.updateStatus(complaintId, {
        status: 'revisado',
        revision: {
          resultado: 'Denuncia revisada por el administrador.',
          fecha: new Date().toISOString(),
          adminId: 'admin1',
        },
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-[#0f111a] w-full max-w-md rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-8">
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
              Marcar como revisado
            </h2>
          </div>

          <p className="text-[#9ca3af] text-sm mb-2">
            ¿Estás seguro de marcar esta denuncia como revisada?
          </p>
          <p className="text-[#6b7280] text-xs">
            Esto indicará que la denuncia ha sido atendida y no requiere más
            acciones.
          </p>
        </div>

        <div className="p-8 pt-0 flex gap-3">
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
            className="flex-1 py-4 bg-gradient-to-r from-[#bdbefe] to-[#8285fe] text-[#471499] font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'CONFIRMAR'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
