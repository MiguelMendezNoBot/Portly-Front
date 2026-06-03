import { useState } from 'react';
import { useAdminAppeal } from '../../applications/useAdminAppeal';
import { AppealDetailModal } from '../components/appeal/AppealDetailModal';
import { Appeal } from '../../domain/entities/Appeal';

type ActionMode = 'attend' | null;

const AttendIcon = () => (
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

export function AppealPage() {
  const { appeals, isLoading, error, refetch } = useAdminAppeal();
  const [mode, setMode] = useState<ActionMode>(null);
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);

  const toggleMode = (newMode: 'attend') => {
    setMode((prev) => (prev === newMode ? null : newMode));
  };

  const handleCardClick = (appeal: Appeal) => {
    if (mode === 'attend') {
      setSelectedAppeal(appeal);
    }
  };

  return (
    <div className="py-6 animate-fade-in">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white text-2xl font-bold">Solicitudes</h3>
          <p className="text-[#9ca3af] text-sm mt-1">
            Solicitudes de reactivación de cuentas restringidas o suspendidas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          {appeals.length > 0 && (
            <button
              onClick={() => toggleMode('attend')}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-full font-semibold transition-all active:scale-95 text-sm whitespace-nowrap border ${
                mode === 'attend'
                  ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400'
                  : 'border-white/10 text-[#9ca3af] hover:text-yellow-400 hover:border-yellow-500/20'
              }`}
            >
              <AttendIcon />
              Atender
            </button>
          )}
        </div>
      </header>

      {/* Indicador de modo activo */}
      {mode === 'attend' && appeals.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border bg-yellow-500/10 border-yellow-500/20 text-yellow-400 mb-6">
          <AttendIcon />
          <span>Da clic a una solicitud para atenderla</span>
          <button
            onClick={() => setMode(null)}
            className="ml-auto text-xs underline opacity-60 hover:opacity-100"
          >
            Cancelar
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {(() => {
        const displayedAppeals = mode === 'attend' ? appeals.filter(a => a.estadoApelacion === 'pendiente') : appeals;

        if (isLoading) {
          return (
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
          );
        }

        if (displayedAppeals.length === 0) {
          return (
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
          );
        }

        return (
          <div className="space-y-4">
            {displayedAppeals.map((appeal) => (
            <div
              key={appeal.id}
              onClick={() => handleCardClick(appeal)}
              className={`group relative bg-[#2D3449] p-6 rounded-2xl border transition-all ${
                mode === 'attend'
                  ? 'border-yellow-500/20 cursor-pointer hover:bg-yellow-500/10 hover:border-yellow-500/40'
                  : 'border-white/5 hover:bg-[#1f2233]'
              }`}
            >
              {mode === 'attend' && (
                <div className="absolute bottom-5 right-5 p-2 bg-yellow-500/20 rounded-lg text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AttendIcon />
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-white text-base font-bold">
                    {appeal.userName}
                  </h4>
                  <p className="text-[#9ca3af] text-sm">
                    {appeal.userEmail} ·{' '}
                    <span
                      className={
                        appeal.estadoCuenta === 'suspendido'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      }
                    >
                      {appeal.estadoCuenta}
                    </span>
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    appeal.estadoApelacion === 'pendiente'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : appeal.estadoApelacion === 'aprobada'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {appeal.estadoApelacion}
                </span>
              </div>
              <div className="mt-3 text-sm text-[#9ca3af] line-clamp-2">
                {appeal.motivo}
              </div>
              <div className="mt-2 text-xs text-[#6b7280]">
                {new Date(appeal.fechaApelacion).toLocaleString('es-BO')}
              </div>
            </div>
          ))}
        </div>
        );
      })()}

      {selectedAppeal && (
        <AppealDetailModal
          appeal={selectedAppeal}
          onClose={() => setSelectedAppeal(null)}
          onUpdate={refetch}
        />
      )}
    </div>
  );
}
