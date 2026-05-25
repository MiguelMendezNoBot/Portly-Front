import { useAdminDenuncias } from '../../applications/useAdminComplaint';
import { ViewDenunciaModal } from '../components/complaint/ViewComplaintModal';
import { ReviewDenunciaModal } from '../components/complaint/ReviewComplaintModal';

// Iconos inline
const ViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ReviewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

export function DenunciasPage() {
  const {
    denuncias,
    isLoading,
    error,
    actionMode,
    setActionMode,
    selectedDenuncia,
    handleCardClick,
    clearSelection,
    handleUpdateStatus,
  } = useAdminDenuncias();

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

        {/* Botones de modo */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <button
            onClick={() => setActionMode('view')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
              actionMode === 'view'
                ? 'bg-white/10 border-white/30 text-white'
                : 'border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20'
            }`}
          >
            <ViewIcon />
            Visualizar
          </button>

          <button
            onClick={() => setActionMode('review')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
              actionMode === 'review'
                ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400'
                : 'border-white/10 text-[#9ca3af] hover:text-yellow-400 hover:border-yellow-500/20'
            }`}
          >
            <ReviewIcon />
            Revisar
          </button>

          {actionMode && (
            <button
              onClick={() => setActionMode(null)}
              className="ml-2 text-xs underline text-[#9ca3af] opacity-60 hover:opacity-100"
            >
              Cancelar
            </button>
          )}
        </div>
      </header>

      {/* Indicador de modo activo */}
      {actionMode && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border mb-6 ${
          actionMode === 'view'
            ? 'bg-white/5 border-white/10 text-[#9ca3af]'
            : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
        }`}>
          {actionMode === 'view' ? <ViewIcon /> : <ReviewIcon />}
          <span>
            {actionMode === 'view'
              ? 'Haz clic en una denuncia para ver los detalles'
              : 'Haz clic en una denuncia para cambiar su estado'}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Lista de denuncias */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#2D3449] p-6 rounded-2xl border border-white/5 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-2/3 mb-3" />
              <div className="h-3 bg-white/10 rounded w-1/3 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : denuncias.length === 0 ? (
        <div className="text-center p-10 bg-[#1a1c29]/30 rounded-2xl border-2 border-dashed border-white/10">
          <div className="w-16 h-16 bg-[#1a1c29] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-white text-lg font-bold mb-2">No hay denuncias pendientes</h4>
          <p className="text-[#9ca3af] text-sm mb-6 max-w-md mx-auto">
            Cuando un usuario reporte un portafolio, aparecerá aquí para que puedas revisarlo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {denuncias.map(denuncia => (
            <div
              key={denuncia.id}
              onClick={() => handleCardClick(denuncia)}
              className={`group relative bg-[#2D3449] p-6 rounded-2xl border transition-all ${
                actionMode === 'view'
                  ? 'border-white/20 cursor-pointer hover:bg-[#2a3060] hover:border-white/30'
                  : actionMode === 'review'
                  ? 'border-yellow-500/20 cursor-pointer hover:bg-yellow-500/10 hover:border-yellow-500/40'
                  : 'border-white/5 hover:bg-[#1f2233]'
              }`}
            >
              {/* Indicador de acción */}
              {actionMode === 'view' && (
                <div className="absolute top-5 right-5 p-2 bg-white/10 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ViewIcon />
                </div>
              )}
              {actionMode === 'review' && (
                <div className="absolute top-5 right-5 p-2 bg-yellow-500/20 rounded-lg text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ReviewIcon />
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white text-base font-bold">{denuncia.portfolioTitle}</h4>
                  <p className="text-[#9ca3af] text-sm">por {denuncia.ownerUserName}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  denuncia.status === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                  denuncia.status === 'revisado' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {denuncia.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <span className="text-[#a8e8ff]">{denuncia.complaintCount} denuncias</span>
                <span className="text-[#6b7280]">Último motivo: {denuncia.latestReason}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modales */}
      <ViewDenunciaModal
        isOpen={actionMode === 'view' && selectedDenuncia !== null}
        onClose={clearSelection}
        denuncia={selectedDenuncia}
      />

      <ReviewDenunciaModal
        isOpen={actionMode === 'review' && selectedDenuncia !== null}
        onClose={clearSelection}
        denuncia={selectedDenuncia}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}