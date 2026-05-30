import { useState, useMemo, useEffect } from 'react';
import { ComplaintGroup } from '../../../domain/entities/Complaint';
import { Link } from 'react-router-dom';

interface ViewComplaintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: ComplaintGroup[];
}

const STATUS_COLOR: Record<string, string> = {
  pendiente: 'bg-yellow-500/20 text-yellow-400',
  revisado: 'bg-blue-500/20 text-blue-400',
};

function DetailPanel({ complaint }: { complaint: ComplaintGroup }) {
  return (
    <div className="overflow-y-auto flex flex-col gap-5 px-6 py-5 scrollbar-thin scrollbar-thumb-[#2c2f48] flex-1">
      {/* Info principal */}
      <div className="pb-4 border-b border-white/5">
        <h3 className="text-white font-bold text-lg">
          {complaint.portfolioTitle}
        </h3>
        <div className="flex items-center gap-3 mt-2">
          <Link
            to={complaint.portfolioPublicUrl}
            target="_blank"
            className="text-[#a8e8ff] text-sm underline"
          >
            Ver portafolio público
          </Link>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[complaint.status]}`}
          >
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Usuario */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278] mb-2">
          Propietario
        </p>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">
            {complaint.ownerUserName}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
              complaint.ownerUserStatus === 'activo'
                ? 'bg-green-500/20 text-green-400'
                : complaint.ownerUserStatus === 'restringido'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
            }`}
          >
            {complaint.ownerUserStatus}
          </span>
        </div>
      </div>

      {/* Revisión (si existe) */}
      {complaint.revision && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <p className="text-white text-sm font-medium">
            Resultado de revisión:
          </p>
          <p className="text-[#9ca3af] text-sm mt-1">
            {complaint.revision.resultado}
          </p>
          <p className="text-[#6b7280] text-xs mt-1">
            Revisado por {complaint.revision.adminId} el{' '}
            {new Date(complaint.revision.fecha).toLocaleString('es-BO')}
          </p>
        </div>
      )}

      {/* Quejas */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a6278] mb-2">
          Denuncias recibidas ({complaint.complaints.length})
        </p>
        <div className="space-y-2.5">
          {complaint.complaints.map((c) => (
            <div
              key={c.id}
              className="bg-[#171B28] rounded-xl border border-white/5 px-4 py-3"
            >
              <div className="flex justify-between items-start">
                <span className="text-white text-sm font-medium">
                  {c.reason}
                </span>
                <span className="text-[#6b7280] text-xs">
                  {new Date(c.createdAt).toLocaleDateString('es-BO')}
                </span>
              </div>
              {c.description && (
                <p className="text-[#9ca3af] text-xs mt-1">{c.description}</p>
              )}
              <p className="text-[#6b7280] text-xs mt-1">
                Reportado por: {c.reportedBy}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="h-2" />
    </div>
  );
}

export function ViewComplaintsModal({
  isOpen,
  onClose,
  complaints,
}: ViewComplaintsModalProps) {
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'pendiente' | 'revisado'
  >('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      setSelectedId(null);
      setSearchTerm('');
      setStatusFilter('ALL');
      setCurrentPage(1);
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    let result = complaints;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((c) =>
        c.portfolioTitle.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== 'ALL') {
      result = result.filter((c) => c.status === statusFilter);
    }
    return result;
  }, [complaints, searchTerm, statusFilter]);

  // Ordenar por cantidad de denuncias descendente (opcional)
  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => b.complaints.length - a.complaints.length
    );
  }, [filtered]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [sorted, currentPage]);

  if (!isOpen) return null;

  const selectedComplaint = complaints.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className={`bg-[#0f111a] flex flex-col md:flex-row rounded-[24px] border border-white/10 shadow-2xl w-full transition-all duration-300 ease-in-out ${
          selectedId ? 'max-w-4xl' : 'max-w-lg'
        } max-h-[88vh]`}
      >
        {/* Panel izquierdo: lista */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-300 ${selectedId ? 'w-full md:w-80 shrink-0' : 'w-full'}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-white/5 flex-shrink-0">
            <div>
              <h2 className="text-white text-xl font-bold">
                Portafolios denunciados
              </h2>
              <p className="text-[#9ca3af] text-xs mt-0.5">
                {filtered.length} portafolio{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Filtros */}
          <div className="px-6 pt-5 pb-3 flex items-end gap-3 flex-shrink-0">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold tracking-wider text-[#5a6278]">
                Buscar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-[#5a6278]"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar portafolio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#171B28] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#7c6bec]/50 placeholder:text-[#5a6278]"
                />
              </div>
            </div>
            <div className="w-32 flex flex-col gap-1.5 shrink-0">
              <label className="text-[9px] uppercase font-bold tracking-wider text-[#5a6278]">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full bg-[#171B28] border border-white/10 rounded-xl text-xs text-white px-2 py-2 focus:outline-none focus:border-[#7c6bec]/50"
              >
                <option value="ALL">Todos</option>
                <option value="pendiente">Pendientes</option>
                <option value="revisado">Revisados</option>
              </select>
            </div>
          </div>

          {/* Lista */}
          <div className="overflow-y-auto px-6 py-3 space-y-2.5 scrollbar-thin scrollbar-thumb-[#2c2f48] flex-1">
            {paginated.length === 0 ? (
              <div className="text-center flex flex-col items-center p-8 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#7c6bec]/10 flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-[#7c6bec]"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-sm">
                  Sin resultados
                </p>
              </div>
            ) : (
              paginated.map((c) => {
                const isSelected = selectedId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() =>
                      setSelectedId((prev) => (prev === c.id ? null : c.id))
                    }
                    className={`group rounded-2xl border overflow-hidden flex items-center gap-3 px-4 py-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#7c6bec]/12 border-[#7c6bec]/40'
                        : 'bg-[#171B28] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#7c6bec]/30 text-[#C9BEFF]' : 'bg-[#7c6bec]/15 text-[#8e80f5]'}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">
                        {c.portfolioTitle}
                      </p>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 inline-block ${STATUS_COLOR[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <button
                      title={isSelected ? 'Cerrar detalle' : 'Ver detalle'}
                      className={`p-2 rounded-xl border transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#7c6bec]/20 border-[#7c6bec]/40 text-[#C9BEFF]'
                          : 'border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20'
                      }`}
                    >
                      {isSelected ? (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 flex-shrink-0">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-medium hover:bg-white/5 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-[#9ca3af] text-xs font-medium">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-medium hover:bg-white/5 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>

        {/* Panel derecho: detalle */}
        {selectedId && selectedComplaint && (
          <div className="flex flex-col flex-1 border-t md:border-t-0 md:border-l border-white/5 overflow-hidden rounded-b-[24px] md:rounded-b-none md:rounded-r-[24px] min-w-0 animate-fade-in">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-2 text-[#C9BEFF]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Detalle
                </span>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="p-1.5 rounded-lg border border-white/5 text-[#9ca3af] hover:text-white"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <DetailPanel complaint={selectedComplaint} />
          </div>
        )}
      </div>
    </div>
  );
}
