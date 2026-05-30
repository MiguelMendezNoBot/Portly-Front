import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminComplaint } from '../../applications/useAdminComplaint';
import { ViewComplaintsModal } from '../components/complaint/ViewComplaintModal';
import { ComplaintGroup } from '../../domain/entities/Complaint';

type ActionMode = 'review' | null;

const ReviewIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export function ComplaintPage() {
  const { complaints, isLoading, error } = useAdminComplaint();
  const [mode, setMode] = useState<ActionMode>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const navigate = useNavigate();

  const toggleMode = (newMode: 'review') => {
    setMode((prev) => (prev === newMode ? null : newMode));
  };

  const handleCardClick = (complaint: ComplaintGroup) => {
    if (mode === 'review') {
      navigate(`/admin/denuncias/${complaint.id}/revisar`);
    }
  };

  return (
    <div className="py-6 animate-fade-in">
      {/* Cabecera */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white text-2xl font-bold">Denuncias recibidas</h3>
          <p className="text-[#9ca3af] text-sm mt-1">
            Gestiona los reportes de portafolios realizados por la comunidad.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          {/* Visualizar */}
          <button
            onClick={() => setShowViewModal(true)}
            className="flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Visualizar
          </button>

          {complaints.length > 0 && (
            <button
              onClick={() => toggleMode('review')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                mode === 'review'
                  ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400'
                  : 'border-white/10 text-[#9ca3af] hover:text-yellow-400 hover:border-yellow-500/20'
              }`}
            >
              <ReviewIcon />
              Revisar
            </button>
          )}
        </div>
      </header>

      {/* Indicador de modo activo */}
      {mode === 'review' && complaints.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border bg-yellow-500/10 border-yellow-500/20 text-yellow-400 mb-6">
          <ReviewIcon />
          <span>Da clic a una denuncia para revisarla</span>
          <button
            onClick={() => setMode(null)}
            className="ml-auto text-xs underline opacity-60 hover:opacity-100"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-[#2D3449] p-6 rounded-2xl border border-white/5 animate-pulse"
            >
              <div className="h-4 bg-white/10 rounded w-2/3 mb-3" />
              <div className="h-3 bg-white/10 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
          <div className="w-16 h-16 bg-[#1a1c29] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4b5563"
              strokeWidth="1.5"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-white text-lg font-bold mb-2">
            No hay denuncias pendientes
          </h4>
          <p className="text-[#9ca3af] text-sm">
            Cuando un usuario reporte un portafolio, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              onClick={() => handleCardClick(complaint)}
              className={`group relative bg-[#2D3449] p-6 rounded-2xl border transition-all ${
                mode === 'review'
                  ? 'border-yellow-500/20 cursor-pointer hover:bg-yellow-500/10 hover:border-yellow-500/40'
                  : 'border-white/5 hover:bg-[#1f2233]'
              }`}
            >
              {/* Indicador de acción en hover si modo review */}
              {mode === 'review' && (
                <div className="absolute bottom-5 right-5 p-2 bg-yellow-500/20 rounded-lg text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ReviewIcon />
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white text-base font-bold">
                    {complaint.portfolioTitle}
                  </h4>
                  <p className="text-[#9ca3af] text-sm">
                    por {complaint.ownerUserName}{' '}
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        complaint.ownerUserStatus === 'activo'
                          ? 'bg-green-500/20 text-green-400'
                          : complaint.ownerUserStatus === 'restringido'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {complaint.ownerUserStatus}
                    </span>
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    complaint.status === 'pendiente'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {complaint.status}
                </span>
              </div>
              <div className="mt-3 flex gap-3 text-sm">
                <span className="text-[#a8e8ff]">
                  {complaint.complaints.length} denuncias
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de visualización */}
      <ViewComplaintsModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        complaints={complaints}
      />
    </div>
  );
}
