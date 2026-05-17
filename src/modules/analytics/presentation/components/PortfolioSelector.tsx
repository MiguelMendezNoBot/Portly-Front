import type { Portfolio } from '../../../portfolios/domain/entities/Portfolio';

interface PortfolioSelectorProps {
  portfolios: Portfolio[];
  selectedId: string | null;
  onChange: (id: string) => void;
  loading?: boolean;
}

/**
 * Dropdown selector de portafolio para la vista de analíticas individuales.
 */
export default function PortfolioSelector({
  portfolios,
  selectedId,
  onChange,
  loading,
}: PortfolioSelectorProps) {
  return (
    <div className="relative">
      <select
        id="portfolio-selector"
        value={selectedId || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading || portfolios.length === 0}
        className="w-full bg-src-171b28 border border-white/10 text-white rounded-xl px-4 py-3.5 pr-10 text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:border-src-7c6bec/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="" disabled>
          Seleccione un portafolio
        </option>
        {portfolios.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>
      {/* Chevron */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-src-6b7280">
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
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
