import type { RankingItem } from '../../domain/entities/PortfolioAnalytics';

interface AnalyticsRankingTableProps {
  title: string;
  items: RankingItem[];
  emptyMessage?: string;
}

/**
 * Tabla de ranking reutilizable para experiencias y redes sociales.
 */
export default function AnalyticsRankingTable({
  title,
  items,
  emptyMessage = 'Sin datos',
}: AnalyticsRankingTableProps) {
  return (
    <div className="bg-src-171b28 border border-white/5 rounded-2xl p-5 flex-1 min-w-[280px]">
      <h3 className="text-white font-bold text-base mb-4">{title}</h3>
      {items.length === 0 ? (
        <p className="text-src-5a6278 text-sm">{emptyMessage}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              key={item.id || i}
              className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <span className="text-src-9ca3af text-sm truncate mr-3">
                {item.nombre}
              </span>
              <span className="text-white font-bold text-sm tabular-nums shrink-0">
                {item.clicks}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
