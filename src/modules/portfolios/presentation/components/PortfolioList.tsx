import type { Portfolio } from '../../domain/entities/Portfolio';

interface PortfolioListProps {
  portfolios: Portfolio[];
  loading: boolean;
  onDelete?: (id: string) => void;
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

export default function PortfolioList({ portfolios, loading, onDelete }: PortfolioListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 px-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-white/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (portfolios.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
      {portfolios.map((p) => (
        <div
          key={p.id}
          className="group flex items-center gap-3 bg-white/5 hover:bg-white/8 border border-white/5 hover:border-[#7c6bec]/30 rounded-xl px-3 py-2.5 transition-all duration-150 cursor-pointer"
        >
          {/* Icono / miniatura */}
          <div className="w-10 h-10 rounded-lg bg-[#7c6bec]/15 flex items-center justify-center shrink-0 overflow-hidden">
            {p.previewImageUrl ? (
              <img
                src={p.previewImageUrl}
                alt={p.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7c6bec"
                strokeWidth="1.6"
              >
                <path d="M2 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
              </svg>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{p.nombre}</p>
            <VisibilityBadge value={p.visibilidad} />
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {p.publicUrl && (
              <a
                href={p.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Ver portafolio"
                className="w-7 h-7 rounded-lg bg-[#7c6bec]/15 flex items-center justify-center hover:bg-[#7c6bec]/25 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b0a8f5" strokeWidth="2.2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <path d="M15 3h6v6" />
                  <path d="M10 14L21 3" strokeLinecap="round" />
                </svg>
              </a>
            )}
            {onDelete && (
              <button
                type="button"
                title="Eliminar"
                onClick={() => onDelete(p.id)}
                className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center hover:bg-red-500/25 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
