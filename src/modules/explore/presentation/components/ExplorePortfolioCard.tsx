import type { ExplorePortfolio } from '../../domain/entities/ExplorePortfolio';

interface ExplorePortfolioCardProps {
  portfolio: ExplorePortfolio;
  query?: string;
  onClick: (portfolio: ExplorePortfolio) => void;
}

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
            className="bg-[#7c6bec]/30 text-[#c4bef8] rounded-sm px-0.5"
            style={{ background: 'rgba(124,107,236,0.3)', color: '#c4bef8', borderRadius: 2, padding: '0 2px' }}
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

const TEMPLATE_COLORS: Record<string, string> = {
  dark: '#7c6bec',
  light: '#64748b',
  colorful: '#f97316',
  brutalist: '#000000',
  corporate: '#2563eb',
};

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

  const templateColor = TEMPLATE_COLORS[portfolio.templateNombre?.toLowerCase()] ?? '#7c6bec';
  const templateLabel = portfolio.templateNombre
    ? portfolio.templateNombre.charAt(0).toUpperCase() + portfolio.templateNombre.slice(1)
    : 'Template';

  return (
    <button
      onClick={() => onClick(portfolio)}
      className="group w-full text-left bg-[#171B28] border border-white/8 rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#7c6bec]/40 hover:shadow-[0_8px_32px_rgba(124,107,236,0.15)] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#7c6bec]/50"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* Preview Image */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 160, background: `${templateColor}18`, flexShrink: 0 }}
      >
        {portfolio.previewImageUrl ? (
          <img
            src={portfolio.previewImageUrl}
            alt={portfolio.nombre}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke={templateColor}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.5 }}
            >
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
        )}

        {/* Template badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
          style={{
            background: `${templateColor}22`,
            border: `1px solid ${templateColor}55`,
            color: templateColor,
          }}
        >
          {templateLabel}
        </div>

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: `linear-gradient(to top, ${templateColor}22 0%, transparent 60%)` }}
        />
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Portfolio name */}
        <p className="text-white font-bold text-base leading-snug">
          {highlightText(portfolio.nombre, query)}
        </p>

        {/* Owner info */}
        <div className="flex items-center gap-2.5 mt-auto">
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden text-xs font-bold"
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

          {/* Name + profession */}
          <div className="min-w-0 flex-1">
            <p className="text-[#e5e7eb] text-sm font-semibold leading-tight truncate">
              {highlightText(fullName, query)}
            </p>
            {propietario.profesion && (
              <p className="text-[#6b7280] text-xs leading-tight truncate mt-0.5">
                {highlightText(propietario.profesion, query)}
              </p>
            )}
          </div>

          {/* Arrow icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#3d4560] group-hover:text-[#7c6bec] transition-colors shrink-0"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
