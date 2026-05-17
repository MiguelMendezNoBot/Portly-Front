import { useState, useRef, useEffect } from 'react';
import type { Portfolio } from '../../domain/entities/Portfolio';

interface PortfolioListProps {
  portfolios: Portfolio[];
  loading: boolean;
  mode?: 'delete' | 'publish' | 'preview' | 'share' | null;
  onDelete?: (id: string) => void;
  onPublish?: (portfolio: Portfolio) => void;
  onShare?: (id: string) => void;
  onClick?: (portfolio: Portfolio) => void;
}

// ── Lazy load hook via IntersectionObserver ───────────────────────────────────
function useInView(ref: React.RefObject<HTMLDivElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

// ── Live Scaled Iframe Component ──────────────────────────────────────────────
interface LiveIframePreviewProps {
  portfolioId: string;
  portfolioName: string;
}

const SCALE = 0.25;
const PREVIEW_W = 280; // Ancho del contenedor
const PREVIEW_H = 157; // Alto del contenedor (280 * 9 / 16 para aspect-video)
const IFRAME_W = PREVIEW_W / SCALE; // 1120px ancho real
const IFRAME_H = PREVIEW_H / SCALE; // 628px alto real

function LiveIframePreview({ portfolioId, portfolioName }: LiveIframePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#0a0a0f] overflow-hidden"
    >
      {/* Skeleton mientras carga */}
      {(!inView || !loaded) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1a1d2e] to-[#0f111a] animate-pulse">
          <div className="w-full h-full p-4 flex flex-col gap-3">
            <div className="h-6 w-3/4 rounded bg-white/10" />
            <div className="h-3 w-1/2 rounded bg-white/5" />
            <div className="h-2.5 w-1/3 rounded bg-white/5" />
            <div className="flex-1 flex gap-2.5 mt-2">
              <div className="h-full flex-1 rounded-xl bg-white/5" />
              <div className="h-full flex-1 rounded-xl bg-white/5" />
            </div>
          </div>
          <svg
            className="absolute bottom-3 right-3 animate-spin text-[#8e80f5] opacity-50"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      )}

      {/* Iframe real escalado */}
      {inView && (
        <iframe
          src={`/p/${portfolioId}`}
          title={`Preview de ${portfolioName}`}
          onLoad={() => setLoaded(true)}
          tabIndex={-1}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: IFRAME_W,
            height: IFRAME_H,
            transform: `scale(${SCALE})`,
            transformOrigin: 'top left',
            border: 'none',
            pointerEvents: 'none',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      )}
    </div>
  );
}

// ── Rest of components ────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[240px] gap-4 px-4 text-center">
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
        Aún no has creado ningún portafolio. Elige una plantilla y dale vida a
        tu perfil.
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
  onShare,
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

  if (portfolios.length === 0) return <EmptyState />;

  return (
    <div className="space-y-6 overflow-y-auto pr-1">
      {portfolios.map((p) => {
        const isDeleteMode = mode === 'delete';
        const isPublishMode = mode === 'publish';
        const isShareMode = mode === 'share';
        const isPreviewMode = mode === 'preview';

        return (
          <div
            key={p.id}
            onClick={() => {
              if (isDeleteMode && onDelete) onDelete(p.id);
              else if (isPublishMode && onPublish) onPublish(p);
              else if (isShareMode && onShare) onShare(p.id);
              else if (onClick) onClick(p);
            }}
            className={`group relative rounded-2xl p-6 transition-all border flex flex-col gap-6 bg-[#1a1c29] cursor-pointer ${
              isDeleteMode
                ? 'border-red-500/40 hover:bg-red-500/5 hover:border-red-500/60 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                : isPublishMode
                  ? 'border-[#7c6bec]/20 hover:bg-[#7c6bec]/10 hover:border-[#7c6bec]/40'
                  : isShareMode
                    ? 'border-emerald-500/20 hover:bg-emerald-500/5 hover:border-emerald-500/60 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : isPreviewMode
                      ? 'border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40'
                      : 'border-white/5 hover:border-[#7c6bec]/30'
            }`}
          >
            {/* Ícono de Eliminar (Hover) */}
            {isDeleteMode && (
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                <div className="p-2.5 bg-red-500/20 rounded-xl text-red-400 border border-red-500/30 backdrop-blur-md shadow-lg">
                  <svg
                    width="18"
                    height="18"
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

            {/* Ícono de Compartir (Hover) */}
            {isShareMode && (
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                <div className="p-2.5 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/30 backdrop-blur-md shadow-lg">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </div>
              </div>
            )}

            {/* Badges en otros modos */}
            {(isPublishMode || isPreviewMode) && (
              <div className="absolute top-4 right-4 z-10 pointer-events-none">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm border ${
                    isPublishMode
                      ? 'bg-[#7c6bec]/90 border-[#7c6bec]'
                      : 'bg-blue-600/90 border-blue-500'
                  }`}
                >
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
                    {isPublishMode ? (
                      <>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                  {isPublishMode
                    ? 'Publicar'
                    : p.visibilidad === 'PUBLICO'
                      ? 'Visualizar'
                      : 'Previsualizar'}
                </span>
              </div>
            )}

            {/* Body */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-stretch">
              {/* Contenedor miniatura con Iframe en Vivo */}
              <div className="relative aspect-video w-full md:w-[280px] rounded-xl bg-[#0f111a] border border-white/5 overflow-hidden shrink-0 shadow-inner">
                <LiveIframePreview portfolioId={p.id} portfolioName={p.nombre} />

                {p.visibilidad === 'PUBLICO' &&
                  !isDeleteMode &&
                  !isShareMode && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <button
                        onClick={(e) => handleCopyLink(e, p)}
                        className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-black/75 hover:bg-black border border-white/10 rounded-full backdrop-blur-md text-white text-xs font-semibold transition-all transform hover:scale-105 shadow-xl"
                      >
                        {copiedId === p.id ? (
                          <>
                            <svg
                              className="w-3.5 h-3.5 text-emerald-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-emerald-400 font-bold">
                              Copiado
                            </span>
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                            Copiar enlace
                          </>
                        )}
                      </button>
                    </div>
                  )}
              </div>

              <div className="flex-1 min-w-0 py-2 flex flex-col justify-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#7c6bec]/15 flex items-center justify-center text-[#8e80f5] shrink-0 border border-white/5">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold pr-2 truncate">
                      {p.nombre}
                    </h3>
                    <div className="mt-1.5">
                      <VisibilityBadge value={p.visibilidad} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
