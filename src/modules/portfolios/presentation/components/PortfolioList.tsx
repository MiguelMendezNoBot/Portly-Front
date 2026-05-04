import type { Portfolio } from '../../domain/entities/Portfolio';

interface PortfolioListProps {
  portfolios: Portfolio[];
  loading: boolean;
  mode?: 'delete' | 'publish' | null;
  onDelete?: (id: string) => void;
  onPublish?: (portfolio: Portfolio) => void;
  onClick?: (portfolio: Portfolio) => void;
}

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[240px] gap-4 px-4 text-center">
    {/* Ilustración SVG */}
    <div className="w-20 h-20 rounded-2xl bg-[#7c6bec]/10 flex items-center justify-center mb-1">
      <svg
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="text-[#7c6bec]"
      >
        <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
        <path d="M12 11v4M10 13h4" strokeLinecap="round" />
      </svg>
    </div>
    <div>
      <p className="text-white font-semibold text-base leading-snug">
        ¡Tu portafolio espera por ti!
      </p>
      <p className="text-[#5a6278] text-sm mt-1 max-w-[200px]">
        Aún no has creado ningún portafolio. Elige una plantilla y dale vida a tu perfil.
      </p>
    </div>
    <div className="flex items-center gap-2 text-[#7c6bec] text-xs font-medium">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Selecciona una plantilla a la derecha
    </div>
  </div>
);

const VisibilityBadge = ({ value }: { value: 'PUBLICO' | 'PRIVADO' }) => (
  <span
    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
      value === 'PUBLICO'
        ? 'bg-emerald-500/15 text-emerald-400'
        : 'bg-slate-500/20 text-slate-400'
    }`}
  >
    {value === 'PUBLICO' ? 'Público' : 'Privado'}
  </span>
);

export default function PortfolioList({ portfolios, loading, mode, onDelete, onPublish, onClick }: Readonly<PortfolioListProps>) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-video rounded-2xl bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (portfolios.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-1">
      {portfolios.map((p) => {
        const isDeleteMode = mode === 'delete';
        const isPublishMode = mode === 'publish';
        return (
          <div
            key={p.id}
            onClick={() => {
              if (isDeleteMode && onDelete) onDelete(p.id);
              else if (isPublishMode && onPublish) onPublish(p);
              else if (onClick) onClick(p);
            }}
            className={`group relative rounded-2xl p-4 transition-all border flex flex-col gap-4 ${
              isDeleteMode
                ? 'bg-[#1a1c29] border-red-500/20 cursor-pointer hover:bg-red-500/10 hover:border-red-500/40'
                : isPublishMode
                  ? 'bg-[#1a1c29] border-[#7c6bec]/20 cursor-pointer hover:bg-[#7c6bec]/10 hover:border-[#7c6bec]/40'
                  : 'bg-[#1a1c29] border-white/5 hover:border-[#7c6bec]/30 cursor-pointer'
            }`}
          >
            {isDeleteMode && (
              <div className="absolute inset-0 bg-red-900/40 rounded-2xl flex items-center justify-center z-10 pointer-events-none transition-all group-hover:bg-red-900/60 backdrop-blur-[1px]">
                <div className="p-4 bg-red-500 rounded-full text-white shadow-2xl shadow-red-500/50 animate-pulse transform group-hover:scale-110 transition-transform">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </div>
              </div>
            )}

            {isPublishMode && (
              <div className="absolute top-3 right-3 z-10 pointer-events-none">
                <span className="flex items-center gap-1 px-2.5 py-1 bg-[#7c6bec]/20 border border-[#7c6bec]/30 rounded-full text-[#C9BEFF] text-[10px] font-bold uppercase tracking-wide animate-pulse">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Publicar
                </span>
              </div>
            )}

            {/* Preview Image */}
            <div className="relative aspect-video rounded-xl bg-[#0f111a] border border-white/5 overflow-hidden shrink-0">
              {p.previewImageUrl ? (
                <img
                  src={p.previewImageUrl}
                  alt={p.nombre}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1d2e] to-[#0f111a]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7c6bec30" strokeWidth="1">
                    <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
                  </svg>
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                {!isDeleteMode && !isPublishMode && (
                  <a
                    href={p.visibilidad === 'PUBLICO' && p.publicUrl ? p.publicUrl : `/p/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {p.visibilidad === 'PUBLICO' ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Ver portafolio
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Previsualizar
                      </>
                    )}
                  </a>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-white text-base font-bold truncate pr-2">{p.nombre}</h3>
                <VisibilityBadge value={p.visibilidad} />
              </div>
              <p className="text-[#6b7280] text-[11px] uppercase tracking-widest font-semibold">
                ID: {p.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
