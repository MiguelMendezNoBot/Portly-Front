import { useState, useRef, useEffect } from 'react';
import type { ExplorePortfolio } from '../../domain/entities/ExplorePortfolio';

interface ExplorePortfolioCardProps {
  portfolio: ExplorePortfolio;
  query?: string;
  onClick: (portfolio: ExplorePortfolio) => void;
}

// ── Highlight matching text ───────────────────────────────────────────────────
function highlightText(text: string, query: string) {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            style={{
              background: 'rgba(124,107,236,0.3)',
              color: '#c4bef8',
              borderRadius: 2,
              padding: '0 2px',
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
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

// ── Template color palette ────────────────────────────────────────────────────
const TEMPLATE_COLORS: Record<string, string> = {
  dark: '#7c6bec',
  light: '#64748b',
  colorful: '#f97316',
  brutalist: '#000000',
  corporate: '#2563eb',
};

// ── Scale constants ───────────────────────────────────────────────────────────
// El iframe ocupa 400% del ancho del contenedor y 640px de alto.
// transform: scale(0.25) lo comprime a exactamente el tamaño del contenedor (160px alto).
const SCALE = 0.25;
const PREVIEW_H = 160; // alto visible del contenedor
const IFRAME_H = PREVIEW_H / SCALE; // 640px — alto real del iframe antes de escalar

// ── Main Card ─────────────────────────────────────────────────────────────────
export default function ExplorePortfolioCard({
  portfolio,
  query = '',
  onClick,
}: ExplorePortfolioCardProps) {
  const { propietario } = portfolio;
  const fullName = `${propietario.nombre} ${propietario.apellido}`.trim();
  const initials = fullName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const templateColor =
    TEMPLATE_COLORS[portfolio.templateNombre?.toLowerCase()] ?? '#7c6bec';
  const templateLabel = portfolio.templateNombre
    ? portfolio.templateNombre.charAt(0).toUpperCase() +
      portfolio.templateNombre.slice(1)
    : 'Template';

  // Lazy iframe load
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <button
      onClick={() => onClick(portfolio)}
      className="group w-full text-left bg-[#171B28] border border-white/8 rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#7c6bec]/40 hover:shadow-[0_8px_32px_rgba(124,107,236,0.15)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#7c6bec]/50"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Live mini-preview ──────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: PREVIEW_H,
          overflow: 'hidden',
          background: `${templateColor}18`,
          flexShrink: 0,
        }}
      >
        {/* Skeleton mientras carga */}
        {(!inView || !iframeLoaded) && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2"
            style={{ background: `${templateColor}10` }}
          >
            {/* Líneas de skeleton animadas */}
            <div className="w-full h-full absolute inset-0 animate-pulse">
              <div className="h-8 w-full" style={{ background: `${templateColor}15` }} />
              <div className="mt-4 mx-4 h-3 rounded" style={{ background: `${templateColor}10`, width: '60%' }} />
              <div className="mt-2 mx-4 h-2 rounded" style={{ background: `${templateColor}08`, width: '40%' }} />
              <div className="mt-6 mx-4 flex gap-2">
                <div className="h-12 flex-1 rounded-lg" style={{ background: `${templateColor}08` }} />
                <div className="h-12 flex-1 rounded-lg" style={{ background: `${templateColor}06` }} />
                <div className="h-12 flex-1 rounded-lg" style={{ background: `${templateColor}04` }} />
              </div>
            </div>
            {/* Spinner */}
            <svg
              className="absolute bottom-3 right-3 animate-spin"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={templateColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ opacity: 0.5 }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
        )}

        {/* Iframe del portafolio escalado */}
        {inView && (
          <iframe
            src={`/p/${portfolio.id}`}
            title={`Preview de ${portfolio.nombre}`}
            onLoad={() => setIframeLoaded(true)}
            tabIndex={-1}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              // 400% del contenedor → escalar a 0.25 = 100% del contenedor
              width: `${(1 / SCALE) * 100}%`,
              height: IFRAME_H,
              transform: `scale(${SCALE})`,
              transformOrigin: 'top left',
              border: 'none',
              pointerEvents: 'none',
              // Transición suave al aparecer
              opacity: iframeLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
        )}

        {/* Template badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm z-10"
          style={{
            background: `${templateColor}22`,
            border: `1px solid ${templateColor}55`,
            color: templateColor,
          }}
        >
          {templateLabel}
        </div>

        {/* Overlay en hover para indicar clickeable */}
        <div
          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* ── Card body ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Portfolio name */}
        <p className="text-white font-bold text-base leading-snug line-clamp-2">
          {highlightText(portfolio.nombre, query)}
        </p>

        {/* Owner info */}
        <div className="flex items-start gap-3 mt-auto">
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden text-sm font-bold mt-0.5"
            style={{
              background: `${templateColor}25`,
              border: `1.5px solid ${templateColor}55`,
              color: templateColor,
            }}
          >
            {propietario.avatarUrl ? (
              <img
                src={propietario.avatarUrl}
                alt={fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              initials
            )}
          </div>

          {/* Name + profession + description */}
          <div className="min-w-0 flex-1">
            <p className="text-[#e5e7eb] text-sm font-semibold leading-tight truncate">
              {highlightText(fullName, query)}
            </p>
            {propietario.profesion && (
              <p className="text-[#6b7280] text-xs leading-tight truncate mt-0.5">
                {highlightText(propietario.profesion, query)}
              </p>
            )}
            {propietario.descripcion && (
              <p className="text-[#4b5568] text-[11px] leading-snug mt-1.5 line-clamp-2">
                {highlightText(propietario.descripcion, query)}
              </p>
            )}
          </div>

          {/* Arrow */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#3d4560] group-hover:text-[#7c6bec] transition-colors shrink-0 mt-1"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
