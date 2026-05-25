import { DenunciaAgrupada } from '../../../domain/entities/Complaint';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  denuncia: DenunciaAgrupada | null;
}

export function ViewDenunciaModal({ isOpen, onClose, denuncia }: Props) {
  if (!isOpen || !denuncia) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0f111a] w-full max-w-lg max-h-[80vh] rounded-[24px] border border-white/10 p-8 shadow-2xl relative flex flex-col">
        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="text-[#EF4444]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold">Detalle de denuncias</h2>
        </div>

        <div className="space-y-2 mb-4">
          <p className="text-white"><span className="text-[#9ca3af]">Portafolio:</span> {denuncia.portfolioTitle}</p>
          <p className="text-white"><span className="text-[#9ca3af]">Usuario:</span> {denuncia.ownerUserName}</p>
          <p className="text-white"><span className="text-[#9ca3af]">Cantidad de denuncias:</span> {denuncia.complaintCount}</p>
          <p className="text-white"><span className="text-[#9ca3af]">Estado:</span> 
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
              denuncia.status === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
              denuncia.status === 'revisado' ? 'bg-blue-500/20 text-blue-400' :
              'bg-red-500/20 text-red-400'
            }`}>{denuncia.status}</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 border-t border-white/10 pt-4">
          <h3 className="text-white font-semibold text-sm">Denuncias recibidas:</h3>
          {denuncia.complaints.map(c => (
            <div key={c.id} className="bg-[#1a1c29] p-3 rounded-xl border border-white/5">
              <div className="flex justify-between items-start">
                <span className="text-white text-sm font-medium">{c.reason}</span>
                <span className="text-[#6b7280] text-xs">{new Date(c.createdAt).toLocaleDateString('es-BO')}</span>
              </div>
              {c.description && <p className="text-[#9ca3af] text-xs mt-1">{c.description}</p>}
              <p className="text-[#6b7280] text-xs mt-1">Reportado por: {c.reportedBy}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}