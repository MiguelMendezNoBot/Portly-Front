/** Respuesta de analíticas para un portafolio individual. */
export interface PortfolioAnalytics {
  totalVistas: number;
  visitantesUnicos: number;
  duracionTotalSegundos: number;
  chartData: ChartPoint[];
  proyectosRanking: RankingItem[];
  experienciasRanking: RankingItem[];
  redesSocialesRanking: RankingItem[];
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface RankingItem {
  id: string;
  nombre: string;
  clicks: number;
}

/** Periodos de filtro disponibles */
export type AnalyticsPeriod = 'all' | '30d' | '7d' | '24h';

export const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  all: 'Todo',
  '30d': 'Este Mes',
  '7d': 'Últimos 7 días',
  '24h': 'Últimas 24hrs',
};
