import { useState, useMemo } from 'react';
import type { Portfolio } from '../../domain/entities/Portfolio';

interface ViewPortfolioListModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolios: Portfolio[];
}

export default function ViewPortfolioListModal({
  isOpen,
  onClose,
  portfolios,
}: ViewPortfolioListModalProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sorted = useMemo(() => {
    return [...portfolios].sort((a, b) => {
      const diff = a.id.localeCompare(b.id);
      return sortOrder === 'asc' ? diff : -diff;
    });
  }, [portfolios, sortOrder]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  
  const paginatedPortfolios = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [sorted, currentPage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#0f111a] w-full max-w-lg max-h-[85vh] flex flex-col rounded-[24px] border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-white/5 flex-shrink-0">
          <div>
            <h2 className="text-white text-xl font-bold">Listado de Portafolios</h2>
            <p className="text-[#9ca3af] text-xs mt-0.5">
              {portfolios.length} portafolio{portfolios.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Botón de orden */}
            <button
              onClick={() => {
                setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                setCurrentPage(1); // Reset page on sort change
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all text-xs font-medium"
              title={sortOrder === 'asc' ? 'Orden ascendente' : 'Orden descendente'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {sortOrder === 'asc' ? (
                  <>
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </>
                ) : (
                  <>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <polyline points="19 12 12 19 5 12" />
                  </>
                )}
              </svg>
              {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
            </button>

            {/* Cerrar */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 text-[#9ca3af] hover:text-white hover:border-white/20 transition-all"
              aria-label="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className="overflow-y-auto px-8 py-5 space-y-3 scrollbar-thin scrollbar-thumb-[#2c2f48]">
          {paginatedPortfolios.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-[#9ca3af] text-sm">No hay portafolios disponibles.</p>
            </div>
          ) : (
            paginatedPortfolios.map((p) => {
              return (
                <div
                  key={p.id}
                  className="bg-[#171B28] rounded-2xl border border-white/5 overflow-hidden flex items-center gap-3 px-5 py-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#7c6bec]/15 flex items-center justify-center text-[#8e80f5] shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{p.nombre}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          p.visibilidad === 'PUBLICO'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {p.visibilidad === 'PUBLICO' ? 'Público' : 'Privado'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-4 border-t border-white/5 flex-shrink-0 bg-[#0f111a] rounded-b-[24px]">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-medium hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="text-[#9ca3af] text-xs font-medium">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs font-medium hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
