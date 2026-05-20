import { useState } from 'react';
import { usePortfolios } from '../../../portfolios/application/usePortfolios';
import { usePortfolioAnalytics } from '../../application/usePortfolioAnalytics';
import { useGlobalAnalytics } from '../../application/useGlobalAnalytics';
import type { AnalyticsPeriod } from '../../domain/entities/PortfolioAnalytics';
import { PERIOD_LABELS } from '../../domain/entities/PortfolioAnalytics';
import PortfolioSelector from '../components/PortfolioSelector';
import AnalyticsKpiCard from '../components/AnalyticsKpiCard';
import AnalyticsLineChart from '../components/AnalyticsLineChart';
import AnalyticsMultiLineChart from '../components/AnalyticsMultiLineChart';
import AnalyticsRankingTable from '../components/AnalyticsRankingTable';

// ─── KPI Icons (inline SVGs) ──────────────────────────────────────────────────

const icons = {
  vistas: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  clics: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
    </svg>
  ),
  visitantes: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  ),
  tiempo: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds} seg.`;
  if (totalSeconds < 3600) {
    const mins = Math.floor(totalSeconds / 60);
    return `${mins} min.`;
  }
  const hours = totalSeconds / 3600;
  if (hours >= 1000) return `${(hours / 1000).toFixed(1)}K Hrs.`;
  return `${hours.toFixed(hours < 10 ? 1 : 0)} Hrs.`;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString('es-BO');
}

// ─── Period filter buttons ────────────────────────────────────────────────────

const PERIODS: AnalyticsPeriod[] = ['all', '30d', '7d', '24h'];

// ─── Chart labels per period ─────────────────────────────────────────────────

const CHART_LABELS: Record<AnalyticsPeriod, { title: string; subtitle: string }> = {
  all: {
    title: 'Visualizaciones totales',
    subtitle: 'Todas las vistas registradas desde la creación del portafolio.',
  },
  '30d': {
    title: 'Visualizaciones de los últimos 30 días',
    subtitle: 'Vistas acumuladas por portafolio durante los últimos 30 días.',
  },
  '7d': {
    title: 'Visualizaciones de los últimos 7 días',
    subtitle: 'Vistas acumuladas por portafolio durante los últimos 7 días.',
  },
  '24h': {
    title: 'Visualizaciones de las últimas 24 horas',
    subtitle: 'Vistas acumuladas por portafolio durante las últimas 24 horas.',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { portfolios, loading: loadingPortfolios } = usePortfolios();
  const [modo, setModo] = useState<'Global' | 'Individual'>('Global');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [period, setPeriod] = useState<AnalyticsPeriod>('24h');

  const { data: indData, loading: indLoading } = usePortfolioAnalytics(selectedId, period);
  const { data: globalData, loading: globalLoading } = useGlobalAnalytics(period);

  // Auto-select first portfolio
  const handlePortfolioChange = (id: string) => setSelectedId(id);

  const publicPortfolios = portfolios.filter(p => p.visibilidad === 'PUBLICO');

  const selectedPortfolio = publicPortfolios.find((p) => p.id === selectedId);

  return (
    <div className="flex flex-col gap-6 pt-1 pb-2 animate-fade-in">
      {/* Header with tabs + period filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Global / Individual toggle */}
        <div className="flex items-center gap-0 bg-src-171b28 border border-white/10 rounded-full p-1">
          <button
            type="button"
            onClick={() => setModo('Global')}
            className={`px-5 py-2 rounded-full text-sm transition-colors ${
              modo === 'Global'
                ? 'font-bold bg-white text-src-0f111a shadow-sm'
                : 'font-medium text-src-6b7280 hover:text-src-9ca3af'
            }`}
          >
            Global
          </button>
          <button
            type="button"
            onClick={() => setModo('Individual')}
            className={`px-5 py-2 rounded-full text-sm transition-colors ${
              modo === 'Individual'
                ? 'font-bold bg-white text-src-0f111a shadow-sm'
                : 'font-medium text-src-6b7280 hover:text-src-9ca3af'
            }`}
          >
            Individual
          </button>
        </div>

        {/* Period filters */}
        <div className="flex items-center gap-0 bg-src-171b28 border border-white/10 rounded-full p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                period === p
                  ? 'bg-white text-src-0f111a shadow-sm font-bold'
                  : 'text-src-6b7280 hover:text-src-9ca3af'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio selector solo en Individual */}
      {modo === 'Individual' && (
        <PortfolioSelector
          portfolios={publicPortfolios}
          selectedId={selectedId}
          onChange={handlePortfolioChange}
          loading={loadingPortfolios}
        />
      )}

      {/* Content */}
      {modo === 'Global' ? (
        globalLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-src-7c6bec/30 border-t-src-7c6bec rounded-full animate-spin" />
              <p className="text-src-6b7280 text-sm">Cargando analíticas globales...</p>
            </div>
          </div>
        ) : globalData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <AnalyticsKpiCard icon={icons.vistas} label="Vistas totales" value={formatNumber(globalData.totalVistas)} iconColor="#7c6bec" />
              <AnalyticsKpiCard icon={icons.visitantes} label="Visitantes únicos totales" value={formatNumber(globalData.visitantesUnicos)} iconColor="#22c55e" />
              <AnalyticsKpiCard icon={icons.tiempo} label="Tiempo medio de visualización" value={formatDuration(Math.round(globalData.duracionTotalSegundos / Math.max(1, globalData.totalVistas)))} iconColor="#3b82f6" />
              <AnalyticsKpiCard icon={icons.tiempo} label="Tiempo total de visualización" value={formatDuration(globalData.duracionTotalSegundos)} iconColor="#818cf8" />
            </div>
            <AnalyticsMultiLineChart title={CHART_LABELS[period].title} subtitle={CHART_LABELS[period].subtitle} series={globalData.chartSeries} period={period} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center">
            <p className="text-red-400 font-semibold">Error al cargar analíticas globales</p>
            <p className="text-src-5a6278 text-sm max-w-[300px]">No se pudieron obtener los datos. Verifica que el backend esté corriendo.</p>
          </div>
        )
      ) : (
        /* Modo Individual */
        !selectedId ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-src-7c6bec/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-src-7c6bec">
                <path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 4-6" />
              </svg>
            </div>
            <p className="text-white font-semibold">Selecciona un portafolio</p>
            <p className="text-src-5a6278 text-sm max-w-[260px]">
              Elige un portafolio del selector para ver sus analíticas detalladas.
            </p>
          </div>
        ) : indLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-src-7c6bec/30 border-t-src-7c6bec rounded-full animate-spin" />
              <p className="text-src-6b7280 text-sm">Cargando analíticas...</p>
            </div>
          </div>
        ) : indData ? (
          <>
            {/* KPI cards individual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AnalyticsKpiCard icon={icons.vistas} label="Vistas" value={formatNumber(indData.totalVistas)} iconColor="#7c6bec" />
              <AnalyticsKpiCard icon={icons.visitantes} label="Visitantes únicos" value={formatNumber(indData.visitantesUnicos)} iconColor="#22c55e" />
              <AnalyticsKpiCard icon={icons.tiempo} label="Tiempo total de visualización" value={formatDuration(indData.duracionTotalSegundos)} iconColor="#818cf8" />
            </div>

            {/* Chart individual */}
            <AnalyticsLineChart title={selectedPortfolio?.nombre || 'Portafolio'} data={indData.chartData} period={period} />

            {/* Rankings side by side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AnalyticsRankingTable title="Vistas por proyecto" items={indData.proyectosRanking} emptyMessage="Sin interacciones en proyectos" />
              <AnalyticsRankingTable title="Vistas por experiencia" items={indData.experienciasRanking} emptyMessage="Sin interacciones en experiencias" />
              <AnalyticsRankingTable title="Redes Sociales" items={indData.redesSocialesRanking} emptyMessage="Sin interacciones en redes" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center">
            <p className="text-red-400 font-semibold">Error al cargar analíticas</p>
            <p className="text-src-5a6278 text-sm max-w-[300px]">No se pudieron obtener los datos del portafolio seleccionado.</p>
          </div>
        )
      )}
    </div>
  );
}
