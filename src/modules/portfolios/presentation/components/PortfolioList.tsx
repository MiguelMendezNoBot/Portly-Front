import { useState } from 'react';
import type { Portfolio } from '../../domain/entities/Portfolio';interface PortfolioListProps {
  portfolios: Portfolio[];
  loading: boolean;
  mode?: 'delete' | 'publish' | 'preview' | null;
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

export default function PortfolioList({
  portfolios,
  loading,
  mode,
  onDelete,
  onPublish,
  onClick,
}: Readonly<PortfolioListProps>) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (e: React.MouseEvent, p: Portfolio) => {
    e.stopPropagation();
    const link = `${window.location.origin}/p/${p.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(p.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

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
    <div className="space-y-6 overflow-y-auto pr-1">
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
            className={`group relative rounded-2xl p-6 transition-all border flex flex-col gap-6 ${
              isDeleteMode
                ? 'bg-[#1a1c29] border-red-500/40 cursor-pointer hover:bg-red-500/5 hover:border-red-500/60'
                : isPublishMode
                  ? 'bg-[#1a1c29] border-[#7c6bec]/20 cursor-pointer hover:bg-[#7c6bec]/10 hover:border-[#7c6bec]/40'
                  : mode === 'preview'
                    ? 'bg-[#1a1c29] border-blue-500/20 cursor-pointer hover:bg-blue-500/10 hover:border-blue-500/40'
                    : 'bg-[#1a1c29] border-white/5 hover:border-[#7c6bec]/30 cursor-pointer'
            }`}
          >
            {isDeleteMode && (
              <div className="absolute top-3 right-3 z-20 pointer-events-none">
                <div className="p-2 bg-red-500/20 rounded-lg text-red-400 transform group-hover:scale-110 transition-transform flex items-center justify-center">
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
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </div>
              </div>
            )}

            {isPublishMode && (
              <div className="absolute top-3 right-3 z-10 pointer-events-none">
                <span className="flex items-center gap-1 px-3 py-1.5 bg-[#7c6bec]/90 border border-[#7c6bec] rounded-full text-white text-[10px] font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  Publicar
                </span>
              </div>
            )}

            {mode === 'preview' && (
              <div className="absolute top-3 right-3 z-10 pointer-events-none">
                <span className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/90 border border-blue-500 rounded-full text-white text-[10px] font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {p.visibilidad === 'PUBLICO' ? 'Visualizar' : 'Previsualizar'}
                </span>
              </div>
            )}

            {/* Body */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-stretch">
              {/* Contenido previo (Preview Image) */}
              <div className="relative aspect-video w-full md:w-[280px] rounded-xl bg-[#0f111a] border border-white/5 overflow-hidden shrink-0">
                {p.previewImageUrl ? (
                  <img
                    src={p.previewImageUrl}
                    alt={p.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1d2e] to-[#0f111a]">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#7c6bec30"
                      strokeWidth="1"
                    >
                      <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
                    </svg>
                  </div>
                )}
                
                {p.visibilidad === 'PUBLICO' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <button
                      onClick={(e) => handleCopyLink(e, p)}
                      className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 border border-white/20 rounded-full backdrop-blur-sm text-white text-sm font-medium transition-all transform hover:scale-105 shadow-lg"
                      title="Copiar enlace público"
                    >
                      {copiedId === p.id ? (
                        <>
                          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-emerald-400 font-bold">Enlace copiado</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          Copiar enlace
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Info & Content */}
              <div className="flex-1 min-w-0 py-2 flex flex-col justify-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#7c6bec]/15 flex items-center justify-center text-[#8e80f5] shrink-0 border border-white/5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold pr-2 truncate">
                      {p.nombre}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2">
                      <VisibilityBadge value={p.visibilidad} />
                    </div>
                  </div>
                </div>

                {/* Copiar enlace si es público se movió de vuelta a la imagen o se quita de aquí para no estar duplicado. Como está en la imagen, podemos ocultarlo aquí, o lo dejamos como respaldo. Como lo pusimos en la imagen, lo quitamos de aquí. */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
